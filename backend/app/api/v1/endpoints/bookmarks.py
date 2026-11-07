from fastapi import APIRouter, Response, status

from app.api.deps import CurrentUser
from app.schemas.bookmark import (
    BookmarkCollection,
    BookmarkCreate,
    BookmarkMove,
    BookmarkPublic,
    FolderCreate,
    FolderList,
)
from app.services import bookmark_service

router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])


@router.get("", response_model=BookmarkCollection)
async def list_bookmarks(user: CurrentUser) -> BookmarkCollection:
    return await bookmark_service.list_bookmarks(user)


@router.post("", response_model=BookmarkPublic, status_code=status.HTTP_201_CREATED)
async def add_bookmark(data: BookmarkCreate, user: CurrentUser) -> BookmarkPublic:
    return await bookmark_service.add_bookmark(user, data)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def clear_bookmarks(user: CurrentUser) -> Response:
    await bookmark_service.clear_bookmarks(user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/folders", response_model=FolderList, status_code=status.HTTP_201_CREATED)
async def create_folder(data: FolderCreate, user: CurrentUser) -> FolderList:
    folders = await bookmark_service.create_folder(user, data.name)
    return FolderList(folders=folders)


@router.patch("/{item_id}", response_model=BookmarkPublic)
async def move_bookmark(
    item_id: str, data: BookmarkMove, user: CurrentUser
) -> BookmarkPublic:
    return await bookmark_service.move_bookmark(user, item_id, data.folder)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_bookmark(item_id: str, user: CurrentUser) -> Response:
    await bookmark_service.remove_bookmark(user, item_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)