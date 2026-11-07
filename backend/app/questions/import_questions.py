import argparse
import asyncio
from dataclasses import dataclass
from pathlib import Path

from app.questions.cli_support import database_session
from app.repositories import question_repository
from app.schemas.question import QuestionRecord
from app.services import question_bank


@dataclass
class ImportSummary:
    created: int = 0
    updated: int = 0
    unchanged: int = 0


async def import_records(records: list[QuestionRecord]) -> ImportSummary:
    existing = {
        document["_id"]: document
        for document in await question_repository.find_by_ids(
            [record.id for record in records], with_answers=True
        )
    }
    summary = ImportSummary()
    documents = []

    for record in records:
        document = question_bank.build_document(record, existing.get(record.id))
        previous = existing.get(record.id)

        if previous is None:
            summary.created += 1
        elif previous["content_hash"] == document["content_hash"]:
            summary.unchanged += 1
        else:
            summary.updated += 1

        documents.append(document)

    await question_repository.upsert_many(documents)
    return summary


async def run(records: list[QuestionRecord], dry_run: bool) -> int:
    async with database_session():
        errors, warnings = question_bank.find_duplicate_issues(
            records, await question_repository.list_texts()
        )

        for warning in warnings:
            print(f"warning: {warning}")

        if errors:
            for error in errors:
                print(f"error: {error}")
            return 1

        if dry_run:
            print(f"OK: {len(records)} questions are valid. Nothing was imported (dry run).")
            return 0

        summary = await import_records(records)

    print(
        f"Imported {len(records)} questions: {summary.created} new, "
        f"{summary.updated} changed (review reset to draft), {summary.unchanged} unchanged."
    )
    print("New and changed questions are DRAFTS. Review them: python -m app.questions.review list")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate and import a question file.")
    parser.add_argument("path", type=Path, help="JSON file with the questions")
    parser.add_argument("--dry-run", action="store_true", help="validate only")
    args = parser.parse_args(argv)

    records, errors = question_bank.load_question_file(args.path)

    if errors:
        for error in errors:
            print(f"error: {error}")
        print(f"Nothing was imported. Fix the {len(errors)} problem(s) above.")
        return 1

    return asyncio.run(run(records, args.dry_run))


if __name__ == "__main__":
    raise SystemExit(main())