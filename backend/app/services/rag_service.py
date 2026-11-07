import math

from app.core.config import get_settings
from app.repositories import diagram_repository, knowledge_repository
from app.services import ollama_client
from app.services.ollama_client import OllamaError

EMBED_BATCH_SIZE = 16


def build_chunks(diagram: dict) -> list[dict]:
    base = {"diagram_id": diagram["_id"], "title": diagram["title"]}
    structure_names = ", ".join(item["name"] for item in diagram["structures"])
    overview = (
        f"{diagram['title']} ({diagram['chapter']}, Class {diagram['class_level']}). "
        f"{diagram['summary']} Key structures: {structure_names}."
    )

    chunks = [{**base, "text": overview}]
    chunks.extend(
        {**base, "text": f"{diagram['title']} – {item['name']}: {item['description']}"}
        for item in diagram["structures"]
    )
    return chunks


def cosine_similarity(first: list[float], second: list[float]) -> float:
    first_norm = math.sqrt(math.fsum(value * value for value in first))
    second_norm = math.sqrt(math.fsum(value * value for value in second))

    if not first_norm or not second_norm:
        return 0.0

    if first == second:
        return 1.0

    dot = math.fsum(a * b for a, b in zip(first, second))
    return max(-1.0, min(1.0, dot / (first_norm * second_norm)))


def to_sources(chunks: list[dict]) -> list[dict]:
    sources: dict[str, dict] = {}

    for chunk in chunks:
        score = chunk.get("score")
        sources.setdefault(
            chunk["diagram_id"],
            {
                "diagram_id": chunk["diagram_id"],
                "title": chunk["title"],
                "score": None if score is None else round(score, 3),
            },
        )

    return list(sources.values())


async def chunks_for_diagram(diagram_id: str) -> list[dict] | None:
    diagram = await diagram_repository.find_by_id(diagram_id)

    if diagram is None:
        return None

    return [{**chunk, "score": None} for chunk in build_chunks(diagram)]


async def index_diagrams() -> int:
    settings = get_settings()
    diagrams = await diagram_repository.list_all()
    chunks = [chunk for diagram in diagrams for chunk in build_chunks(diagram)]

    if not chunks:
        return 0

    vectors: list[list[float]] = []
    for start in range(0, len(chunks), EMBED_BATCH_SIZE):
        batch = chunks[start : start + EMBED_BATCH_SIZE]
        texts = [settings.embed_document_prefix + chunk["text"] for chunk in batch]
        vectors.extend(await ollama_client.embed(texts))

    if len(vectors) != len(chunks):
        raise OllamaError("The embedding model returned an unexpected result.")

    await knowledge_repository.replace_all(
        [
            {**chunk, "embedding": vector, "model": settings.ollama_embed_model}
            for chunk, vector in zip(chunks, vectors)
        ]
    )
    return len(chunks)


async def retrieve(question: str) -> list[dict]:
    settings = get_settings()
    stored = await knowledge_repository.list_for_model(settings.ollama_embed_model)

    if not stored:
        return []

    [query_vector] = await ollama_client.embed(
        [settings.embed_query_prefix + question]
    )

    ranked = sorted(
        ((cosine_similarity(query_vector, chunk["embedding"]), chunk) for chunk in stored),
        key=lambda pair: pair[0],
        reverse=True,
    )

    return [
        {
            "diagram_id": chunk["diagram_id"],
            "title": chunk["title"],
            "text": chunk["text"],
            "score": score,
        }
        for score, chunk in ranked[: settings.rag_top_k]
        if score >= settings.rag_min_score
    ]
