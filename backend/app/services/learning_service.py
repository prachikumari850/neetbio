import asyncio
from collections import Counter
from datetime import datetime, timedelta, timezone

from app.core.errors import AppError
from app.repositories import (
    conversation_repository,
    diagram_repository,
    diagram_view_repository,
    generated_diagram_repository,
    goal_repository,
    note_repository,
)
from app.schemas.learning import GoalTargets
from app.services import analytics_service, performance
from app.services.performance import Performance

DEFAULT_TARGETS = {"diagrams": 5, "questions": 20, "chapters": 1, "ai": 1}
CHAPTER_REVISION_MIN = 2
STREAK_LOOKBACK_DAYS = 120
VIEW_DEDUPE_WINDOW = timedelta(minutes=10)
DIAGRAM_LIMIT = 200
RECOMMENDATION_LIMIT = 8
ACTIVITY_LIMIT = 6
ACTIVITY_PER_SOURCE = 5
NOTE_ACTIVITY_LIMIT = 3

UNIT_LABELS = {
    "cell-biology": "Cell Biology",
    "genetics-evolution": "Genetics & Evolution",
    "human-physiology": "Human Physiology",
    "ecology": "Ecology & Environment",
    "plant-physiology": "Plant Physiology",
    "reproduction": "Reproduction",
    "diversity-of-life": "Diversity of Life",
    "biotechnology": "Biotechnology",
    "structural-organisation": "Structural Organisation",
    "health-and-disease": "Health & Disease",
}


def _plural(count: int, word: str) -> str:
    return word if count == 1 else f"{word}s"


def _in_day(moment: datetime, start: datetime, end: datetime) -> bool:
    return start <= moment < end


def targets_from(document: dict | None) -> dict:
    stored = document or {}
    return {key: stored.get(key, default) for key, default in DEFAULT_TARGETS.items()}


def todays_progress(
    perf: Performance,
    view_events: list[dict],
    chat_times: list[datetime],
    generated_times: list[datetime],
    window: tuple[datetime, datetime],
) -> dict:
    start, end = window
    chapter_counts = Counter(
        record["chapter"] for record in perf.records if _in_day(record["at"], start, end)
    )

    return {
        "diagrams": len(
            {e["diagram_id"] for e in view_events if _in_day(e["viewed_at"], start, end)}
        ),
        "questions": sum(
            attempt.get("attempted", 0)
            for attempt in perf.attempts
            if _in_day(attempt["submitted_at"], start, end)
        ),
        "chapters": sum(1 for count in chapter_counts.values() if count >= CHAPTER_REVISION_MIN),
        "ai": sum(1 for moment in [*chat_times, *generated_times] if _in_day(moment, start, end)),
    }


def goal_items(targets: dict, progress: dict) -> list[dict]:
    labels = {
        "diagrams": f"Study {targets['diagrams']} {_plural(targets['diagrams'], 'Diagram')}",
        "questions": f"Practice {targets['questions']} {_plural(targets['questions'], 'Question')}",
        "chapters": f"Revise {targets['chapters']} {_plural(targets['chapters'], 'Chapter')}",
        "ai": "Use AI Learn (chat or diagram)",
    }
    return [
        {
            "id": key,
            "label": labels[key],
            "target": targets[key],
            "progress": progress[key],
            "done": progress[key] >= targets[key],
        }
        for key in DEFAULT_TARGETS
    ]


def active_days(
    perf: Performance,
    view_events: list[dict],
    chat_times: list[datetime],
    generated_times: list[datetime],
    offset_minutes: int,
) -> set:
    moments = [
        *(attempt["submitted_at"] for attempt in perf.attempts),
        *(event["viewed_at"] for event in view_events),
        *chat_times,
        *generated_times,
    ]
    return {performance.local_date(moment, offset_minutes) for moment in moments}


def chapter_item(name: str, stat, subject: str, diagram_id: str | None) -> dict:
    return {
        "name": name,
        "subject": subject,
        "total": stat.total,
        "answered": stat.answered,
        "mastered": stat.mastered,
        "progress": stat.progress,
        "accuracy": stat.accuracy,
        "last_practiced": stat.last_at,
        "diagram_id": diagram_id,
    }


def recommend_diagrams(
    diagram_docs: list[dict], view_summary: list[dict], weaknesses: list
) -> list[dict]:
    viewed = {item["_id"]: item["last_viewed"] for item in view_summary}
    reasons: dict[str, str] = {}

    for name, _ in weaknesses:
        for diagram in diagram_docs:
            if diagram["chapter"] == name:
                reasons.setdefault(diagram["_id"], f"Strengthen a weak chapter: {name}")

    for diagram in diagram_docs:
        if diagram["_id"] not in viewed and diagram["neet"]:
            reasons.setdefault(diagram["_id"], "NEET-focused and not studied yet")

    for diagram in diagram_docs:
        if diagram["_id"] not in viewed:
            reasons.setdefault(diagram["_id"], "Not studied yet")

    by_id = {diagram["_id"]: diagram for diagram in diagram_docs}
    for diagram_id, _ in sorted(viewed.items(), key=lambda pair: pair[1]):
        if diagram_id in by_id:
            reasons.setdefault(diagram_id, "Time to revise")

    return [
        {
            "diagram_id": diagram_id,
            "title": by_id[diagram_id]["title"],
            "topic": by_id[diagram_id]["topic"],
            "chapter": by_id[diagram_id]["chapter"],
            "class_level": by_id[diagram_id]["class_level"],
            "image": by_id[diagram_id]["image"],
            "reason": reason,
        }
        for diagram_id, reason in list(reasons.items())[:RECOMMENDATION_LIMIT]
        if diagram_id in by_id
    ]


def recommend_practice(weaknesses: list, in_progress: list[dict]) -> dict | None:
    if weaknesses:
        name, stat = weaknesses[0]
        return {
            "chapter": name,
            "accuracy": stat.accuracy,
            "reason": f"Your accuracy in this chapter is {stat.accuracy}%.",
        }

    if in_progress:
        item = in_progress[0]
        return {
            "chapter": item["name"],
            "accuracy": item["accuracy"],
            "reason": f"{item['mastered']} of {item['total']} questions mastered. Finish what you started.",
        }

    return None


def build_activity(
    perf: Performance,
    view_events: list[dict],
    diagram_titles: dict[str, str],
    notes: list[dict],
    conversations: list[dict],
) -> list[dict]:
    items = [
        {
            "id": f"test-{attempt['_id']}",
            "kind": "test",
            "label": f"Completed: {attempt['title']}",
            "at": attempt["submitted_at"],
        }
        for attempt in perf.attempts[-ACTIVITY_PER_SOURCE:]
    ]

    seen_diagrams: set[str] = set()
    for event in view_events:
        title = diagram_titles.get(event["diagram_id"])

        if title is None or event["diagram_id"] in seen_diagrams:
            continue

        seen_diagrams.add(event["diagram_id"])
        items.append(
            {
                "id": f"diagram-{event['diagram_id']}",
                "kind": "diagram",
                "label": f"Studied: {title}",
                "at": event["viewed_at"],
            }
        )

        if len(seen_diagrams) == ACTIVITY_PER_SOURCE:
            break

    items.extend(
        {"id": f"note-{note['_id']}", "kind": "note", "label": f"Saved note: {note['title']}", "at": note["updated_at"]}
        for note in notes
    )
    items.extend(
        {"id": f"chat-{chat['_id']}", "kind": "chat", "label": f"Asked AI: {chat['title']}", "at": chat["updated_at"]}
        for chat in conversations
    )

    return sorted(items, key=lambda item: item["at"], reverse=True)[:ACTIVITY_LIMIT]


async def get_summary(user: dict, offset_minutes: int) -> dict:
    now = datetime.now(timezone.utc)
    today, day_start, day_end = performance.day_window(now, offset_minutes)
    since = day_start - timedelta(days=STREAK_LOOKBACK_DAYS)
    user_id = user["_id"]

    (
        perf,
        goal_document,
        view_summary,
        view_events,
        chat_times,
        generated_times,
        notes,
        conversations,
        diagram_docs,
    ) = await asyncio.gather(
        analytics_service.load_performance(user, offset_minutes),
        goal_repository.find(user_id),
        diagram_view_repository.summary(user_id),
        diagram_view_repository.events_since(user_id, since),
        conversation_repository.user_message_times(user_id, since),
        generated_diagram_repository.created_times(user_id, since),
        note_repository.list_for_user(user_id, NOTE_ACTIVITY_LIMIT),
        conversation_repository.list_for_user(user_id, ACTIVITY_PER_SOURCE),
        diagram_repository.search({}, [("order", 1)], 0, DIAGRAM_LIMIT),
    )

    targets = targets_from(goal_document)
    progress = todays_progress(
        perf, view_events, chat_times, generated_times, (day_start, day_end)
    )
    items = goal_items(targets, progress)
    days = active_days(perf, view_events, chat_times, generated_times, offset_minutes)

    overall = performance.make_stat(set(perf.bank), perf.records)
    totals = performance.attempt_totals(perf.attempts)
    chapter_stats = {
        name: stat
        for name, stat in performance.group_stats(perf, performance.by_chapter).items()
        if stat.total > 0
    }
    subjects = performance.majority_subject(perf, performance.by_chapter)
    diagram_by_chapter: dict[str, str] = {}
    for diagram in diagram_docs:
        diagram_by_chapter.setdefault(diagram["chapter"], diagram["_id"])

    chapter_items = {
        name: chapter_item(name, stat, subjects.get(name, "botany"), diagram_by_chapter.get(name))
        for name, stat in chapter_stats.items()
    }
    started = [item for item in chapter_items.values() if item["answered"] > 0]
    by_recent = lambda item: item["last_practiced"]  # noqa: E731
    completed = sorted(
        (item for item in started if item["mastered"] == item["total"]),
        key=by_recent,
        reverse=True,
    )
    in_progress = sorted(
        (item for item in started if item["mastered"] < item["total"]),
        key=by_recent,
        reverse=True,
    )

    unit_stats = performance.group_stats(perf, performance.by_unit)
    units = sorted(
        (
            {
                "id": unit_id,
                "label": UNIT_LABELS.get(unit_id, unit_id.replace("-", " ").title()),
                "total": stat.total,
                "mastered": stat.mastered,
                "progress": stat.progress,
            }
            for unit_id, stat in unit_stats.items()
            if stat.total > 0
        ),
        key=lambda unit: unit["label"],
    )

    _, weaknesses = performance.strengths_and_weaknesses(chapter_stats)

    return {
        "streak": {
            "current": performance.current_streak(days, today),
            "today_active": today in days,
        },
        "goals": {
            "targets": targets,
            "items": items,
            "completed": sum(1 for item in items if item["done"]),
            "total": len(items),
        },
        "stats": {
            "tests_completed": totals["tests"],
            "questions_attempted": totals["attempted"],
            "correct": totals["correct"],
            "wrong": totals["wrong"],
            "accuracy": performance.percent(totals["correct"], totals["attempted"]),
            "practice_time_sec": totals["time_sec"],
            "diagrams_studied": len(view_summary),
            "chapters_studied": len(started),
            "chapters_completed": len(completed),
            "chapters_total": len(chapter_items),
            "questions_total": overall.total,
            "questions_mastered": overall.mastered,
            "progress": overall.progress,
        },
        "units": units,
        "continue_item": in_progress[0] if in_progress else None,
        "in_progress": in_progress,
        "completed": completed,
        "activity": build_activity(
            perf,
            view_events,
            {diagram["_id"]: diagram["title"] for diagram in diagram_docs},
            notes,
            conversations,
        ),
        "recommendations": {
            "diagrams": recommend_diagrams(diagram_docs, view_summary, weaknesses),
            "practice": recommend_practice(weaknesses, in_progress),
        },
    }


async def update_goals(user: dict, targets: GoalTargets) -> GoalTargets:
    await goal_repository.upsert(user["_id"], targets.model_dump())
    return targets


async def record_diagram_view(user: dict, diagram_id: str) -> None:
    if await diagram_repository.find_by_id(diagram_id) is None:
        raise AppError("Diagram not found.", 404, "diagram_not_found")

    now = datetime.now(timezone.utc)
    latest = await diagram_view_repository.latest_view(user["_id"], diagram_id)

    if latest and now - latest["viewed_at"] < VIEW_DEDUPE_WINDOW:
        return

    await diagram_view_repository.insert(
        {"user_id": user["_id"], "diagram_id": diagram_id, "viewed_at": now}
    )