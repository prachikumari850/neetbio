from datetime import date, datetime

from pydantic import BaseModel


class OverviewTotals(BaseModel):
    tests_completed: int
    questions_attempted: int
    correct: int
    wrong: int
    skipped: int
    accuracy: int | None
    practice_time_sec: int


class OverviewProgress(BaseModel):
    total_questions: int
    mastered: int
    percent: int


class AreaPerformance(BaseModel):
    id: str
    label: str
    total: int
    mastered: int
    progress: int
    attempted: int
    correct: int
    accuracy: int | None


class WeekPoint(BaseModel):
    week_start: date
    accuracy: int


class TestPoint(BaseModel):
    id: str
    title: str
    submitted_at: datetime
    score: int
    max_score: int
    accuracy: int


class QuestionAnalysis(BaseModel):
    correct: int
    incorrect: int
    skipped: int
    total: int


class TopicItem(BaseModel):
    topic: str
    total: int
    mastered: int
    progress: int
    attempted: int
    correct: int
    accuracy: int | None


class ChapterPerformance(BaseModel):
    name: str
    subject: str
    total: int
    mastered: int
    progress: int
    attempted: int
    correct: int
    accuracy: int | None
    topics: list[TopicItem]


class RankedChapter(BaseModel):
    name: str
    accuracy: int
    attempted: int


class AnalyticsOverview(BaseModel):
    totals: OverviewTotals
    progress: OverviewProgress
    accuracy_change: int | None
    areas: list[AreaPerformance]
    weekly_trend: list[WeekPoint]
    tests: list[TestPoint]
    question_analysis: QuestionAnalysis
    chapters: list[ChapterPerformance]
    strengths: list[RankedChapter]
    weaknesses: list[RankedChapter]
    insights: list[str]
    excluded_attempts: int
    min_sample: int