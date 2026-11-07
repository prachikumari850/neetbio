from pymongo import ReplaceOne
from pymongo.collation import Collation

from app.database.mongodb import get_database

NO_STRUCTURES = {"structures": 0}
FACET_FIELDS = {"chapter": 1, "topic": 1, "class_level": 1, "type": 1, "features": 1}
CASE_INSENSITIVE = Collation(locale="en")


def _diagrams():
    return get_database()["diagrams"]


async def create_indexes() -> None:
    await _diagrams().create_index([("class_level", 1), ("chapter", 1)])
    await _diagrams().create_index("order")


async def count(mongo_filter: dict) -> int:
    return await _diagrams().count_documents(mongo_filter)


async def search(
    mongo_filter: dict, sort: list[tuple[str, int]], skip: int, limit: int
) -> list[dict]:
    cursor = (
        _diagrams()
        .find(mongo_filter, NO_STRUCTURES)
        .collation(CASE_INSENSITIVE)
        .sort(sort)
        .skip(skip)
        .limit(limit)
    )
    return await cursor.to_list()


async def find_by_id(diagram_id: str) -> dict | None:
    return await _diagrams().find_one({"_id": diagram_id})


async def list_facet_source() -> list[dict]:
    cursor = _diagrams().find({}, FACET_FIELDS).sort("order")
    return await cursor.to_list()


async def upsert_many(diagrams: list[dict]) -> int:
    operations = [
        ReplaceOne({"_id": diagram["_id"]}, diagram, upsert=True)
        for diagram in diagrams
    ]
    await _diagrams().bulk_write(operations)
    return len(operations)