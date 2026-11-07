from typing import Annotated

from fastapi import APIRouter, Query

from app.api.deps import CurrentUser
from app.schemas.analytics import AnalyticsOverview
from app.services import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])

OffsetMinutes = Annotated[int, Query(ge=-840, le=840)]


@router.get("/overview", response_model=AnalyticsOverview)
async def get_overview(user: CurrentUser, utc_offset_minutes: OffsetMinutes = 0) -> dict:
    return await analytics_service.get_overview(user, utc_offset_minutes)