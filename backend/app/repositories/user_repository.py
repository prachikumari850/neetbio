from bson import ObjectId
from bson.errors import InvalidId
from pymongo import ReturnDocument

from app.database.mongodb import get_database


def _users():
    return get_database()["users"]


async def create_indexes() -> None:
    await _users().create_index("email", unique=True)
    await _users().create_index("username", unique=True)


async def find_by_email(email: str) -> dict | None:
    return await _users().find_one({"email": email})


async def find_by_username(username: str) -> dict | None:
    return await _users().find_one({"username": username})


async def find_by_id(user_id: str) -> dict | None:
    try:
        object_id = ObjectId(user_id)
    except (InvalidId, TypeError):
        return None

    return await _users().find_one({"_id": object_id})


async def insert_user(document: dict) -> dict:
    result = await _users().insert_one(document)
    return {**document, "_id": result.inserted_id}


async def update_user(user_id: ObjectId, changes: dict) -> dict | None:
    return await _users().find_one_and_update(
        {"_id": user_id},
        {"$set": changes},
        return_document=ReturnDocument.AFTER,
    )


async def increment_token_version(user_id: ObjectId) -> None:
    await _users().update_one({"_id": user_id}, {"$inc": {"token_version": 1}})