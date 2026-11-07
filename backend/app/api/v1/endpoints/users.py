from fastapi import APIRouter

from app.api.deps import CurrentUser
from app.schemas.user import ProfileUpdate, UserPublic
from app.services import auth_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
async def read_current_user(user: CurrentUser) -> UserPublic:
    return UserPublic.from_document(user)


@router.patch("/me", response_model=UserPublic)
async def update_current_user(data: ProfileUpdate, user: CurrentUser) -> UserPublic:
    updated_user = await auth_service.update_profile(user, data)
    return UserPublic.from_document(updated_user)