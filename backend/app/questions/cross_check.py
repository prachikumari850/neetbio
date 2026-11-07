import argparse
import asyncio
from datetime import datetime, timezone

from app.core.config import get_settings
from app.questions.cli_support import database_session
from app.repositories import question_repository
from app.services import ollama_client
from app.services.ollama_client import InvalidModelOutput, OllamaError

LETTERS = "ABCD"
SCHEMA = {
    "type": "object",
    "properties": {"answer": {"type": "string", "enum": list(LETTERS)}},
    "required": ["answer"],
}
SYSTEM_PROMPT = (
    "You are answering a NEET Biology multiple-choice question. Choose the single best "
    'option and reply as JSON, for example {"answer": "A"}.'
)


async def check_question(document: dict) -> dict:
    options = "\n".join(
        f"{LETTERS[index]}) {option}" for index, option in enumerate(document["options"])
    )
    raw = await ollama_client.generate_json(
        [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"{document['text']}\n{options}"},
        ],
        SCHEMA,
    )
    answer = str(raw.get("answer", "")).strip().upper()

    if answer not in LETTERS:
        raise InvalidModelOutput("The model gave no usable answer.")

    answer_index = LETTERS.index(answer)
    return {
        "model": get_settings().ollama_chat_model,
        "answer_index": answer_index,
        "agrees": answer_index == document["correct_index"],
        "checked_at": datetime.now(timezone.utc),
    }


async def run(recheck: bool) -> int:
    disagreements: list[str] = []

    async with database_session():
        documents = await question_repository.list_by_status("draft")
        pending = [item for item in documents if recheck or not item.get("ai_check")]
        print(f"Checking {len(pending)} draft question(s) with the local model...")

        for document in pending:
            try:
                check = await check_question(document)
            except InvalidModelOutput:
                print(f"{document['_id']}: model gave no usable answer, skipped")
                continue
            except OllamaError as error:
                print(f"Stopped: {error.message}")
                return 1

            await question_repository.set_ai_check(document["_id"], check)
            verdict = "agrees" if check["agrees"] else "DISAGREES"
            print(f"{document['_id']}: {verdict}")

            if not check["agrees"]:
                disagreements.append(document["_id"])

    print(f"Done. {len(disagreements)} disagreement(s): {', '.join(disagreements) or 'none'}")
    print(
        "A disagreement means: read that question carefully. Agreement does NOT prove the "
        "answer key is right, because a small model is often wrong."
    )
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Ask the local model to answer draft questions.")
    parser.add_argument("--recheck", action="store_true", help="also re-check questions already checked")
    return asyncio.run(run(parser.parse_args(argv).recheck))


if __name__ == "__main__":
    raise SystemExit(main())