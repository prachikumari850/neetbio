from typing import Annotated

from fastapi import APIRouter, Query, Response, status

from app.api.deps import CurrentUser
from app.schemas.learning import DiagramViewRequest, GoalTargets, LearningSummary
from app.services import learning_service

router = APIRouter(prefix="/learning", tags=["learning"])

OffsetMinutes = Annotated[int, Query(ge=-840, le=840)]


@router.get("/summary", response_model=LearningSummary)
async def get_summary(user: CurrentUser, utc_offset_minutes: OffsetMinutes = 0) -> dict:
    return await learning_service.get_summary(user, utc_offset_minutes)


@router.put("/goals", response_model=GoalTargets)
async def update_goals(data: GoalTargets, user: CurrentUser) -> GoalTargets:
    return await learning_service.update_goals(user, data)


@router.post("/diagram-views", status_code=status.HTTP_204_NO_CONTENT)
async def record_diagram_view(data: DiagramViewRequest, user: CurrentUser) -> Response:
    await learning_service.record_diagram_view(user, data.diagram_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)