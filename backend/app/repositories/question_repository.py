from datetime import datetime, timezone

from pymongo import ReplaceOne

from app.database.mongodb import get_database

REVIEWED = {"review.status": "reviewed"}
HIDDEN_FROM_STUDENTS = {
    "correct_index": 0,
    "explanation": 0,
    "option_notes": 0,
    "ai_check": 0,
    "review": 0,
    "source": 0,
    "content_hash": 0,
    "imported_at": 0,
}
ANALYTICS_FIELDS = {
    "subject": 1,
    "unit": 1,
    "chapter": 1,
    "topic": 1,
    "correct_index": 1,
    "review.status": 1,
}


def _questions():
    return get_database()["questions"]


async def create_indexes() -> None:
    await _questions().create_index(
        [("review.status", 1), ("subject", 1), ("unit", 1)]
    )
    await _questions().create_index([("review.status", 1), ("chapter", 1)])
    await _questions().create_index(
        [("review.status", 1), ("source.type", 1), ("source.year", 1)]
    )


async def upsert_many(documents: list[dict]) -> None:
    operations = [
        ReplaceOne({"_id": document["_id"]}, document, upsert=True)
        for document in documents
    ]
    await _questions().bulk_write(operations)


async def find_by_ids(ids: list[str], with_answers: bool = False) -> list[dict]:
    projection = None if with_answers else HIDDEN_FROM_STUDENTS
    return await _questions().find({"_id": {"$in": ids}}, projection).to_list()


async def list_for_analytics(ids: list[str]) -> list[dict]:
    mongo_filter = {"$or": [REVIEWED, {"_id": {"$in": ids}}]}
    return await _questions().find(mongo_filter, ANALYTICS_FIELDS).to_list()


async def list_texts() -> list[dict]:
    return await _questions().find({}, {"text": 1}).to_list()


async def list_by_status(status: str) -> list[dict]:
    return await _questions().find({"review.status": status}).sort("_id").to_list()


async def sample(mongo_filter: dict, size: int) -> list[dict]:
    pipeline = [
        {"$match": {**REVIEWED, **mongo_filter}},
        {"$sample": {"size": size}},
        {"$project": HIDDEN_FROM_STUDENTS},
    ]
    cursor = await _questions().aggregate(pipeline)
    return await cursor.to_list()


async def summarize() -> list[dict]:
    pipeline = [
        {"$match": REVIEWED},
        {
            "$group": {
                "_id": {
                    "subject": "$subject",
                    "unit": "$unit",
                    "chapter": "$chapter",
                    "source_type": "$source.type",
                    "year": "$source.year",
                },
                "count": {"$sum": 1},
            }
        },
    ]
    cursor = await _questions().aggregate(pipeline)
    return [{**group["_id"], "count": group["count"]} for group in await cursor.to_list()]


async def set_review(ids: list[str], status: str, reviewer: str | None) -> int:
    result = await _questions().update_many(
        {"_id": {"$in": ids}},
        {
            "$set": {
                "review.status": status,
                "review.reviewed_by": reviewer,
                "review.reviewed_at": datetime.now(timezone.utc),
            }
        },
    )
    return result.modified_count


async def set_ai_check(question_id: str, check: dict) -> None:
    await _questions().update_one({"_id": question_id}, {"$set": {"ai_check": check}})