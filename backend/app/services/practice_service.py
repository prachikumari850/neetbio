from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from bson import ObjectId
from bson.errors import InvalidId

from app.core.errors import AppError
from app.repositories import attempt_repository, question_repository
from app.schemas.practice import (
    MAX_QUESTIONS,
    AreaInfo,
    AttemptList,
    AttemptPublic,
    AttemptRequest,
    AttemptSummary,
    CatalogPublic,
    CatalogTotals,
    ChapterInfo,
    DetailPublic,
    PyqYearInfo,
    QuestionPublic,
    ResultPublic,
    ReviewQuestion,
    StatsPublic,
    SubjectStat,
)
from app.services import scoring

PRACTICE_AREAS = (
    ("botany", "Botany", "subject"),
    ("zoology", "Zoology", "subject"),
    ("cell-biology", "Cell Biology", "unit"),
    ("genetics-evolution", "Genetics & Evolution", "unit"),
    ("human-physiology", "Human Physiology", "unit"),
    ("ecology", "Ecology & Environment", "unit"),
)
AREA_LABELS = {area_id: label for area_id, label, _ in PRACTICE_AREAS}
AREA_FIELDS = {area_id: field for area_id, _, field in PRACTICE_AREAS}

MOCK_SIZES = (10, 20, 30, 45, 90)
MIN_CHAPTER_QUESTIONS = 2
DEFAULT_PRACTICE_COUNT = 10
SECONDS_PER_QUESTION = 66
MIN_DURATION_SEC = 300
STALE_AFTER = timedelta(hours=6)
HISTORY_LIMIT = 20


@dataclass(frozen=True)
class AttemptSpec:
    title: str
    mode: str
    mongo_filter: dict
    count: int
    area_id: str | None = None
    must_fill: bool = False


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _attempt_not_found() -> AppError:
    return AppError("Test not found.", 404, "attempt_not_found")


def _area_filter(area_id: str) -> dict:
    field = AREA_FIELDS.get(area_id)

    if field is None:
        raise AppError("Unknown practice area.", 422, "unknown_area")

    return {field: area_id}


def build_spec(request: AttemptRequest) -> AttemptSpec:
    if request.mode == "area":
        return AttemptSpec(
            title=f"{AREA_LABELS.get(request.area, 'Practice')} – Practice",
            mode="area",
            mongo_filter=_area_filter(request.area),
            count=request.count or DEFAULT_PRACTICE_COUNT,
            area_id=request.area,
        )

    if request.mode == "chapter":
        return AttemptSpec(
            title=f"{request.chapter} – Chapter Test",
            mode="chapter",
            mongo_filter={"chapter": request.chapter},
            count=request.count or DEFAULT_PRACTICE_COUNT,
        )

    if request.mode == "mock":
        if request.count not in MOCK_SIZES:
            raise AppError("Choose a valid mock test size.", 422, "mock_size_invalid")

        return AttemptSpec(
            title=f"Full Syllabus Mock Test – {request.count} Questions",
            mode="mock",
            mongo_filter={},
            count=request.count,
            must_fill=True,
        )

    if request.mode == "pyq":
        return AttemptSpec(
            title=f"NEET {request.year} – Previous Year Questions",
            mode="pyq",
            mongo_filter={"source.type": "pyq", "source.year": request.year},
            count=MAX_QUESTIONS,
        )

    mongo_filter = {
        "$or": [_area_filter(area_id) for area_id in dict.fromkeys(request.areas)]
    }

    if request.difficulty != "mixed":
        mongo_filter["difficulty"] = request.difficulty

    return AttemptSpec(
        title="Custom Test",
        mode="custom",
        mongo_filter=mongo_filter,
        count=request.count,
    )


def _result_area(spec: AttemptSpec, questions: list[dict]) -> str:
    if spec.area_id:
        return spec.area_id

    subjects = {question["subject"] for question in questions}
    return subjects.pop() if len(subjects) == 1 else "mixed"


async def start_attempt(user: dict, request: AttemptRequest) -> AttemptPublic:
    spec = build_spec(request)
    questions = await question_repository.sample(spec.mongo_filter, spec.count)

    if not questions:
        raise AppError("No questions match those choices yet.", 422, "no_questions")

    if spec.must_fill and len(questions) < spec.count:
        raise AppError(
            "There aren't enough questions for that test size yet.",
            422,
            "not_enough_questions",
        )

    now = _now()
    await attempt_repository.delete_stale(user["_id"], now - STALE_AFTER)

    attempt = {
        "_id": ObjectId(),
        "user_id": user["_id"],
        "title": spec.title,
        "mode": spec.mode,
        "area_id": _result_area(spec, questions),
        "question_ids": [question["_id"] for question in questions],
        "duration_sec": max(MIN_DURATION_SEC, len(questions) * SECONDS_PER_QUESTION),
        "started_at": now,
        "status": "in_progress",
    }
    await attempt_repository.insert(attempt)

    return AttemptPublic(
        id=str(attempt["_id"]),
        title=attempt["title"],
        duration_sec=attempt["duration_sec"],
        started_at=now,
        questions=[QuestionPublic.from_document(question) for question in questions],
    )


async def _find_attempt(user: dict, attempt_id: str) -> dict:
    try:
        object_id = ObjectId(attempt_id)
    except (InvalidId, TypeError):
        raise _attempt_not_found() from None

    attempt = await attempt_repository.find_for_user(user["_id"], object_id)

    if attempt is None:
        raise _attempt_not_found()

    return attempt


async def _load_questions(attempt: dict) -> list[dict]:
    documents = await question_repository.find_by_ids(
        attempt["question_ids"], with_answers=True
    )
    by_id = {document["_id"]: document for document in documents}
    return [by_id[question_id] for question_id in attempt["question_ids"] if question_id in by_id]


def _build_result(attempt: dict, questions: list[dict]) -> ResultPublic:
    evaluation = scoring.evaluate(questions, attempt["answers"])

    return ResultPublic(
        id=str(attempt["_id"]),
        title=attempt["title"],
        correct=attempt["correct"],
        wrong=attempt["wrong"],
        skipped=attempt["skipped"],
        score=attempt["score"],
        max_score=attempt["max_score"],
        accuracy=attempt["accuracy"],
        time_taken_sec=attempt["time_taken_sec"],
        submitted_at=attempt["submitted_at"],
        details=[
            DetailPublic(
                question=ReviewQuestion.from_document(detail["question"]),
                selected_index=detail["selected_index"],
                is_answered=detail["is_answered"],
                is_correct=detail["is_correct"],
            )
            for detail in evaluation["details"]
        ],
    )


async def submit_attempt(user: dict, attempt_id: str, answers: dict[str, int]) -> ResultPublic:
    attempt = await _find_attempt(user, attempt_id)

    if attempt["status"] != "in_progress":
        raise AppError("This test was already submitted.", 409, "attempt_submitted")

    if set(answers) - set(attempt["question_ids"]):
        raise AppError(
            "Answers include questions that are not part of this test.",
            422,
            "unknown_question",
        )

    questions = await _load_questions(attempt)
    evaluation = scoring.evaluate(questions, answers)
    now = _now()
    elapsed = int((now - attempt["started_at"]).total_seconds())

    saved = await attempt_repository.mark_submitted(
        user["_id"],
        attempt["_id"],
        {
            "status": "submitted",
            "submitted_at": now,
            "answers": answers,
            "time_taken_sec": max(0, min(elapsed, attempt["duration_sec"])),
            "total": evaluation["total"],
            "attempted": evaluation["attempted"],
            "correct": evaluation["correct"],
            "wrong": evaluation["wrong"],
            "skipped": evaluation["skipped"],
            "score": evaluation["score"],
            "max_score": evaluation["max_score"],
            "accuracy": evaluation["accuracy"],
            "by_subject": evaluation["by_subject"],
        },
    )

    if saved is None:
        raise AppError("This test was already submitted.", 409, "attempt_submitted")

    return _build_result(saved, questions)


async def get_result(user: dict, attempt_id: str) -> ResultPublic:
    attempt = await _find_attempt(user, attempt_id)

    if attempt["status"] != "submitted":
        raise AppError("This test is still in progress.", 409, "attempt_in_progress")

    return _build_result(attempt, await _load_questions(attempt))


async def list_attempts(user: dict) -> AttemptList:
    documents = await attempt_repository.list_submitted(user["_id"], HISTORY_LIMIT)

    return AttemptList(
        items=[
            AttemptSummary(
                id=str(document["_id"]),
                title=document["title"],
                area_id=document["area_id"],
                correct=document["correct"],
                total=document["total"],
                accuracy=document["accuracy"],
                minutes=max(1, round(document["time_taken_sec"] / 60)),
                submitted_at=document["submitted_at"],
            )
            for document in documents
        ]
    )


def _percent(part: int, whole: int) -> int:
    return round(part / whole * 100) if whole else 0


async def get_stats(user: dict) -> StatsPublic:
    totals = await attempt_repository.totals(user["_id"]) or {}
    attempted = totals.get("attempted", 0)
    correct = totals.get("correct", 0)

    return StatsPublic(
        attempted=attempted,
        correct=correct,
        wrong=totals.get("wrong", 0),
        tests_completed=totals.get("tests", 0),
        accuracy=_percent(correct, attempted),
        by_subject=[
            SubjectStat(
                subject=subject,
                attempted=totals.get(f"{subject}_attempted", 0),
                correct=totals.get(f"{subject}_correct", 0),
                accuracy=_percent(
                    totals.get(f"{subject}_correct", 0),
                    totals.get(f"{subject}_attempted", 0),
                ),
            )
            for subject in scoring.SUBJECTS
        ],
    )


def _count(groups: list[dict], **match) -> int:
    return sum(
        group["count"]
        for group in groups
        if all(group.get(key) == value for key, value in match.items())
    )


async def get_catalog() -> CatalogPublic:
    groups = await question_repository.summarize()
    total = _count(groups)

    chapter_counts: dict[str, int] = {}
    chapter_subjects: dict[str, set[str]] = {}
    for group in groups:
        chapter = group["chapter"]
        chapter_counts[chapter] = chapter_counts.get(chapter, 0) + group["count"]
        chapter_subjects.setdefault(chapter, set()).add(group["subject"])

    year_counts: dict[int, int] = {}
    for group in groups:
        if group.get("source_type") == "pyq" and group.get("year"):
            year_counts[group["year"]] = year_counts.get(group["year"], 0) + group["count"]

    return CatalogPublic(
        totals=CatalogTotals(
            questions=total,
            botany=_count(groups, subject="botany"),
            zoology=_count(groups, subject="zoology"),
        ),
        areas=[
            AreaInfo(id=area_id, label=label, count=_count(groups, **{field: area_id}))
            for area_id, label, field in PRACTICE_AREAS
        ],
        chapters=[
            ChapterInfo(
                name=chapter,
                subject=(
                    next(iter(chapter_subjects[chapter]))
                    if len(chapter_subjects[chapter]) == 1
                    else "mixed"
                ),
                count=count,
            )
            for chapter, count in sorted(chapter_counts.items())
            if count >= MIN_CHAPTER_QUESTIONS
        ],
        pyq_years=[
            PyqYearInfo(year=year, count=count)
            for year, count in sorted(year_counts.items(), reverse=True)
        ],
        mock_sizes=[size for size in MOCK_SIZES if size <= total],
    )
