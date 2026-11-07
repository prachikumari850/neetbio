from datetime import datetime, timezone
from functools import lru_cache

from bson import ObjectId
from bson.errors import InvalidId

from app.core.config import get_settings
from app.core.errors import AppError
from app.repositories import generated_diagram_repository as repository
from app.schemas.generated_diagram import (
    GeneratedDiagramDetail,
    GeneratedDiagramList,
    GeneratedDiagramSummary,
)
from app.services import diagram_layout, ollama_client
from app.services.ollama_client import (
    InvalidModelOutput,
    OllamaError,
    OllamaUnavailable,
)

MIN_PARTS = 3
MAX_PARTS = 8
TITLE_MAX_LENGTH = 80
NAME_MAX_LENGTH = 40
DESCRIPTION_MAX_LENGTH = 160
KINDS = ("structure", "process", "cycle")

SPEC_SCHEMA = {
    "type": "object",
    "properties": {
        "is_biology": {"type": "boolean"},
        "kind": {"type": "string", "enum": list(KINDS)},
        "title": {"type": "string"},
        "parts": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "description": {"type": "string"},
                },
                "required": ["name", "description"],
            },
        },
    },
    "required": ["is_biology", "kind", "title", "parts"],
}

# One generation at a time: two model runs would slow each other badly on a CPU.
_state = {"busy": False}


class InvalidSpec(ValueError):
    pass


@lru_cache
def load_prompt() -> str:
    path = get_settings().prompts_dir / "diagram_spec.txt"
    return path.read_text(encoding="utf-8").strip()


def _clean(value, limit: int) -> str:
    text = " ".join(str(value).split())

    if len(text) <= limit:
        return text

    return text[: limit - 1].rstrip() + "…"


def normalize_spec(raw: dict) -> dict:
    if not isinstance(raw, dict) or raw.get("kind") not in KINDS:
        raise InvalidSpec("The diagram type is missing or unknown.")

    title = _clean(raw.get("title") or "", TITLE_MAX_LENGTH)
    if not title:
        raise InvalidSpec("The diagram has no title.")

    parts = []
    seen = set()

    for item in raw.get("parts") or []:
        if not isinstance(item, dict):
            continue

        name = _clean(item.get("name") or "", NAME_MAX_LENGTH)
        key = name.casefold()

        if not name or key in seen:
            continue

        seen.add(key)
        parts.append(
            {
                "name": name,
                "description": _clean(item.get("description") or "", DESCRIPTION_MAX_LENGTH),
            }
        )

    if len(parts) < MIN_PARTS:
        raise InvalidSpec("The diagram has too few parts.")

    return {"kind": raw["kind"], "title": title, "parts": parts[:MAX_PARTS]}


def _busy_error() -> AppError:
    return AppError(
        "Another diagram is being generated. Please wait a moment and try again.",
        429,
        "generation_busy",
    )


def _not_found() -> AppError:
    return AppError("Diagram not found.", 404, "generated_diagram_not_found")


def _parse_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise _not_found() from None


def _to_detail(document: dict) -> GeneratedDiagramDetail:
    summary = GeneratedDiagramSummary.from_document(document)

    return GeneratedDiagramDetail(
        **summary.model_dump(),
        prompt=document["prompt"],
        parts=document["parts"],
        scene=diagram_layout.build_scene(document["kind"], document["parts"]),
    )


async def _request_spec(prompt: str) -> dict:
    messages = [
        {"role": "system", "content": load_prompt()},
        {"role": "user", "content": f"Diagram request: {prompt}"},
    ]

    for _ in range(get_settings().diagram_max_attempts):
        try:
            raw = await ollama_client.generate_json(messages, SPEC_SCHEMA)
        except InvalidModelOutput:
            continue
        except OllamaUnavailable as error:
            raise AppError(error.message, 503, "ai_unavailable") from error
        except OllamaError as error:
            raise AppError(error.message, 502, "ai_error") from error

        if raw.get("is_biology") is False:
            raise AppError(
                "I can only generate Biology diagrams. Describe a Biology topic, "
                "such as “human heart” or “Krebs cycle”.",
                422,
                "not_biology",
            )

        try:
            return normalize_spec(raw)
        except InvalidSpec:
            continue

    raise AppError(
        "The AI could not produce a usable diagram. Try rephrasing your request.",
        502,
        "diagram_unusable",
    )


async def generate_diagram(user: dict, prompt: str) -> GeneratedDiagramDetail:
    if _state["busy"]:
        raise _busy_error()

    _state["busy"] = True

    try:
        limit = get_settings().saved_diagram_limit

        if await repository.count_for_user(user["_id"]) >= limit:
            raise AppError(
                f"You can keep up to {limit} generated diagrams. Delete one to make more.",
                409,
                "diagram_limit",
            )

        spec = await _request_spec(prompt)
    finally:
        _state["busy"] = False

    document = {
        "_id": ObjectId(),
        "user_id": user["_id"],
        "prompt": prompt,
        "created_at": datetime.now(timezone.utc),
        **spec,
    }
    await repository.insert(document)

    return _to_detail(document)


async def list_diagrams(user: dict) -> GeneratedDiagramList:
    documents = await repository.list_for_user(
        user["_id"], get_settings().saved_diagram_limit
    )
    return GeneratedDiagramList(
        items=[GeneratedDiagramSummary.from_document(document) for document in documents]
    )


async def get_diagram(user: dict, diagram_id: str) -> GeneratedDiagramDetail:
    document = await repository.find_for_user(user["_id"], _parse_id(diagram_id))

    if document is None:
        raise _not_found()

    return _to_detail(document)


async def delete_diagram(user: dict, diagram_id: str) -> None:
    if not await repository.delete(user["_id"], _parse_id(diagram_id)):
        raise _not_found()