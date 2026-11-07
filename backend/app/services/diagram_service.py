import math
import re
from collections import Counter
from dataclasses import dataclass

from app.core.errors import AppError
from app.repositories import diagram_repository
from app.schemas.diagram import (
    ChapterFacet,
    DiagramDetail,
    DiagramPage,
    DiagramSummary,
    FacetsResponse,
    TopicFacet,
)

SORT_ORDERS = {
    "relevant": [("order", 1)],
    "az": [("title", 1), ("_id", 1)],
    "za": [("title", -1), ("_id", 1)],
}
SEARCH_FIELDS = ("title", "topic", "chapter")


@dataclass(frozen=True)
class DiagramQuery:
    text: str | None
    class_level: str | None
    chapter: str | None
    topic: str | None
    types: list[str] | None
    features: list[str] | None
    ids: list[str] | None
    sort: str
    page: int
    page_size: int


def build_filter(query: DiagramQuery) -> dict:
    conditions: dict = {}

    text = (query.text or "").strip()
    if text:
        pattern = re.escape(text)
        conditions["$or"] = [
            {field: {"$regex": pattern, "$options": "i"}} for field in SEARCH_FIELDS
        ]

    if query.class_level:
        conditions["class_level"] = query.class_level

    if query.chapter:
        conditions["chapter"] = query.chapter

    if query.topic:
        conditions["topic"] = query.topic

    if query.types:
        conditions["type"] = {"$in": query.types}

    if query.features:
        conditions["features"] = {"$all": query.features}

    if query.ids:
        conditions["_id"] = {"$in": query.ids}

    return conditions


async def search_diagrams(query: DiagramQuery) -> DiagramPage:
    mongo_filter = build_filter(query)
    total = await diagram_repository.count(mongo_filter)
    documents = await diagram_repository.search(
        mongo_filter,
        SORT_ORDERS[query.sort],
        skip=(query.page - 1) * query.page_size,
        limit=query.page_size,
    )

    return DiagramPage(
        items=[DiagramSummary.from_document(document) for document in documents],
        total=total,
        page=query.page,
        page_size=query.page_size,
        total_pages=max(1, math.ceil(total / query.page_size)),
    )


async def get_diagram(diagram_id: str) -> DiagramDetail:
    document = await diagram_repository.find_by_id(diagram_id)

    if document is None:
        raise AppError("Diagram not found.", 404, "diagram_not_found")

    return DiagramDetail.from_document(document)


async def get_facets() -> FacetsResponse:
    documents = await diagram_repository.list_facet_source()

    chapters = dict.fromkeys((item["class_level"], item["chapter"]) for item in documents)
    topics = dict.fromkeys(
        (item["class_level"], item["chapter"], item["topic"]) for item in documents
    )

    return FacetsResponse(
        chapters=[
            ChapterFacet(name=chapter, class_level=class_level)
            for class_level, chapter in chapters
        ],
        topics=[
            TopicFacet(name=topic, chapter=chapter, class_level=class_level)
            for class_level, chapter, topic in topics
        ],
        types=dict(Counter(item["type"] for item in documents)),
        features=dict(
            Counter(feature for item in documents for feature in item["features"])
        ),
    )