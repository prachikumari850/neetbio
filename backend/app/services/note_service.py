from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId

from app.core.errors import AppError
from app.repositories import note_repository
from app.schemas.learning import NoteInput, NoteList, NotePublic

NOTE_LIMIT = 200


def _not_found() -> AppError:
    return AppError("Note not found.", 404, "note_not_found")


def _parse_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise _not_found() from None


def _to_public(document: dict) -> NotePublic:
    return NotePublic(
        id=str(document["_id"]),
        title=document["title"],
        content=document["content"],
        created_at=document["created_at"],
        updated_at=document["updated_at"],
    )


async def list_notes(user: dict) -> NoteList:
    documents = await note_repository.list_for_user(user["_id"], NOTE_LIMIT)
    return NoteList(items=[_to_public(document) for document in documents])


async def create_note(user: dict, data: NoteInput) -> NotePublic:
    if await note_repository.count_for_user(user["_id"]) >= NOTE_LIMIT:
        raise AppError(
            f"You can keep up to {NOTE_LIMIT} notes. Delete one to add another.",
            409,
            "note_limit",
        )

    now = datetime.now(timezone.utc)
    document = {
        "_id": ObjectId(),
        "user_id": user["_id"],
        "title": data.title,
        "content": data.content,
        "created_at": now,
        "updated_at": now,
    }
    await note_repository.insert(document)
    return _to_public(document)


async def update_note(user: dict, note_id: str, data: NoteInput) -> NotePublic:
    document = await note_repository.update(
        user["_id"],
        _parse_id(note_id),
        {
            "title": data.title,
            "content": data.content,
            "updated_at": datetime.now(timezone.utc),
        },
    )

    if document is None:
        raise _not_found()

    return _to_public(document)


async def delete_note(user: dict, note_id: str) -> None:
    if not await note_repository.delete(user["_id"], _parse_id(note_id)):
        raise _not_found()