import json
from datetime import datetime, timezone

import pytest

from app.services import question_bank
from tests.test_question_bank import STARTER_FILE

CATALOG_URL = "/api/v1/practice/catalog"
STATS_URL = "/api/v1/practice/stats"
ATTEMPTS_URL = "/api/v1/practice/attempts"


@pytest.fixture
def bank(db_client, test_database):
    records, errors = question_bank.load_question_file(STARTER_FILE)
    assert errors == []

    documents = []
    for item in records:
        document = question_bank.build_document(item, None)
        document["review"] = {
            "status": "reviewed",
            "reviewed_by": "tester",
            "reviewed_at": datetime.now(timezone.utc),
        }
        documents.append(document)

    test_database["questions"].insert_many(documents)
    return db_client


def start(client, headers, **request):
    return client.post(ATTEMPTS_URL, json=request, headers=headers)


def start_area(client, headers, area="botany"):
    return start(client, headers, mode="area", area=area).json()


def answers_for(test_database, attempt, correct=1, wrong=1):
    ids = [question["id"] for question in attempt["questions"]]
    stored = {
        item["_id"]: item["correct_index"]
        for item in test_database["questions"].find({"_id": {"$in": ids}})
    }
    answers = {}

    for question_id in ids[:correct]:
        answers[question_id] = stored[question_id]
    for question_id in ids[correct : correct + wrong]:
        answers[question_id] = (stored[question_id] + 1) % 4

    return answers


def test_practice_requires_login(bank):
    assert bank.get(CATALOG_URL).status_code == 401
    assert bank.post(ATTEMPTS_URL, json={"mode": "mock", "count": 10}).status_code == 401


def test_catalog_counts_reviewed_questions_by_subject_and_area(bank, make_user):
    body = bank.get(CATALOG_URL, headers=make_user()).json()
    areas = {area["id"]: area["count"] for area in body["areas"]}

    assert body["totals"] == {"questions": 33, "botany": 18, "zoology": 15}
    assert areas["human-physiology"] == 6
    assert areas["ecology"] == 2
    assert body["mock_sizes"] == [10, 20, 30]
    assert body["pyq_years"] == []


def test_catalog_lists_only_chapters_with_enough_questions(bank, make_user):
    chapters = bank.get(CATALOG_URL, headers=make_user()).json()["chapters"]
    by_name = {chapter["name"]: chapter for chapter in chapters}

    assert len(chapters) == 6
    assert by_name["Photosynthesis in Higher Plants"]["count"] == 3
    assert by_name["Cell: The Unit of Life"] == {
        "name": "Cell: The Unit of Life",
        "subject": "mixed",
        "count": 2,
    }
    assert "Cell Cycle and Cell Division" not in by_name


def test_unreviewed_questions_are_never_served(bank, make_user, test_database):
    test_database["questions"].update_one(
        {"_id": "bot-001"}, {"$set": {"review.status": "draft"}}
    )
    headers = make_user()

    totals = bank.get(CATALOG_URL, headers=headers).json()["totals"]
    attempt = start(
        bank, headers, mode="chapter", chapter="Photosynthesis in Higher Plants"
    ).json()

    assert totals["questions"] == 32
    assert "bot-001" not in [question["id"] for question in attempt["questions"]]
    assert len(attempt["questions"]) == 2


def test_an_area_test_uses_that_subject_and_never_leaks_answers(bank, make_user):
    response = start(bank, make_user(), mode="area", area="botany")
    body = response.json()

    assert response.status_code == 201
    assert len(body["questions"]) == 10
    assert {question["subject"] for question in body["questions"]} == {"botany"}
    assert body["duration_sec"] == 660
    hidden_fields = {"correct_index", "explanation", "source", "review"}
    assert all(hidden_fields.isdisjoint(question) for question in body["questions"])


def test_chapter_mock_and_custom_tests(bank, make_user):
    headers = make_user()

    chapter = start(bank, headers, mode="chapter", chapter="Photosynthesis in Higher Plants")
    mock = start(bank, headers, mode="mock", count=10)
    custom = start(
        bank, headers, mode="custom", areas=["ecology"], count=5, difficulty="easy"
    )

    assert len(chapter.json()["questions"]) == 3
    assert len(mock.json()["questions"]) == 10
    assert len(custom.json()["questions"]) == 2


def test_impossible_tests_are_refused_with_clear_errors(bank, make_user):
    headers = make_user()

    assert start(bank, headers, mode="mock", count=15).json()["error"]["code"] == "mock_size_invalid"
    assert start(bank, headers, mode="mock", count=45).json()["error"]["code"] == "not_enough_questions"
    assert start(bank, headers, mode="pyq", year=2023).json()["error"]["code"] == "no_questions"
    assert start(bank, headers, mode="area", area="astronomy").json()["error"]["code"] == "unknown_area"
    assert start(bank, headers, mode="custom", areas=["nope"], count=5).status_code == 422
    assert start(bank, headers, mode="area").status_code == 422


def test_submitting_scores_on_the_server(bank, make_user, test_database):
    headers = make_user()
    attempt = start_area(bank, headers)
    answers = answers_for(test_database, attempt, correct=1, wrong=1)

    response = bank.post(
        f"{ATTEMPTS_URL}/{attempt['id']}/submit", json={"answers": answers}, headers=headers
    )
    body = response.json()

    assert response.status_code == 200
    assert (body["correct"], body["wrong"], body["skipped"]) == (1, 1, 8)
    assert body["score"] == 3
    assert body["max_score"] == 40
    assert body["accuracy"] == 10
    first = body["details"][0]
    assert first["is_correct"] is True
    assert first["question"]["explanation"]
    assert first["question"]["source"]["type"] == "ai_drafted"


def test_a_test_can_only_be_submitted_once(bank, make_user):
    headers = make_user()
    attempt = start_area(bank, headers)
    url = f"{ATTEMPTS_URL}/{attempt['id']}/submit"

    first = bank.post(url, json={"answers": {}}, headers=headers)
    second = bank.post(url, json={"answers": {}}, headers=headers)

    assert first.status_code == 200
    assert second.status_code == 409
    assert second.json()["error"]["code"] == "attempt_submitted"


def test_answers_must_belong_to_the_test_and_be_valid_options(bank, make_user):
    headers = make_user()
    attempt = start_area(bank, headers)
    url = f"{ATTEMPTS_URL}/{attempt['id']}/submit"

    stranger = bank.post(url, json={"answers": {"nope-001": 0}}, headers=headers)
    bad_option = bank.post(
        url, json={"answers": {attempt["questions"][0]["id"]: 7}}, headers=headers
    )

    assert stranger.json()["error"]["code"] == "unknown_question"
    assert bad_option.status_code == 422


def test_users_cannot_submit_or_read_each_others_tests(bank, make_user):
    owner = make_user()
    other = make_user()
    attempt = start_area(bank, owner)

    submit = bank.post(
        f"{ATTEMPTS_URL}/{attempt['id']}/submit", json={"answers": {}}, headers=other
    )
    read = bank.get(f"{ATTEMPTS_URL}/{attempt['id']}", headers=other)
    bad_id = bank.get(f"{ATTEMPTS_URL}/not-an-id", headers=owner)

    assert submit.status_code == 404
    assert read.status_code == 404
    assert bad_id.json()["error"]["code"] == "attempt_not_found"


def test_results_can_be_read_back_only_after_submitting(bank, make_user, test_database):
    headers = make_user()
    attempt = start_area(bank, headers)
    url = f"{ATTEMPTS_URL}/{attempt['id']}"

    before = bank.get(url, headers=headers)
    bank.post(
        f"{url}/submit",
        json={"answers": answers_for(test_database, attempt)},
        headers=headers,
    )
    after = bank.get(url, headers=headers)

    assert before.status_code == 409
    assert before.json()["error"]["code"] == "attempt_in_progress"
    assert after.status_code == 200
    assert len(after.json()["details"]) == 10


def test_history_and_stats_reflect_submitted_tests_only(bank, make_user, test_database):
    headers = make_user()
    start_area(bank, headers)
    attempt = start_area(bank, headers)
    bank.post(
        f"{ATTEMPTS_URL}/{attempt['id']}/submit",
        json={"answers": answers_for(test_database, attempt, correct=1, wrong=1)},
        headers=headers,
    )

    history = bank.get(ATTEMPTS_URL, headers=headers).json()["items"]
    stats = bank.get(STATS_URL, headers=headers).json()
    botany = next(item for item in stats["by_subject"] if item["subject"] == "botany")

    assert len(history) == 1
    assert history[0]["area_id"] == "botany"
    assert (history[0]["correct"], history[0]["total"]) == (1, 10)
    assert stats["tests_completed"] == 1
    assert (stats["attempted"], stats["correct"], stats["wrong"]) == (2, 1, 1)
    assert stats["accuracy"] == 50
    assert botany["attempted"] == 2


def test_stats_are_empty_for_a_new_student(bank, make_user):
    stats = bank.get(STATS_URL, headers=make_user()).json()

    assert stats["tests_completed"] == 0
    assert stats["accuracy"] == 0
