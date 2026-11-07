from app.services.scoring import evaluate


def make_question(question_id, subject="botany", correct_index=1):
    return {"_id": question_id, "subject": subject, "correct_index": correct_index}


QUESTIONS = [
    make_question("q-1"),
    make_question("q-2", "zoology"),
    make_question("q-3"),
    make_question("q-4", "zoology"),
]


def test_marks_follow_the_neet_pattern():
    result = evaluate(QUESTIONS, {"q-1": 1, "q-2": 0, "q-3": 1})

    assert result["correct"] == 2
    assert result["wrong"] == 1
    assert result["skipped"] == 1
    assert result["score"] == 7
    assert result["max_score"] == 16


def test_accuracy_is_correct_answers_over_all_questions():
    assert evaluate(QUESTIONS, {"q-1": 1})["accuracy"] == 25


def test_subject_totals_count_only_answered_questions():
    result = evaluate(QUESTIONS, {"q-1": 1, "q-2": 0})

    assert result["by_subject"] == {
        "botany": {"attempted": 1, "correct": 1},
        "zoology": {"attempted": 1, "correct": 0},
    }


def test_details_say_what_happened_to_each_question():
    details = evaluate(QUESTIONS, {"q-1": 1, "q-2": 0})["details"]

    assert [
        (item["is_answered"], item["is_correct"], item["selected_index"])
        for item in details[:3]
    ] == [(True, True, 1), (True, False, 0), (False, False, None)]


def test_an_empty_test_scores_zero_without_dividing_by_zero():
    assert evaluate([], {})["accuracy"] == 0