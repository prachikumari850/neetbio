import asyncio

from app.core.config import get_settings
from app.database.mongodb import close_mongo_connection, connect_to_mongo
from app.database.seed import load_seed_diagrams
from app.services import rag_service


def test_cosine_similarity_handles_identical_orthogonal_and_zero_vectors():
    assert rag_service.cosine_similarity([1, 2], [1, 2]) == 1.0
    assert rag_service.cosine_similarity([1, 0], [0, 1]) == 0.0
    assert rag_service.cosine_similarity([0, 0], [1, 1]) == 0.0


def test_chunks_cover_the_overview_and_every_structure():
    plant_cell = next(
        diagram for diagram in load_seed_diagrams() if diagram["_id"] == "plant-cell"
    )

    chunks = rag_service.build_chunks(plant_cell)

    assert len(chunks) == 5
    assert "Key structures" in chunks[0]["text"]
    assert all(chunk["diagram_id"] == "plant-cell" for chunk in chunks)


def test_sources_are_unique_per_diagram_and_keep_the_best_score():
    chunks = [
        {"diagram_id": "a", "title": "A", "text": "x", "score": 0.91234},
        {"diagram_id": "a", "title": "A", "text": "y", "score": 0.5},
        {"diagram_id": "b", "title": "B", "text": "z", "score": None},
    ]

    assert rag_service.to_sources(chunks) == [
        {"diagram_id": "a", "title": "A", "score": 0.912},
        {"diagram_id": "b", "title": "B", "score": None},
    ]


def test_index_diagrams_embeds_every_chunk(test_database, fake_ollama):
    diagrams = load_seed_diagrams()
    test_database["diagrams"].insert_many(diagrams)
    expected = sum(len(rag_service.build_chunks(diagram)) for diagram in diagrams)

    async def run() -> int:
        await connect_to_mongo()
        try:
            return await rag_service.index_diagrams()
        finally:
            await close_mongo_connection()

    assert asyncio.run(run()) == expected

    stored = test_database["knowledge_chunks"].find_one()
    assert stored["model"] == get_settings().ollama_embed_model
    assert len(stored["embedding"]) == 3