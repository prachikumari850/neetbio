from tests.test_practice import ATTEMPTS_URL, answers_for, bank, start  # noqa: F401

URL = "/api/v1/analytics/overview"
PHOTO = "Photosynthesis in Higher Plants"


def finish(client, headers, test_database, correct, wrong, **request):
    attempt = start(client, headers, **request).json()
    answers = answers_for(test_database, attempt, correct=correct, wrong=wrong)
    client.post(
        f"{ATTEMPTS_URL}/{attempt['id']}/submit", json={"answers": answers}, headers=headers
    )
    return attempt


def finish_chapter(client, headers, test_database, correct, wrong):
    return finish(client, headers, test_database, correct, wrong, mode="chapter", chapter=PHOTO)


def overview(client, headers):
    return client.get(URL, headers=headers).json()


def find_chapter(body, name=PHOTO):
    return next(chapter for chapter in body["chapters"] if chapter["name"] == name)


def test_analytics_require_login(bank):
    assert bank.get(URL).status_code == 401


def test_a_new_student_gets_empty_but_valid_analytics(bank, make_user):
    body = overview(bank, make_user())

    assert body["totals"]["tests_completed"] == 0
    assert body["totals"]["accuracy"] is None
    assert body["progress"] == {"total_questions": 33, "mastered": 0, "percent": 0}
    assert body["weekly_trend"] == [] and body["tests"] == []
    assert body["strengths"] == [] and body["weaknesses"] == []
    assert len(body["areas"]) == 6
    assert all(area["accuracy"] is None for area in body["areas"])
    assert "first practice test" in body["insights"][0]


def test_totals_chapters_and_areas_come_from_real_answers(bank, make_user, test_database):
    headers = make_user()
    finish_chapter(bank, headers, test_database, correct=2, wrong=1)

    body = overview(bank, headers)
    chapter = find_chapter(body)
    botany = next(area for area in body["areas"] if area["id"] == "botany")

    assert (body["totals"]["questions_attempted"], body["totals"]["correct"]) == (3, 2)
    assert body["totals"]["accuracy"] == 67
    assert (chapter["attempted"], chapter["correct"], chapter["accuracy"]) == (3, 2, 67)
    assert chapter["mastered"] == 2 and chapter["progress"] == 67
    assert sum(topic["attempted"] for topic in chapter["topics"]) == 3
    assert botany["attempted"] == 3
    assert body["progress"]["mastered"] == 2 and body["progress"]["percent"] == 6


def test_repeated_attempts_accumulate_without_double_counting_mastery(
    bank, make_user, test_database
):
    headers = make_user()
    finish_chapter(bank, headers, test_database, correct=3, wrong=0)
    finish_chapter(bank, headers, test_database, correct=3, wrong=0)

    body = overview(bank, headers)

    assert body["totals"]["tests_completed"] == 2
    assert body["totals"]["questions_attempted"] == 6
    assert body["progress"]["mastered"] == 3
    assert len(body["weekly_trend"]) == 1 and body["weekly_trend"][0]["accuracy"] == 100
    assert [test["score"] for test in body["tests"]] == [12, 12]


def test_weak_chapters_drive_the_insights(bank, make_user, test_database):
    headers = make_user()
    finish_chapter(bank, headers, test_database, correct=0, wrong=3)

    body = overview(bank, headers)

    assert [(item["name"], item["accuracy"]) for item in body["weaknesses"]] == [(PHOTO, 0)]
    assert body["strengths"] == []
    assert any(PHOTO in insight for insight in body["insights"])
    assert body["question_analysis"] == {"correct": 0, "incorrect": 3, "skipped": 0, "total": 3}


def test_strong_chapters_are_listed_as_strengths(bank, make_user, test_database):
    headers = make_user()
    finish_chapter(bank, headers, test_database, correct=3, wrong=0)

    assert [item["name"] for item in overview(bank, headers)["strengths"]] == [PHOTO]


def test_attempts_with_a_changed_answer_key_are_left_out_of_chapter_analytics(
    bank, make_user, test_database
):
    headers = make_user()
    finish_chapter(bank, headers, test_database, correct=3, wrong=0)
    stored = test_database["questions"].find_one({"_id": "bot-001"})
    test_database["questions"].update_one(
        {"_id": "bot-001"}, {"$set": {"correct_index": (stored["correct_index"] + 1) % 4}}
    )

    body = overview(bank, headers)

    assert body["excluded_attempts"] == 1
    assert find_chapter(body)["attempted"] == 0
    assert body["totals"]["questions_attempted"] == 3


def test_analytics_are_isolated_per_student(bank, make_user, test_database):
    owner = make_user()
    other = make_user()
    finish_chapter(bank, owner, test_database, correct=2, wrong=1)

    body = overview(bank, other)

    assert body["totals"]["tests_completed"] == 0
    assert body["progress"]["mastered"] == 0


def test_the_offset_parameter_is_validated(bank, make_user):
    response = bank.get(URL, params={"utc_offset_minutes": 5000}, headers=make_user())

    assert response.status_code == 422