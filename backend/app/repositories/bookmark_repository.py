from bson import ObjectId
from pymongo import ReturnDocument

from app.database.mongodb import get_database


def _bookmarks():
    return get_database()["bookmarks"]


def _folders():
    return get_database()["bookmark_folders"]


async def create_indexes() -> None:
    await _bookmarks().create_index(
        [("user_id", 1), ("item_id", 1)], unique=True
    )
    await _bookmarks().create_index([("user_id", 1), ("saved_at", -1)])
    await _folders().create_index(
        [("user_id", 1), ("name_key", 1)], unique=True
    )


async def list_for_user(user_id: ObjectId) -> list[dict]:
    cursor = _bookmarks().find({"user_id": user_id}).sort("saved_at", -1)
    return await cursor.to_list()


async def count_for_user(user_id: ObjectId) -> int:
    return await _bookmarks().count_documents({"user_id": user_id})


async def insert(document: dict) -> dict:
    result = await _bookmarks().insert_one(document)
    return {**document, "_id": result.inserted_id}


async def delete(user_id: ObjectId, item_id: str) -> bool:
    result = await _bookmarks().delete_one({"user_id": user_id, "item_id": item_id})
    return result.deleted_count == 1


async def delete_all(user_id: ObjectId) -> None:
    await _bookmarks().delete_many({"user_id": user_id})


async def update_folder(
    user_id: ObjectId, item_id: str, folder: str
) -> dict | None:
    return await _bookmarks().find_one_and_update(
        {"user_id": user_id, "item_id": item_id},
        {"$set": {"folder": folder}},
        return_document=ReturnDocument.AFTER,
    )


async def list_custom_folders(user_id: ObjectId) -> list[str]:
    cursor = _folders().find({"user_id": user_id}).sort("created_at", 1)
    return [document["name"] for document in await cursor.to_list()]


async def insert_folder(document: dict) -> None:
    await _folders().insert_one(document)