from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

DiagramKind = Literal["structure", "process", "cycle"]

PROMPT_MIN_LENGTH = 3
PROMPT_MAX_LENGTH = 300


class GenerateRequest(BaseModel):
    prompt: str = Field(min_length=PROMPT_MIN_LENGTH, max_length=PROMPT_MAX_LENGTH)

    @field_validator("prompt")
    @classmethod
    def clean_prompt(cls, value: str) -> str:
        prompt = " ".join(value.split())

        if len(prompt) < PROMPT_MIN_LENGTH:
            raise ValueError("Describe the diagram you want.")

        return prompt


class PartPublic(BaseModel):
    name: str
    description: str


class SceneNode(BaseModel):
    id: int
    label: str
    description: str
    x: float
    y: float
    w: float
    h: float


class SceneEdge(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float
    arrow: bool


class SceneBody(BaseModel):
    cx: float
    cy: float
    rx: float
    ry: float


class Scene(BaseModel):
    width: int
    height: float
    body: SceneBody | None
    nodes: list[SceneNode]
    edges: list[SceneEdge]


class GeneratedDiagramSummary(BaseModel):
    id: str
    title: str
    kind: DiagramKind
    created_at: datetime

    @classmethod
    def from_document(cls, document: dict) -> "GeneratedDiagramSummary":
        return cls(
            id=str(document["_id"]),
            title=document["title"],
            kind=document["kind"],
            created_at=document["created_at"],
        )


class GeneratedDiagramDetail(GeneratedDiagramSummary):
    prompt: str
    parts: list[PartPublic]
    scene: Scene


class GeneratedDiagramList(BaseModel):
    items: list[GeneratedDiagramSummary]