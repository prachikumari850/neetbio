from fastapi import APIRouter, Depends, Response, status

from app.core.config import Settings, get_settings
from app.database.mongodb import ping_database
from app.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health_check(
    response: Response,
    settings: Settings = Depends(get_settings),
) -> HealthResponse:
    database_is_up = await ping_database()

    if not database_is_up:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return HealthResponse(
        status="ok" if database_is_up else "degraded",
        app=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
        database="up" if database_is_up else "down",
    )