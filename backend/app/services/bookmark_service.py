from datetime import datetime, timezone

from pymongo.errors import DuplicateKeyError

from app.core.errors import AppError
from app.repositories import bookmark_repository, diagram_repository
from app.schemas.bookmark import (
    BookmarkCollection,
    BookmarkCreate,
    BookmarkPublic,
)

BOOKMARK_LIMIT = 100
CUSTOM_FOLDER_LIMIT = 20
DEFAULT_FOLDERS = [
    "Important Topics",
    "Revision",
    "Weak Areas",
    "NEET Practice",
    "Others",
]
DIAGRAM_ID_PREFIX = "diagram-"


async def _all_folders(user: dict) -> list[str]:
    custom = await bookmark_repository.list_custom_folders(user["_id"])
    return [*DEFAULT_FOLDERS, *custom]


async def _checked_folder(user: dict, folder: str) -> str:
    folders = await _all_folders(user)

    if folder not in folders:
        raise AppError("That folder does not exist.", 422, "unknown_folder")

    return folder


async def _diagram_details(item_id: str) -> dict:
    diagram = await diagram_repository.find_by_id(item_id.removeprefix(DIAGRAM_ID_PREFIX))

    if diagram is None:
        raise AppError("Diagram not found.", 404, "diagram_not_found")

    return {
        "title": diagram["title"],
        "subtitle": f"{diagram['topic']} • Class {diagram['class_level']}",
        "image": diagram["image"],
        "link": f"/diagrams?open={diagram['_id']}",
    }


async def list_bookmarks(user: dict) -> BookmarkCollection:
    documents = await bookmark_repository.list_for_user(user["_id"])

    return BookmarkCollection(
        items=[BookmarkPublic.from_document(document) for document in documents],
        folders=await _all_folders(user),
        limit=BOOKMARK_LIMIT,
    )


async def add_bookmark(user: dict, data: BookmarkCreate) -> BookmarkPublic:
    user_id = user["_id"]

    if await bookmark_repository.count_for_user(user_id) >= BOOKMARK_LIMIT:
        raise AppError(
            f"Bookmark limit reached ({BOOKMARK_LIMIT}). Remove one to save more.",
            409,
            "bookmark_limit",
        )

    details = {
        "title": data.title,
        "subtitle": data.subtitle,
        "image": data.image,
        "link": data.link,
    }

    # Diagram details come from the database, never from the client.
    if data.type == "diagram":
        details = await _diagram_details(data.item_id)

    document = {
        "user_id": user_id,
        "item_id": data.item_id,
        "type": data.type,
        "folder": await _checked_folder(user, data.folder),
        "saved_at": datetime.now(timezone.utc),
        **details,
    }

    try:
        saved = await bookmark_repository.insert(document)
    except DuplicateKeyError as error:
        raise AppError("Already bookmarked.", 409, "already_bookmarked") from error

    return BookmarkPublic.from_document(saved)


async def remove_bookmark(user: dict, item_id: str) -> None:
    if not await bookmark_repository.delete(user["_id"], item_id):
        raise AppError("Bookmark not found.", 404, "bookmark_not_found")


async def clear_bookmarks(user: dict) -> None:
    await bookmark_repository.delete_all(user["_id"])


async def move_bookmark(user: dict, item_id: str, folder: str) -> BookmarkPublic:
    checked_folder = await _checked_folder(user, folder)
    document = await bookmark_repository.update_folder(
        user["_id"], item_id, checked_folder
    )

    if document is None:
        raise AppError("Bookmark not found.", 404, "bookmark_not_found")

    return BookmarkPublic.from_document(document)


async def create_folder(user: dict, name: str) -> list[str]:
    folders = await _all_folders(user)
    existing_keys = {folder.casefold() for folder in folders}

    if name.casefold() in existing_keys:
        raise AppError("A folder with this name already exists.", 409, "folder_exists")

    if len(folders) - len(DEFAULT_FOLDERS) >= CUSTOM_FOLDER_LIMIT:
        raise AppError(
            f"You can create up to {CUSTOM_FOLDER_LIMIT} folders.", 409, "folder_limit"
        )

    try:
        await bookmark_repository.insert_folder(
            {
                "user_id": user["_id"],
                "name": name,
                "name_key": name.casefold(),
                "created_at": datetime.now(timezone.utc),
            }
        )
    except DuplicateKeyError as error:
        raise AppError(
            "A folder with this name already exists.", 409, "folder_exists"
        ) from error

    return [*folders, name]