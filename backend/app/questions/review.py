import argparse
import asyncio
from dataclasses import dataclass

from app.questions.cli_support import database_session
from app.repositories import question_repository

LETTERS = "ABCD"


@dataclass
class ApprovalResult:
    approved: int
    blocked: list[str]
    unknown: list[str]


def describe_ai_check(document: dict) -> str:
    check = document.get("ai_check")

    if not check:
        return "AI check: not run"

    if check["agrees"]:
        return "AI check: agrees"

    return f"AI check: DISAGREES (model chose {LETTERS[check['answer_index']]})"


def format_question(document: dict) -> str:
    source = document["source"]
    lines = [
        f"{document['_id']}  [{document['subject']} / {document['unit']} / "
        f"{document['chapter']} / {document['topic']}]  {document['difficulty']}",
        "",
        document["text"],
    ]

    for index, option in enumerate(document["options"]):
        marker = "  <-- marked correct" if index == document["correct_index"] else ""
        lines.append(f"  {LETTERS[index]}) {option}{marker}")

    lines += [
        "",
        f"Explanation: {document['explanation']}",
        f"Source: {source['type']} – {source['name']}",
        describe_ai_check(document),
        f"Review status: {document['review']['status']}",
    ]
    return "\n".join(lines)


async def approve_questions(
    ids: list[str] | None, reviewer: str, force: bool
) -> ApprovalResult:
    if ids is None:
        documents = await question_repository.list_by_status("draft")
        unknown: list[str] = []
    else:
        documents = await question_repository.find_by_ids(ids, with_answers=True)
        found = {document["_id"] for document in documents}
        unknown = [question_id for question_id in ids if question_id not in found]

    pending = [
        document for document in documents if document["review"]["status"] != "reviewed"
    ]
    blocked = [
        document["_id"]
        for document in pending
        if document.get("ai_check") and not document["ai_check"]["agrees"] and not force
    ]
    approvable = [
        document["_id"] for document in pending if document["_id"] not in blocked
    ]
    approved = await question_repository.set_review(approvable, "reviewed", reviewer)

    return ApprovalResult(approved=approved, blocked=blocked, unknown=unknown)


async def reject_questions(ids: list[str]) -> int:
    return await question_repository.set_review(ids, "rejected", None)


async def run(args: argparse.Namespace) -> int:
    async with database_session():
        if args.command == "list":
            documents = await question_repository.list_by_status(args.status)
            for document in documents:
                print(
                    f"{document['_id']:<12} {document['subject']:<8} "
                    f"{document['difficulty']:<7} {describe_ai_check(document):<34} "
                    f"{document['chapter']}"
                )
            print(f"{len(documents)} question(s) with status '{args.status}'.")
            return 0

        if args.command == "show":
            documents = await question_repository.find_by_ids(args.ids, with_answers=True)
            for document in documents:
                print(format_question(document))
                print("-" * 70)
            return 0

        if args.command in ("approve", "approve-all"):
            ids = args.ids if args.command == "approve" else None
            result = await approve_questions(ids, args.by, args.force)
            print(f"Approved {result.approved} question(s) as '{args.by}'.")
            if result.blocked:
                print(
                    "Blocked because the AI check disagreed (read them, then use --force "
                    f"if the marked answer is right): {', '.join(result.blocked)}"
                )
            if result.unknown:
                print(f"Unknown ids: {', '.join(result.unknown)}")
            return 0

        rejected = await reject_questions(args.ids)
        print(f"Rejected {rejected} question(s). They will not be shown to students.")
        return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Review questions before students see them.")
    commands = parser.add_subparsers(dest="command", required=True)

    list_parser = commands.add_parser("list", help="list questions by status")
    list_parser.add_argument("--status", default="draft", choices=["draft", "reviewed", "rejected"])

    show_parser = commands.add_parser("show", help="print questions in full")
    show_parser.add_argument("ids", nargs="+")

    approve_parser = commands.add_parser("approve", help="approve specific questions")
    approve_parser.add_argument("ids", nargs="+")

    approve_all_parser = commands.add_parser(
        "approve-all", help="approve every draft (read them first!)"
    )

    for sub_parser in (approve_parser, approve_all_parser):
        sub_parser.add_argument("--by", required=True, help="your name, stored with the approval")
        sub_parser.add_argument("--force", action="store_true", help="also approve AI disagreements")

    reject_parser = commands.add_parser("reject", help="hide questions from students")
    reject_parser.add_argument("ids", nargs="+")

    return asyncio.run(run(parser.parse_args(argv)))


if __name__ == "__main__":
    raise SystemExit(main())