from fastapi import APIRouter

from app.api.v1.endpoints import (
    ai,
    ai_diagrams,
    auth,
    bookmarks,
    diagrams,
    health,
    practice,
    users,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(diagrams.router)
api_router.include_router(bookmarks.router)
api_router.include_router(ai.router)
api_router.include_router(ai_diagrams.router)
api_router.include_router(practice.router)