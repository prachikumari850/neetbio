from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator

from app.schemas.question import (
    OPTION_COUNT,
    Difficulty,
    QuestionType,
    SourceType,
    Subject,
)

MAX_QUESTIONS = 90
AREA_ID_PATTERN = r"^[a-z-]{2,40}$"


class AttemptRequest(BaseModel):
    mode: Literal["area", "chapter", "mock", "pyq", "custom"]
    area: str | None = Field(default=None, pattern=AREA_ID_PATTERN)
    chapter: str | None = Field(default=None, min_length=3, max_length=120)
    year: int | None = Field(default=None, ge=1990, le=2100)
    areas: list[str] | None = Field(default=None, max_length=10)
    count: int | None = Field(default=None, ge=1, le=MAX_QUESTIONS)
    difficulty: Difficulty | Literal["mixed"] = "mixed"

    @model_validator(mode="after")
    def check_mode_fields(self) -> "AttemptRequest":
        needed = {
            "area": ("area",),
            "chapter": ("chapter",),
            "mock": ("count",),
            "pyq": ("year",),
            "custom": ("areas", "count"),
        }[self.mode]
        missing = [name for name in needed if not getattr(self, name)]

        if missing:
            raise ValueError(f"A '{self.mode}' test needs: {', '.join(missing)}.")

        return self


class AnswerSubmission(BaseModel):
    answers: dict[str, int]

    @field_validator("answers")
    @classmethod
    def check_answers(cls, value: dict[str, int]) -> dict[str, int]:
        if len(value) > MAX_QUESTIONS:
            raise ValueError("Too many answers.")

        if any(not 0 <= choice < OPTION_COUNT for choice in value.values()):
            raise ValueError("Each answer must be an option number from 0 to 3.")

        return value


class QuestionPublic(BaseModel):
    id: str
    text: str
    options: list[str]
    subject: Subject
    unit: str
    chapter: str
    topic: str
    difficulty: Difficulty
    type: QuestionType

    @classmethod
    def from_document(cls, document: dict):
        return cls.model_validate({**document, "id": document["_id"]})


class SourcePublic(BaseModel):
    type: SourceType
    name: str
    url: str | None = None
    year: int | None = None
    paper: str | None = None


class ReviewQuestion(QuestionPublic):
    correct_index: int
    explanation: str
    option_notes: list[str | None]
    source: SourcePublic

    @classmethod
    def from_document(cls, document: dict):
        return cls.model_validate(
            {
                **document,
                "id": document["_id"],
                "option_notes": document.get("option_notes") or [None] * OPTION_COUNT,
            }
        )


class AttemptPublic(BaseModel):
    id: str
    title: str
    duration_sec: int
    started_at: datetime
    questions: list[QuestionPublic]


class DetailPublic(BaseModel):
    question: ReviewQuestion
    selected_index: int | None
    is_answered: bool
    is_correct: bool


class ResultPublic(BaseModel):
    id: str
    title: str
    correct: int
    wrong: int
    skipped: int
    score: int
    max_score: int
    accuracy: int
    time_taken_sec: int
    submitted_at: datetime
    details: list[DetailPublic]


class AttemptSummary(BaseModel):
    id: str
    title: str
    area_id: str
    correct: int
    total: int
    accuracy: int
    minutes: int
    submitted_at: datetime


class AttemptList(BaseModel):
    items: list[AttemptSummary]


class SubjectStat(BaseModel):
    subject: Subject
    attempted: int
    correct: int
    accuracy: int


class StatsPublic(BaseModel):
    attempted: int
    correct: int
    wrong: int
    tests_completed: int
    accuracy: int
    by_subject: list[SubjectStat]


class AreaInfo(BaseModel):
    id: str
    label: str
    count: int


class ChapterInfo(BaseModel):
    name: str
    subject: Subject | Literal["mixed"]
    count: int


class PyqYearInfo(BaseModel):
    year: int
    count: int


class CatalogTotals(BaseModel):
    questions: int
    botany: int
    zoology: int


class CatalogPublic(BaseModel):
    totals: CatalogTotals
    areas: list[AreaInfo]
    chapters: list[ChapterInfo]
    pyq_years: list[PyqYearInfo]
    mock_sizes: list[int]
