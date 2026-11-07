from typing import Literal

from pydantic import BaseModel

ClassLevel = Literal["11", "12"]
DiagramType = Literal["structural", "process", "lifecycle", "comparison"]
DiagramFeature = Literal["interactive", "explanation", "practice"]
DiagramSort = Literal["relevant", "az", "za"]


class Structure(BaseModel):
    name: str
    top: float
    left: float
    description: str


class DiagramSummary(BaseModel):
    id: str
    title: str
    topic: str
    chapter: str
    class_level: ClassLevel
    type: DiagramType
    features: list[DiagramFeature]
    neet: bool
    image: str
    summary: str

    @classmethod
    def from_document(cls, document: dict):
        return cls.model_validate({**document, "id": document["_id"]})


class DiagramDetail(DiagramSummary):
    structures: list[Structure]


class DiagramPage(BaseModel):
    items: list[DiagramSummary]
    total: int
    page: int
    page_size: int
    total_pages: int


class ChapterFacet(BaseModel):
    name: str
    class_level: ClassLevel


class TopicFacet(BaseModel):
    name: str
    chapter: str
    class_level: ClassLevel


class FacetsResponse(BaseModel):
    chapters: list[ChapterFacet]
    topics: list[TopicFacet]
    types: dict[str, int]
    features: dict[str, int]