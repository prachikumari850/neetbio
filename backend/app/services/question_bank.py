import hashlib
import json
import re
from datetime import datetime, timezone
from itertools import combinations
from pathlib import Path

from pydantic import ValidationError

from app.schemas.question import QuestionRecord

NEAR_DUPLICATE_THRESHOLD = 0.85
DRAFT_REVIEW = {"status": "draft", "reviewed_by": None, "reviewed_at": None}


def _error_location(location: tuple) -> str:
    return ".".join(str(part) for part in location)


def merge_defaults(defaults: dict, item: dict) -> dict:
    merged = {**defaults, **item}

    if "source" in defaults or "source" in item:
        merged["source"] = {**defaults.get("source", {}), **item.get("source", {})}

    return merged


def load_question_file(path: Path) -> tuple[list[QuestionRecord], list[str]]:
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as error:
        return [], [f"Could not read {path}: {error}"]

    if isinstance(raw, dict):
        defaults, items = raw.get("defaults") or {}, raw.get("questions")
    else:
        defaults, items = {}, raw

    if not isinstance(items, list) or not isinstance(defaults, dict):
        return [], ["The file must hold a list of questions, or an object with 'questions'."]

    records: list[QuestionRecord] = []
    errors: list[str] = []

    for number, item in enumerate(items, start=1):
        label = item.get("id", f"#{number}") if isinstance(item, dict) else f"#{number}"

        if not isinstance(item, dict):
            errors.append(f"{label}: each question must be an object.")
            continue

        try:
            records.append(QuestionRecord.model_validate(merge_defaults(defaults, item)))
        except ValidationError as error:
            errors.extend(
                f"{label}: {_error_location(problem['loc'])}: {problem['msg']}"
                for problem in error.errors()
            )

    return records, errors


def normalize_text(text: str) -> str:
    return " ".join(re.sub(r"[^a-z0-9]+", " ", text.lower()).split())


def content_hash(record: QuestionRecord) -> str:
    payload = {
        "text": record.text,
        "options": record.options,
        "correct_index": record.correct_index,
        "explanation": record.explanation,
        "option_notes": record.option_notes,
    }
    encoded = json.dumps(payload, sort_keys=True, ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def find_duplicate_issues(
    records: list[QuestionRecord], existing: list[dict]
) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    seen_ids: set[str] = set()
    for record in records:
        if record.id in seen_ids:
            errors.append(f"{record.id}: the id appears more than once in the file.")
        seen_ids.add(record.id)

    texts = {record.id: normalize_text(record.text) for record in records}
    owners = {
        normalize_text(item["text"]): item["_id"]
        for item in existing
        if item["_id"] not in texts
    }

    for record in records:
        owner = owners.get(texts[record.id])
        if owner:
            errors.append(f"{record.id}: same question text as '{owner}' already in the bank.")

    for first, second in combinations(records, 2):
        first_words, second_words = set(texts[first.id].split()), set(texts[second.id].split())

        if texts[first.id] == texts[second.id]:
            errors.append(f"{second.id}: same question text as '{first.id}'.")
        elif first_words and second_words:
            overlap = len(first_words & second_words) / len(first_words | second_words)
            if overlap >= NEAR_DUPLICATE_THRESHOLD:
                warnings.append(
                    f"{second.id}: very similar to '{first.id}' ({overlap:.0%} word overlap)."
                )

    return errors, warnings


def build_document(record: QuestionRecord, existing: dict | None) -> dict:
    new_hash = content_hash(record)
    is_unchanged = existing is not None and existing.get("content_hash") == new_hash

    document = {
        **record.model_dump(),
        "_id": record.id,
        "content_hash": new_hash,
        "imported_at": datetime.now(timezone.utc),
        "review": existing["review"] if is_unchanged else dict(DRAFT_REVIEW),
        "ai_check": existing.get("ai_check") if is_unchanged else None,
    }
    del document["id"]
    return document