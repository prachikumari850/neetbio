from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

TITLE_MAX_LENGTH = 100
CONTENT_MAX_LENGTH = 5000


class NoteInput(BaseModel):
    title: str = Field(min_length=1, max_length=TITLE_MAX_LENGTH)
    content: str = Field(min_length=1, max_length=CONTENT_MAX_LENGTH)

    @field_validator("title")
    @classmethod
    def clean_title(cls, value: str) -> str:
        title = " ".join(value.split())

        if not title:
            raise ValueError("Give your note a title.")

        return title

    @field_validator("content")
    @classmethod
    def clean_content(cls, value: str) -> str:
        content = value.strip()

        if not content:
            raise ValueError("Write something in the note.")

        return content


class NotePublic(BaseModel):
    id: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime


class NoteList(BaseModel):
    items: list[NotePublic]


class GoalTargets(BaseModel):
    diagrams: int = Field(ge=1, le=50)
    questions: int = Field(ge=1, le=200)
    chapters: int = Field(ge=1, le=10)
    ai: int = Field(ge=1, le=50)


class DiagramViewRequest(BaseModel):
    diagram_id: str = Field(min_length=1, max_length=80)


class GoalItem(BaseModel):
    id: str
    label: str
    target: int
    progress: int
    done: bool


class GoalsPublic(BaseModel):
    targets: GoalTargets
    items: list[GoalItem]
    completed: int
    total: int


class StreakPublic(BaseModel):
    current: int
    today_active: bool


class LearningStats(BaseModel):
    tests_completed: int
    questions_attempted: int
    correct: int
    wrong: int
    accuracy: int | None
    practice_time_sec: int
    diagrams_studied: int
    chapters_studied: int
    chapters_completed: int
    chapters_total: int
    questions_total: int
    questions_mastered: int
    progress: int


class UnitProgress(BaseModel):
    id: str
    label: str
    total: int
    mastered: int
    progress: int


class ChapterItem(BaseModel):
    name: str
    subject: str
    total: int
    answered: int
    mastered: int
    progress: int
    accuracy: int | None
    last_practiced: datetime | None
    diagram_id: str | None


class ActivityItem(BaseModel):
    id: str
    kind: Literal["test", "diagram", "note", "chat"]
    label: str
    at: datetime


class DiagramRecommendation(BaseModel):
    diagram_id: str
    title: str
    topic: str
    chapter: str
    class_level: str
    image: str
    reason: str


class PracticeRecommendation(BaseModel):
    chapter: str
    reason: str
    accuracy: int | None


class Recommendations(BaseModel):
    diagrams: list[DiagramRecommendation]
    practice: PracticeRecommendation | None


class LearningSummary(BaseModel):
    streak: StreakPublic
    goals: GoalsPublic
    stats: LearningStats
    units: list[UnitProgress]
    continue_item: ChapterItem | None
    in_progress: list[ChapterItem]
    completed: list[ChapterItem]
    activity: list[ActivityItem]
    recommendations: Recommendations