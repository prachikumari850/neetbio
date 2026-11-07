from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator

Subject = Literal["botany", "zoology"]
Unit = Literal[
    "cell-biology",
    "genetics-evolution",
    "human-physiology",
    "ecology",
    "plant-physiology",
    "reproduction",
    "diversity-of-life",
    "biotechnology",
    "structural-organisation",
    "health-and-disease",
]
Difficulty = Literal["easy", "medium", "hard"]
QuestionType = Literal["mcq", "assertion_reason", "statement"]
SourceType = Literal["original", "ai_drafted", "pyq", "open_licensed"]

OPTION_COUNT = 4
OPTION_MAX_LENGTH = 300
URL_PREFIXES = ("https://", "http://")


def clean_spaces(value):
    return " ".join(value.split()) if isinstance(value, str) else value


class QuestionSource(BaseModel):
    type: SourceType
    name: str = Field(min_length=3, max_length=200)
    url: str | None = Field(default=None, max_length=500)
    year: int | None = Field(default=None, ge=1990, le=2100)
    paper: str | None = Field(default=None, min_length=2, max_length=100)
    question_number: int | None = Field(default=None, ge=1, le=300)
    license: str | None = Field(default=None, min_length=2, max_length=100)
    answer_key_url: str | None = Field(default=None, max_length=500)
    rights_note: str | None = Field(default=None, min_length=10, max_length=500)
    notes: str | None = Field(default=None, max_length=500)

    @field_validator("url", "answer_key_url")
    @classmethod
    def check_url(cls, value: str | None) -> str | None:
        if value is not None and not value.startswith(URL_PREFIXES):
            raise ValueError("Must start with http:// or https://.")

        return value

    @model_validator(mode="after")
    def check_required_details(self) -> "QuestionSource":
        required = {
            "pyq": ("year", "paper", "answer_key_url", "rights_note"),
            "open_licensed": ("url", "license"),
        }.get(self.type, ())
        missing = [name for name in required if not getattr(self, name)]

        if missing:
            raise ValueError(
                f"A '{self.type}' source needs: {', '.join(missing)}."
            )

        return self


class QuestionRecord(BaseModel):
    id: str = Field(pattern=r"^[a-z0-9][a-z0-9-]{2,60}$")
    subject: Subject
    unit: Unit
    chapter: str = Field(min_length=3, max_length=120)
    topic: str = Field(min_length=3, max_length=120)
    class_level: Literal["11", "12"]
    difficulty: Difficulty
    type: QuestionType = "mcq"
    text: str = Field(min_length=15, max_length=1000)
    options: list[str]
    correct_index: int = Field(ge=0, lt=OPTION_COUNT)
    explanation: str = Field(min_length=40, max_length=1500)
    option_notes: list[str | None] | None = None
    source: QuestionSource

    @field_validator("text", "explanation", "chapter", "topic", mode="before")
    @classmethod
    def collapse_spaces(cls, value):
        return clean_spaces(value)

    @field_validator("options")
    @classmethod
    def check_options(cls, value: list[str]) -> list[str]:
        options = [clean_spaces(option) for option in value]

        if len(options) != OPTION_COUNT:
            raise ValueError(f"Exactly {OPTION_COUNT} options are required.")

        if any(not option or len(option) > OPTION_MAX_LENGTH for option in options):
            raise ValueError(
                f"Each option needs 1 to {OPTION_MAX_LENGTH} characters."
            )

        if len({option.casefold() for option in options}) != len(options):
            raise ValueError("Options must be different from each other.")

        return options

    @field_validator("option_notes")
    @classmethod
    def check_option_notes(cls, value: list[str | None] | None):
        if value is None:
            return None

        if len(value) != OPTION_COUNT:
            raise ValueError(f"Provide {OPTION_COUNT} option notes, or none.")

        return [clean_spaces(note) or None if note else None for note in value]

    @model_validator(mode="after")
    def check_assertion_reason(self) -> "QuestionRecord":
        if self.type == "assertion_reason" and not (
            "Assertion" in self.text and "Reason" in self.text
        ):
            raise ValueError(
                "Assertion-reason questions must contain 'Assertion' and 'Reason'."
            )

        return self