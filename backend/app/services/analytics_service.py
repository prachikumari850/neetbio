from app.repositories import attempt_repository, question_repository
from app.schemas.analytics import AnalyticsOverview
from app.services import performance
from app.services.performance import GroupStat, Performance
from app.services.practice_service import PRACTICE_AREAS

ATTEMPT_LIMIT = 1000
CHAPTERS_LIMIT = 80


async def load_performance(user: dict, offset_minutes: int) -> Performance:
    attempts = await attempt_repository.list_all_submitted(user["_id"], ATTEMPT_LIMIT)
    ids = sorted({question_id for a in attempts for question_id in a.get("question_ids", [])})
    documents = await question_repository.list_for_analytics(ids)

    questions = {
        document["_id"]: {
            "subject": document["subject"],
            "unit": document["unit"],
            "chapter": document["chapter"],
            "topic": document["topic"],
            "correct_index": document["correct_index"],
            "reviewed": document.get("review", {}).get("status") == "reviewed",
        }
        for document in documents
    }
    return performance.analyse(attempts, questions, offset_minutes)


def stat_fields(stat: GroupStat) -> dict:
    return {
        "total": stat.total,
        "mastered": stat.mastered,
        "progress": stat.progress,
        "attempted": stat.attempted,
        "correct": stat.correct,
        "accuracy": stat.accuracy,
    }


def ranked(pairs: list) -> list[dict]:
    return [
        {"name": name, "accuracy": stat.accuracy, "attempted": stat.attempted}
        for name, stat in pairs
    ]


def build_chapters(perf: Performance, chapter_stats: dict) -> list[dict]:
    subjects = performance.majority_subject(perf, performance.by_chapter)
    topics_by_chapter: dict[str, list[dict]] = {}

    for (chapter, topic), stat in sorted(
        performance.group_stats(perf, performance.by_topic).items()
    ):
        topics_by_chapter.setdefault(chapter, []).append(
            {"topic": topic, **stat_fields(stat)}
        )

    chapters = [
        {
            "name": name,
            "subject": subjects.get(name, "botany"),
            **stat_fields(stat),
            "topics": topics_by_chapter.get(name, []),
        }
        for name, stat in chapter_stats.items()
        if stat.total > 0
    ]
    chapters.sort(key=lambda chapter: (chapter["attempted"] == 0, chapter["name"]))
    return chapters[:CHAPTERS_LIMIT]


async def get_overview(user: dict, offset_minutes: int) -> dict:
    perf = await load_performance(user, offset_minutes)
    overall = performance.make_stat(set(perf.bank), perf.records)
    totals = performance.attempt_totals(perf.attempts)
    weeks = performance.weekly_trend(perf.attempts, offset_minutes)
    change = performance.accuracy_change(weeks)
    chapter_stats = performance.group_stats(perf, performance.by_chapter)
    strengths, weaknesses = performance.strengths_and_weaknesses(chapter_stats)
    mock_tests = sum(1 for attempt in perf.attempts if attempt.get("mode") == "mock")

    return AnalyticsOverview(
        totals={
            "tests_completed": totals["tests"],
            "questions_attempted": totals["attempted"],
            "correct": totals["correct"],
            "wrong": totals["wrong"],
            "skipped": totals["skipped"],
            "accuracy": performance.percent(totals["correct"], totals["attempted"]),
            "practice_time_sec": totals["time_sec"],
        },
        progress={
            "total_questions": overall.total,
            "mastered": overall.mastered,
            "percent": overall.progress,
        },
        accuracy_change=change,
        areas=[
            {"id": area_id, "label": label, **stat_fields(performance.area_stat(perf, field, area_id))}
            for area_id, label, field in PRACTICE_AREAS
        ],
        weekly_trend=weeks,
        tests=performance.test_points(perf.attempts),
        question_analysis={
            "correct": totals["correct"],
            "incorrect": totals["wrong"],
            "skipped": totals["skipped"],
            "total": totals["correct"] + totals["wrong"] + totals["skipped"],
        },
        chapters=build_chapters(perf, chapter_stats),
        strengths=ranked(strengths),
        weaknesses=ranked(weaknesses),
        insights=performance.build_insights(
            totals["attempted"], change, weaknesses, mock_tests
        ),
        excluded_attempts=perf.excluded,
        min_sample=performance.MIN_SAMPLE,
    ).model_dump()