from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone

MIN_SAMPLE = 3
STRENGTH_MIN_ACCURACY = 75
WEAKNESS_MAX_ACCURACY = 60
WEEKS_SHOWN = 8
TESTS_SHOWN = 10
LIST_LIMIT = 5


def percent(part: int, whole: int) -> int | None:
    return round(part / whole * 100) if whole else None


def local_date(moment: datetime, offset_minutes: int) -> date:
    return (moment + timedelta(minutes=offset_minutes)).date()


def day_window(now: datetime, offset_minutes: int) -> tuple[date, datetime, datetime]:
    today = local_date(now, offset_minutes)
    start = datetime.combine(
        today, datetime.min.time(), tzinfo=timezone.utc
    ) - timedelta(minutes=offset_minutes)
    return today, start, start + timedelta(days=1)


def current_streak(active_days: set[date], today: date) -> int:
    day = today if today in active_days else today - timedelta(days=1)
    streak = 0

    while day in active_days:
        streak += 1
        day -= timedelta(days=1)

    return streak


def by_chapter(item: dict) -> str:
    return item["chapter"]


def by_topic(item: dict) -> tuple[str, str]:
    return item["chapter"], item["topic"]


def by_unit(item: dict) -> str:
    return item["unit"]


@dataclass(frozen=True)
class GroupStat:
    total: int
    attempted: int
    correct: int
    answered: int
    mastered: int
    last_at: datetime | None

    @property
    def accuracy(self) -> int | None:
        return percent(self.correct, self.attempted)

    @property
    def progress(self) -> int:
        return percent(self.mastered, self.total) or 0


@dataclass
class Performance:
    attempts: list[dict]
    records: list[dict]
    excluded: int
    bank: dict[str, dict]


def is_valid_attempt(attempt: dict) -> bool:
    return (
        attempt.get("total", 0) > 0
        and attempt.get("submitted_at") is not None
        and isinstance(attempt.get("answers"), dict)
        and isinstance(attempt.get("question_ids"), list)
    )


def derive_records(attempt: dict, questions: dict[str, dict]) -> list[dict] | None:
    """Rebuild per-question results, or None if they no longer match what was stored."""
    records = []
    correct = 0

    for question_id in attempt["question_ids"]:
        question = questions.get(question_id)

        if question is None:
            return None

        selected = attempt["answers"].get(question_id)

        if selected is None:
            continue

        is_correct = selected == question["correct_index"]
        correct += int(is_correct)
        records.append(
            {
                "question_id": question_id,
                "subject": question["subject"],
                "unit": question["unit"],
                "chapter": question["chapter"],
                "topic": question["topic"],
                "correct": is_correct,
                "at": attempt["submitted_at"],
            }
        )

    if len(records) != attempt.get("attempted") or correct != attempt.get("correct"):
        return None

    return records


def analyse(
    attempts: list[dict], questions: dict[str, dict], offset_minutes: int
) -> Performance:
    valid = sorted(
        (attempt for attempt in attempts if is_valid_attempt(attempt)),
        key=lambda attempt: attempt["submitted_at"],
    )
    records: list[dict] = []
    excluded = 0

    for attempt in valid:
        derived = derive_records(attempt, questions)

        if derived is None:
            excluded += 1
        else:
            records.extend(derived)

    bank = {
        question_id: question
        for question_id, question in questions.items()
        if question["reviewed"]
    }
    return Performance(attempts=valid, records=records, excluded=excluded, bank=bank)


def make_stat(bank_ids: set[str], records: list[dict]) -> GroupStat:
    answered: set[str] = set()
    mastered: set[str] = set()
    correct = 0
    last_at = None

    for record in records:
        answered.add(record["question_id"])

        if record["correct"]:
            correct += 1
            mastered.add(record["question_id"])

        if last_at is None or record["at"] > last_at:
            last_at = record["at"]

    return GroupStat(
        total=len(bank_ids),
        attempted=len(records),
        correct=correct,
        answered=len(answered & bank_ids),
        mastered=len(mastered & bank_ids),
        last_at=last_at,
    )


def group_stats(perf: Performance, key_of) -> dict:
    ids_by_key: dict = defaultdict(set)
    records_by_key: dict = defaultdict(list)

    for question_id, question in perf.bank.items():
        ids_by_key[key_of(question)].add(question_id)

    for record in perf.records:
        records_by_key[key_of(record)].append(record)

    keys = ids_by_key.keys() | records_by_key.keys()
    return {
        key: make_stat(ids_by_key.get(key, set()), records_by_key.get(key, []))
        for key in keys
    }


def area_stat(perf: Performance, field: str, area_id: str) -> GroupStat:
    ids = {question_id for question_id, q in perf.bank.items() if q[field] == area_id}
    records = [record for record in perf.records if record[field] == area_id]
    return make_stat(ids, records)


def majority_subject(perf: Performance, key_of) -> dict:
    counts: dict = defaultdict(Counter)

    for question in perf.bank.values():
        counts[key_of(question)][question["subject"]] += 1

    for record in perf.records:
        if key_of(record) not in counts:
            counts[key_of(record)][record["subject"]] += 1

    return {key: counter.most_common(1)[0][0] for key, counter in counts.items()}


def attempt_totals(attempts: list[dict]) -> dict:
    def total(field: str) -> int:
        return sum(attempt.get(field, 0) for attempt in attempts)

    return {
        "tests": len(attempts),
        "attempted": total("attempted"),
        "correct": total("correct"),
        "wrong": total("wrong"),
        "skipped": total("skipped"),
        "time_sec": total("time_taken_sec"),
    }


def weekly_trend(attempts: list[dict], offset_minutes: int) -> list[dict]:
    buckets: dict[date, list[int]] = {}

    for attempt in attempts:
        day = local_date(attempt["submitted_at"], offset_minutes)
        week_start = day - timedelta(days=day.weekday())
        bucket = buckets.setdefault(week_start, [0, 0])
        bucket[0] += attempt.get("correct", 0)
        bucket[1] += attempt.get("attempted", 0)

    weeks = [
        {"week_start": start, "accuracy": percent(correct, attempted)}
        for start, (correct, attempted) in sorted(buckets.items())
        if attempted > 0
    ]
    return weeks[-WEEKS_SHOWN:]


def accuracy_change(weeks: list[dict]) -> int | None:
    if len(weeks) < 2:
        return None

    return weeks[-1]["accuracy"] - weeks[-2]["accuracy"]


def test_points(attempts: list[dict]) -> list[dict]:
    return [
        {
            "id": str(attempt["_id"]),
            "title": attempt["title"],
            "submitted_at": attempt["submitted_at"],
            "score": attempt.get("score", 0),
            "max_score": attempt.get("max_score", 0),
            "accuracy": attempt.get(
                "accuracy", percent(attempt.get("correct", 0), attempt["total"]) or 0
            ),
        }
        for attempt in attempts[-TESTS_SHOWN:]
    ]


def strengths_and_weaknesses(chapter_stats: dict) -> tuple[list, list]:
    sampled = [
        (name, stat)
        for name, stat in chapter_stats.items()
        if stat.attempted >= MIN_SAMPLE
    ]
    strengths = sorted(
        (pair for pair in sampled if pair[1].accuracy >= STRENGTH_MIN_ACCURACY),
        key=lambda pair: (-pair[1].accuracy, pair[0]),
    )[:LIST_LIMIT]
    weaknesses = sorted(
        (pair for pair in sampled if pair[1].accuracy < WEAKNESS_MAX_ACCURACY),
        key=lambda pair: (pair[1].accuracy, pair[0]),
    )[:LIST_LIMIT]
    return strengths, weaknesses


def build_insights(
    attempted: int,
    change: int | None,
    weaknesses: list,
    mock_tests: int,
) -> list[str]:
    if attempted == 0:
        return ["Take your first practice test to unlock personalised insights."]

    insights = []

    if change is not None:
        if change > 0:
            insights.append(
                f"Your weekly accuracy rose by {change} points compared with the previous week."
            )
        elif change < 0:
            insights.append(
                f"Your weekly accuracy dropped by {abs(change)} points compared with the previous week."
            )
        else:
            insights.append("Your weekly accuracy is unchanged from the previous week.")

    if weaknesses:
        names = " and ".join(name for name, _ in weaknesses[:2])
        insights.append(
            f"Focus on {names}: your accuracy there is below {WEAKNESS_MAX_ACCURACY}%."
        )
    else:
        insights.append(
            f"No chapter with {MIN_SAMPLE}+ answers is weak yet. Keep practising for more reliable insights."
        )

    if mock_tests == 0:
        insights.append(
            "You haven't taken a full mock test yet. Try one to check your overall readiness."
        )

    return insights