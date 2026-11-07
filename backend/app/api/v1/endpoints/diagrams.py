from typing import Annotated

from fastapi import APIRouter, Depends, Query

from app.api.deps import get_current_user
from app.schemas.diagram import (
    ClassLevel,
    DiagramDetail,
    DiagramFeature,
    DiagramPage,
    DiagramSort,
    DiagramType,
    FacetsResponse,
)
from app.services import diagram_service
from app.services.diagram_service import DiagramQuery

router = APIRouter(
    prefix="/diagrams",
    tags=["diagrams"],
    dependencies=[Depends(get_current_user)],
)


@router.get("", response_model=DiagramPage)
async def list_diagrams(
    q: Annotated[str | None, Query(max_length=100)] = None,
    class_level: ClassLevel | None = None,
    chapter: Annotated[str | None, Query(max_length=120)] = None,
    topic: Annotated[str | None, Query(max_length=120)] = None,
    types: Annotated[list[DiagramType] | None, Query(alias="type")] = None,
    features: Annotated[list[DiagramFeature] | None, Query(alias="feature")] = None,
    ids: Annotated[list[str] | None, Query(max_length=50)] = None,
    sort: DiagramSort = "relevant",
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=50)] = 8,
) -> DiagramPage:
    query = DiagramQuery(
        text=q,
        class_level=class_level,
        chapter=chapter,
        topic=topic,
        types=types,
        features=features,
        ids=ids,
        sort=sort,
        page=page,
        page_size=page_size,
    )
    return await diagram_service.search_diagrams(query)


@router.get("/facets", response_model=FacetsResponse)
async def get_facets() -> FacetsResponse:
    return await diagram_service.get_facets()


@router.get("/{diagram_id}", response_model=DiagramDetail)
async def get_diagram(diagram_id: str) -> DiagramDetail:
    return await diagram_service.get_diagram(diagram_id)