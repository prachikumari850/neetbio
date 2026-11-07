from fastapi import APIRouter, Response, status

from app.api.deps import CurrentUser
from app.schemas.user import LoginRequest, SignupRequest, TokenResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(data: SignupRequest) -> TokenResponse:
    return await auth_service.signup(data)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest) -> TokenResponse:
    return await auth_service.login(data)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(user: CurrentUser) -> Response:
    await auth_service.logout(user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)