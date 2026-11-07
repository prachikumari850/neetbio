import pytest

from app.services.diagram_generation_service import InvalidSpec, normalize_spec


def raw_spec(**changes):
    spec = {
        "is_biology": True,
        "kind": "structure",
        "title": "Plant Cell",
        "parts": [
            {"name": "Nucleus", "description": "Holds the DNA."},
            {"name": "Cell wall", "description": "Gives shape."},
            {"name": "Vacuole", "description": "Stores water."},
        ],
    }
    return {**spec, **changes}


def test_names_are_cleaned_and_duplicates_dropped():
    spec = normalize_spec(
        raw_spec(
            parts=[
                {"name": "  Nucleus ", "description": "a"},
                {"name": "nucleus", "description": "duplicate"},
                {"name": "Cell   wall", "description": "b"},
                {"name": "Vacuole", "description": "c"},
            ]
        )
    )

    assert [part["name"] for part in spec["parts"]] == ["Nucleus", "Cell wall", "Vacuole"]


def test_long_text_is_shortened_with_an_ellipsis():
    spec = normalize_spec(
        raw_spec(
            parts=[
                {"name": "x" * 60, "description": "y" * 300},
                {"name": "B", "description": "b"},
                {"name": "C", "description": "c"},
            ]
        )
    )

    assert len(spec["parts"][0]["name"]) == 40
    assert spec["parts"][0]["name"].endswith("…")
    assert len(spec["parts"][0]["description"]) == 160


def test_extra_parts_are_dropped():
    parts = [{"name": f"Part {index}", "description": "d"} for index in range(12)]

    assert len(normalize_spec(raw_spec(parts=parts))["parts"]) == 8


def test_too_few_parts_are_rejected():
    with pytest.raises(InvalidSpec):
        normalize_spec(raw_spec(parts=[{"name": "Only one", "description": "d"}]))


def test_unknown_kind_is_rejected():
    with pytest.raises(InvalidSpec):
        normalize_spec(raw_spec(kind="painting"))


def test_missing_fields_are_rejected():
    with pytest.raises(InvalidSpec):
        normalize_spec({})