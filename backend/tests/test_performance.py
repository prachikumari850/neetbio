from datetime import date, datetime, timedelta, timezone

from app.services import performance

NOW = datetime(2026, 11, 9, 12, 0, tzinfo=timezone.utc)


def question(chapter="Chapter A", topic="Topic", correct_index=0, reviewed=True):
    return {
        "subject": "botany",
        "unit": "plant-physiology",
        "chapter": chapter,
        "topic": topic,
        "correct_index": correct_index,
        "reviewed": reviewed,
    }


def make_attempt(number, questions, answers, question_ids=None, days_ago=0, mode="area"):
    ids = question_ids or list(questions)
    correct = sum(1 for qid, choice in answers.items() if questions[qid]["correct_index"] == choice)
    return {
        "_id": f"a{number}",
        "title": f"Test {number}",
        "mode": mode,
        "question_ids": ids,
        "answers": answers,
        "total": len(ids),
        "attempted": len(answers),
        "correct": correct,
        "wrong": len(answers) - correct,
        "skipped": len(ids) - len(answers),
        "score": correct * 4 - (len(answers) - correct),
        "max_score": len(ids) * 4,
        "accuracy": round(correct / len(ids) * 100),
        "time_taken_sec": 60,
        "submitted_at": NOW - timedelta(days=days_ago),
    }


def test_percent_is_none_without_data():
    assert performance.percent(0, 0) is None
    assert performance.percent(1, 4) == 25


def test_records_are_rebuilt_when_they_match_the_stored_counts():
    questions = {"q1": question(correct_index=1), "q2": question(correct_index=0)}
    attempt = make_attempt(1, questions, {"q1": 1, "q2": 1})

    records = performance.derive_records(attempt, questions)

    assert [record["correct"] for record in records] == [True, False]


def test_records_are_dropped_when_the_answer_key_changed():
    questions = {"q1": question(correct_index=1)}
    attempt = make_attempt(1, questions, {"q1": 1})

    changed = {"q1": question(correct_index=2)}

    assert performance.derive_records(attempt, changed) is None


def test_records_are_dropped_when_a_question_is_missing():
    questions = {"q1": question(), "q2": question()}
    attempt = make_attempt(1, questions, {"q1": 0})

    assert performance.derive_records(attempt, {"q1": question()}) is None


def test_analyse_keeps_drifted_attempts_in_totals_but_not_in_records():
    questions = {"q1": question(correct_index=1)}
    attempt = make_attempt(1, questions, {"q1": 1})

    perf = performance.analyse([attempt], {"q1": question(correct_index=2)}, 0)

    assert len(perf.attempts) == 1
    assert perf.records == []
    assert perf.excluded == 1


def test_attempts_without_answers_or_questions_are_ignored():
    questions = {"q1": question()}
    good = make_attempt(1, questions, {"q1": 0})
    empty = {**good, "_id": "a2", "total": 0}
    no_answers = {key: value for key, value in good.items() if key != "answers"}

    perf = performance.analyse([good, empty, no_answers], questions, 0)

    assert [attempt["_id"] for attempt in perf.attempts] == ["a1"]


def test_progress_counts_only_reviewed_questions():
    questions = {"q1": question(), "q2": question(reviewed=False)}
    attempt = make_attempt(1, questions, {"q1": 0, "q2": 0})
    perf = performance.analyse([attempt], questions, 0)

    stat = performance.group_stats(perf, performance.by_chapter)["Chapter A"]

    assert (stat.total, stat.mastered, stat.attempted, stat.progress) == (1, 1, 2, 100)


def test_repeated_answers_count_as_attempts_but_one_mastered_question():
    questions = {"q1": question()}
    attempts = [make_attempt(1, questions, {"q1": 0}), make_attempt(2, questions, {"q1": 0}, days_ago=1)]
    perf = performance.analyse(attempts, questions, 0)

    stat = performance.make_stat(set(perf.bank), perf.records)

    assert (stat.attempted, stat.answered, stat.mastered, stat.accuracy) == (2, 1, 1, 100)


def test_weekly_trend_buckets_by_monday_and_reports_the_change():
    questions = {"q1": question(), "q2": question()}
    last_week = make_attempt(1, questions, {"q1": 0, "q2": 0}, days_ago=7)
    this_week = make_attempt(2, questions, {"q1": 0, "q2": 1})

    weeks = performance.weekly_trend([last_week, this_week], 0)

    assert weeks == [
        {"week_start": date(2026, 11, 2), "accuracy": 100},
        {"week_start": date(2026, 11, 9), "accuracy": 50},
    ]
    assert performance.accuracy_change(weeks) == -50
    assert performance.accuracy_change(weeks[:1]) is None


def test_the_utc_offset_moves_a_late_evening_into_the_next_day():
    late = datetime(2026, 11, 8, 23, 30, tzinfo=timezone.utc)

    assert performance.local_date(late, 0) == date(2026, 11, 8)
    assert performance.local_date(late, 330) == date(2026, 11, 9)


def test_the_day_window_starts_at_local_midnight():
    today, start, end = performance.day_window(NOW, 330)

    assert today == date(2026, 11, 9)
    assert start == datetime(2026, 11, 8, 18, 30, tzinfo=timezone.utc)
    assert end - start == timedelta(days=1)


def test_streak_counts_consecutive_days_and_survives_until_the_day_ends():
    today = date(2026, 11, 9)
    run = {today, today - timedelta(days=1), today - timedelta(days=2)}

    assert performance.current_streak(run, today) == 3
    assert performance.current_streak(run - {today}, today) == 2
    assert performance.current_streak({today, today - timedelta(days=2)}, today) == 1
    assert performance.current_streak({today - timedelta(days=3)}, today) == 0
    assert performance.current_streak(set(), today) == 0


def test_strengths_and_weaknesses_need_enough_answers():
    questions = {f"a{i}": question("Chapter A") for i in range(3)}
    questions |= {f"b{i}": question("Chapter B") for i in range(3)}
    questions |= {f"c{i}": question("Chapter C") for i in range(2)}
    answers = {
        **{f"a{i}": 0 for i in range(3)},
        **{f"b{i}": 1 for i in range(3)},
        **{f"c{i}": 0 for i in range(2)},
    }
    perf = performance.analyse([make_attempt(1, questions, answers)], questions, 0)
    stats = performance.group_stats(perf, performance.by_chapter)

    strengths, weaknesses = performance.strengths_and_weaknesses(stats)

    assert [name for name, _ in strengths] == ["Chapter A"]
    assert [name for name, _ in weaknesses] == ["Chapter B"]


def test_insights_are_built_from_the_numbers():
    assert "first practice test" in performance.build_insights(0, None, [], 0)[0]

    stat = performance.make_stat({"q"}, [])
    insights = performance.build_insights(10, 8, [("Chapter B", stat)], 0)

    assert "rose by 8 points" in insights[0]
    assert "Chapter B" in insights[1]
    assert "full mock test" in insights[2]
    assert "dropped by 5" in performance.build_insights(10, -5, [], 1)[0]