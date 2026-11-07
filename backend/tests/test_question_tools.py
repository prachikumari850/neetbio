import asyncio

from app.database.mongodb import close_mongo_connection, connect_to_mongo
from app.questions import import_questions, review
from app.services import question_bank
from tests.test_question_bank import STARTER_FILE


def run(action):
    async def runner():
        await connect_to_mongo()
        try:
            return await action()
        finally:
            await close_mongo_connection()

    return asyncio.run(runner())


def load_records():
    records, errors = question_bank.load_question_file(STARTER_FILE)
    assert errors == []
    return records


def test_import_creates_drafts_students_cannot_see(test_database):
    records = load_records()

    summary = run(lambda: import_questions.import_records(records))

    assert summary.created == len(records)
    assert test_database["questions"].count_documents({"review.status": "draft"}) == len(records)
    assert test_database["questions"].count_documents({"review.status": "reviewed"}) == 0


def test_approving_marks_questions_reviewed_with_the_reviewer(test_database):
    records = load_records()
    run(lambda: import_questions.import_records(records))

    result = run(lambda: review.approve_questions(["bot-001"], "Priya", force=False))

    stored = test_database["questions"].find_one({"_id": "bot-001"})
    assert result.approved == 1
    assert stored["review"]["status"] == "reviewed"
    assert stored["review"]["reviewed_by"] == "Priya"


def test_reimporting_unchanged_questions_keeps_their_approval(test_database):
    records = load_records()
    run(lambda: import_questions.import_records(records))
    run(lambda: review.approve_questions(None, "Priya", force=False))

    summary = run(lambda: import_questions.import_records(records))

    assert summary.unchanged == len(records)
    assert test_database["questions"].count_documents({"review.status": "reviewed"}) == len(records)


def test_changing_a_question_resets_its_approval(test_database):
    records = load_records()
    run(lambda: import_questions.import_records(records))
    run(lambda: review.approve_questions(None, "Priya", force=False))
    edited = [
        records[0].model_copy(update={"correct_index": (records[0].correct_index + 1) % 4}),
        *records[1:],
    ]

    summary = run(lambda: import_questions.import_records(edited))

    assert summary.updated == 1
    assert test_database["questions"].find_one({"_id": records[0].id})["review"]["status"] == "draft"
    assert test_database["questions"].count_documents({"review.status": "reviewed"}) == len(records) - 1


def test_an_ai_disagreement_blocks_approval_unless_forced(test_database):
    records = load_records()
    run(lambda: import_questions.import_records(records))
    test_database["questions"].update_one(
        {"_id": "bot-001"}, {"$set": {"ai_check": {"agrees": False, "answer_index": 0}}}
    )

    blocked = run(lambda: review.approve_questions(None, "Priya", force=False))
    forced = run(lambda: review.approve_questions(["bot-001"], "Priya", force=True))

    assert blocked.blocked == ["bot-001"]
    assert blocked.approved == len(records) - 1
    assert forced.approved == 1


def test_rejected_questions_stay_hidden(test_database):
    records = load_records()
    run(lambda: import_questions.import_records(records))

    run(lambda: review.reject_questions(["bot-002"]))
    run(lambda: review.approve_questions(None, "Priya", force=False))

    assert test_database["questions"].find_one({"_id": "bot-002"})["review"]["status"] == "rejected"