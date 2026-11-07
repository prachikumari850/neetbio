from tests.test_analytics import PHOTO, finish_chapter, overview  # noqa: F401
from tests.test_practice import bank  # noqa: F401

SUMMARY_URL = "/api/v1/learning/summary"
GOALS_URL = "/api/v1/learning/goals"
VIEWS_URL = "/api/v1/learning/diagram-views"


def summary(client, headers, **params):
    return client.get(SUMMARY_URL, params=params, headers=headers).json()


def goal_progress(body):
    return {item["id"]: item["progress"] for item in body["goals"]["items"]}


def view(client, headers, diagram_id="plant-cell"):
    return client.post(VIEWS_URL, json={"diagram_id": diagram_id}, headers=headers)


def test_learning_endpoints_require_login(bank):
    assert bank.get(SUMMARY_URL).status_code == 401
    assert bank.put(GOALS_URL, json={}).status_code == 401
    assert bank.post(VIEWS_URL, json={"diagram_id": "x"}).status_code == 401


def test_a_new_student_gets_defaults_and_no_invented_data(bank, make_user):
    body = summary(bank, make_user())

    assert body["streak"] == {"current": 0, "today_active": False}
    assert body["goals"]["targets"] == {"diagrams": 5, "questions": 20, "chapters": 1, "ai": 1}
    assert goal_progress(body) == {"diagrams": 0, "questions": 0, "chapters": 0, "ai": 0}
    assert body["stats"]["tests_completed"] == 0
    assert body["stats"]["accuracy"] is None
    assert body["stats"]["questions_total"] == 33
    assert body["continue_item"] is None
    assert body["activity"] == []
    assert body["recommendations"]["practice"] is None


def test_goal_targets_are_saved_validated_and_private(bank, make_user):
    owner = make_user()
    other = make_user()
    targets = {"diagrams": 3, "questions": 10, "chapters": 2, "ai": 4}

    saved = bank.put(GOALS_URL, json=targets, headers=owner)

    assert saved.status_code == 200
    assert summary(bank, owner)["goals"]["targets"] == targets
    assert summary(bank, other)["goals"]["targets"]["diagrams"] == 5
    assert bank.put(GOALS_URL, json={**targets, "questions": 0}, headers=owner).status_code == 422
    assert bank.put(GOALS_URL, json={**targets, "questions": 500}, headers=owner).status_code == 422


def test_viewing_a_diagram_updates_goals_streak_stats_and_activity(
    bank, seeded_client, make_user, test_database
):
    headers = make_user()

    assert view(seeded_client, headers).status_code == 204
    body = summary(seeded_client, headers)

    assert body["stats"]["diagrams_studied"] == 1
    assert goal_progress(body)["diagrams"] == 1
    assert body["streak"] == {"current": 1, "today_active": True}
    assert "Studied: Plant Cell" in [item["label"] for item in body["activity"]]


def test_repeat_views_within_ten_minutes_are_recorded_once(
    bank, seeded_client, make_user, test_database
):
    headers = make_user()

    view(seeded_client, headers)
    view(seeded_client, headers)

    assert test_database["diagram_views"].count_documents({}) == 1


def test_viewing_an_unknown_diagram_fails(bank, seeded_client, make_user):
    response = view(seeded_client, make_user(), "nothing-here")

    assert response.status_code == 404


def test_todays_questions_and_chapters_count_toward_goals(bank, make_user, test_database):
    headers = make_user()
    finish_chapter(bank, headers, test_database, correct=3, wrong=0)

    body = summary(bank, headers)

    assert goal_progress(body)["questions"] == 3
    assert goal_progress(body)["chapters"] == 1
    assert body["streak"]["current"] == 1


def test_goal_completion_follows_the_saved_targets(bank, make_user, test_database):
    headers = make_user()
    bank.put(GOALS_URL, json={"diagrams": 1, "questions": 3, "chapters": 1, "ai": 1}, headers=headers)
    finish_chapter(bank, headers, test_database, correct=3, wrong=0)

    goals = summary(bank, headers)["goals"]

    assert goals["completed"] == 2
    assert [item["done"] for item in goals["items"]] == [False, True, True, False]


def test_chapters_move_from_in_progress_to_completed(bank, make_user, test_database):
    headers = make_user()
    finish_chapter(bank, headers, test_database, correct=1, wrong=0)

    started = summary(bank, headers)

    assert started["continue_item"]["name"] == PHOTO
    assert started["continue_item"]["progress"] == 33
    assert [item["name"] for item in started["in_progress"]] == [PHOTO]
    assert started["completed"] == []

    finish_chapter(bank, headers, test_database, correct=3, wrong=0)
    done = summary(bank, headers)

    assert [item["name"] for item in done["completed"]] == [PHOTO]
    assert done["in_progress"] == [] and done["continue_item"] is None
    assert done["stats"]["chapters_completed"] == 1


def test_units_report_real_mastery(bank, make_user, test_database):
    headers = make_user()
    finish_chapter(bank, headers, test_database, correct=3, wrong=0)

    units = {unit["id"]: unit for unit in summary(bank, headers)["units"]}

    assert units["plant-physiology"]["mastered"] == 3
    assert units["plant-physiology"]["progress"] == round(3 / units["plant-physiology"]["total"] * 100)
    assert units["human-physiology"]["mastered"] == 0


def test_new_students_are_recommended_unstudied_neet_diagrams_first(
    bank, seeded_client, make_user
):
    recommendations = summary(seeded_client, make_user())["recommendations"]

    assert len(recommendations["diagrams"]) == 8
    assert recommendations["diagrams"][0]["diagram_id"] == "plant-cell"
    assert "not studied" in recommendations["diagrams"][0]["reason"]
    assert recommendations["practice"] is None


def test_studied_diagrams_drop_down_the_recommendations(
    bank, seeded_client, make_user
):
    headers = make_user()
    view(seeded_client, headers, "plant-cell")

    ids = [item["diagram_id"] for item in summary(seeded_client, headers)["recommendations"]["diagrams"]]

    assert "plant-cell" not in ids


def test_a_weak_chapter_is_recommended_in_diagrams_and_practice(
    bank, seeded_client, make_user, test_database
):
    headers = make_user()
    finish_chapter(seeded_client, headers, test_database, correct=0, wrong=3)

    recommendations = summary(seeded_client, headers)["recommendations"]

    assert recommendations["diagrams"][0]["diagram_id"] == "light-reactions"
    assert PHOTO in recommendations["diagrams"][0]["reason"]
    assert recommendations["practice"]["chapter"] == PHOTO
    assert recommendations["practice"]["accuracy"] == 0


def test_the_summary_is_private_to_each_student(bank, make_user, test_database):
    owner = make_user()
    other = make_user()
    finish_chapter(bank, owner, test_database, correct=2, wrong=1)

    body = summary(bank, other)

    assert body["stats"]["tests_completed"] == 0
    assert body["streak"]["current"] == 0
    assert goal_progress(body)["questions"] == 0


def test_the_offset_parameter_is_validated(bank, make_user):
    assert bank.get(SUMMARY_URL, params={"utc_offset_minutes": -5000}, headers=make_user()).status_code == 422