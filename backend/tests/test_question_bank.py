import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from app.schemas.question import QuestionRecord
from app.services import question_bank

STARTER_FILE = (
    Path(__file__).resolve().parents[1] / "app" / "questions" / "data" / "starter_questions.json"
)

SOURCE = {"type": "ai_drafted", "name": "Test source"}


def raw_question(**changes) -> dict:
    question = {
        "id": "test-001",
        "subject": "botany",
        "unit": "plant-physiology",
        "chapter": "Transport in Plants",
        "topic": "Water potential",
        "class_level": "11",
        "difficulty": "easy",
        "text": "Which of the following is the correct statement?",
        "options": ["One", "Two", "Three", "Four"],
        "correct_index": 1,
        "explanation": "Two is correct because this is a test fixture with enough words.",
        "source": SOURCE,
    }
    return {**question, **changes}


def record(**changes) -> QuestionRecord:
    return QuestionRecord.model_validate(raw_question(**changes))


def test_the_starter_file_is_valid_and_honestly_labelled():
    records, errors = question_bank.load_question_file(STARTER_FILE)

    assert errors == []
    assert len(records) >= 30
    assert len({item.id for item in records}) == len(records)
    assert {item.subject for item in records} == {"botany", "zoology"}
    assert {item.source.type for item in records} == {"ai_drafted"}


def test_the_starter_file_has_no_duplicates():
    records, _ = question_bank.load_question_file(STARTER_FILE)

    errors, _warnings = question_bank.find_duplicate_issues(records, [])

    assert errors == []


@pytest.mark.parametrize("options", [["A", "B", "C"], ["A", "B", "C", "D", "E"]])
def test_exactly_four_options_are_required(options):
    with pytest.raises(ValidationError):
        record(options=options)


def test_duplicate_options_are_rejected():
    with pytest.raises(ValidationError):
        record(options=["Same", "same ", "Three", "Four"])


def test_the_correct_index_must_be_one_of_the_options():
    with pytest.raises(ValidationError):
        record(correct_index=4)


@pytest.mark.parametrize("bad_id", ["Has Capitals", "has space", "ab"])
def test_ids_must_be_simple_slugs(bad_id):
    with pytest.raises(ValidationError):
        record(id=bad_id)


def test_assertion_reason_questions_need_both_parts():
    with pytest.raises(ValidationError):
        record(type="assertion_reason")


def test_previous_year_questions_need_year_paper_official_key_and_rights_note():
    with pytest.raises(ValidationError):
        record(source={"type": "pyq", "name": "NEET paper"})

    accepted = record(
        source={
            "type": "pyq",
            "name": "NEET (UG) 2023",
            "year": 2023,
            "paper": "Code 01",
            "answer_key_url": "https://example.org/official-key.pdf",
            "rights_note": "Reuse confirmed in writing, see docs.",
        }
    )

    assert accepted.source.year == 2023


def test_open_licensed_questions_need_a_url_and_license():
    with pytest.raises(ValidationError):
        record(source={"type": "open_licensed", "name": "Open book"})


def test_source_urls_must_be_http():
    with pytest.raises(ValidationError):
        record(source={**SOURCE, "url": "javascript:alert(1)"})


def test_defaults_are_merged_and_the_source_is_combined(tmp_path):
    question = raw_question()
    del question["class_level"], question["source"]
    path = tmp_path / "questions.json"
    path.write_text(
        json.dumps(
            {
                "defaults": {"class_level": "12", "source": SOURCE},
                "questions": [{**question, "source": {"notes": "extra"}}],
            }
        ),
        encoding="utf-8",
    )

    records, errors = question_bank.load_question_file(path)

    assert errors == []
    assert records[0].class_level == "12"
    assert records[0].source.name == "Test source"
    assert records[0].source.notes == "extra"


def test_file_errors_name_the_question_and_field(tmp_path):
    path = tmp_path / "questions.json"
    path.write_text(json.dumps([raw_question(options=["A", "B"])]), encoding="utf-8")

    records, errors = question_bank.load_question_file(path)

    assert records == []
    assert any(error.startswith("test-001: options") for error in errors)


def test_unreadable_files_are_reported(tmp_path):
    _, errors = question_bank.load_question_file(tmp_path / "missing.json")

    assert errors


def test_duplicate_ids_and_texts_are_errors_and_near_copies_are_warnings():
    original = record()
    same_text = record(id="test-002")
    near = record(
        id="test-003",
        text="Which of the following is the correct statement here?",
    )
    different = record(id="test-004", text="What is the unit of water potential in plants?")

    errors, warnings = question_bank.find_duplicate_issues(
        [original, same_text, near, different], []
    )

    assert any("test-002" in error for error in errors)
    assert any("test-003" in warning for warning in warnings)
    assert not any("test-004" in message for message in errors + warnings)


def test_a_question_matching_one_already_in_the_bank_is_an_error():
    errors, _ = question_bank.find_duplicate_issues(
        [record(id="test-009")], [{"_id": "bot-001", "text": record().text}]
    )

    assert any("bot-001" in error for error in errors)


def test_the_content_hash_ignores_the_source_but_not_the_answer():
    base = record()

    assert question_bank.content_hash(base) == question_bank.content_hash(
        record(source={**SOURCE, "name": "Another source"})
    )
    assert question_bank.content_hash(base) != question_bank.content_hash(
        record(correct_index=2)
    )


def test_new_documents_start_as_drafts():
    document = question_bank.build_document(record(), None)

    assert document["_id"] == "test-001"
    assert "id" not in document
    assert document["review"]["status"] == "draft"


def test_review_survives_unchanged_content_and_resets_on_changes():
    reviewed = {"status": "reviewed", "reviewed_by": "someone", "reviewed_at": None}
    existing = {**question_bank.build_document(record(), None), "review": reviewed}

    unchanged = question_bank.build_document(record(), existing)
    changed = question_bank.build_document(record(correct_index=2), existing)

    assert unchanged["review"]["status"] == "reviewed"
    assert changed["review"]["status"] == "draft"