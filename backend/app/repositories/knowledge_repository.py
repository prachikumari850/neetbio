from app.database.mongodb import get_database

CHUNK_FIELDS = {"text": 1, "diagram_id": 1, "title": 1, "embedding": 1}


def _chunks():
    return get_database()["knowledge_chunks"]


async def create_indexes() -> None:
    await _chunks().create_index("model")
    await _chunks().create_index("diagram_id")


async def replace_all(documents: list[dict]) -> None:
    await _chunks().delete_many({})
    await _chunks().insert_many(documents)


async def list_for_model(model: str) -> list[dict]:
    return await _chunks().find({"model": model}, CHUNK_FIELDS).to_list()


async def count() -> int:
    return await _chunks().count_documents({})