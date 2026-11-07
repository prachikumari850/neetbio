from fastapi import APIRouter, status

from app.api.deps import CurrentUser
from app.schemas.practice import (
    AnswerSubmission,
    AttemptList,
    AttemptPublic,
    AttemptRequest,
    CatalogPublic,
    ResultPublic,
    StatsPublic,
)
from app.services import practice_service

router = APIRouter(prefix="/practice", tags=["practice"])


@router.get("/catalog", response_model=CatalogPublic)
async def get_catalog(_user: CurrentUser) -> CatalogPublic:
    return await practice_service.get_catalog()


@router.get("/stats", response_model=StatsPublic)
async def get_stats(user: CurrentUser) -> StatsPublic:
    return await practice_service.get_stats(user)


@router.get("/attempts", response_model=AttemptList)
async def list_attempts(user: CurrentUser) -> AttemptList:
    return await practice_service.list_attempts(user)


@router.post("/attempts", response_model=AttemptPublic, status_code=status.HTTP_201_CREATED)
async def start_attempt(data: AttemptRequest, user: CurrentUser) -> AttemptPublic:
    return await practice_service.start_attempt(user, data)


@router.get("/attempts/{attempt_id}", response_model=ResultPublic)
async def get_result(attempt_id: str, user: CurrentUser) -> ResultPublic:
    return await practice_service.get_result(user, attempt_id)


@router.post("/attempts/{attempt_id}/submit", response_model=ResultPublic)
async def submit_attempt(
    attempt_id: str, data: AnswerSubmission, user: CurrentUser
) -> ResultPublic:
    return await practice_service.submit_attempt(user, attempt_id, data.answers)