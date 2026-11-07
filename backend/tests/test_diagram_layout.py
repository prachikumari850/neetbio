import pytest

from app.services.diagram_layout import CANVAS_WIDTH, build_scene


def make_parts(count: int) -> list[dict]:
    return [{"name": f"Part {index}", "description": "..."} for index in range(count)]


@pytest.mark.parametrize("kind", ["structure", "process", "cycle"])
@pytest.mark.parametrize("count", [3, 4, 5, 6, 7, 8])
def test_every_box_fits_inside_the_canvas(kind, count):
    scene = build_scene(kind, make_parts(count))

    assert len(scene["nodes"]) == count
    for node in scene["nodes"]:
        assert node["x"] - node["w"] / 2 >= 0
        assert node["x"] + node["w"] / 2 <= CANVAS_WIDTH
        assert node["y"] - node["h"] / 2 >= 0
        assert node["y"] + node["h"] / 2 <= scene["height"]


def test_structure_has_a_body_and_one_leader_line_per_part():
    scene = build_scene("structure", make_parts(5))

    assert scene["body"] is not None
    assert len(scene["edges"]) == 5
    assert not any(edge["arrow"] for edge in scene["edges"])


def test_process_has_arrows_between_consecutive_steps():
    scene = build_scene("process", make_parts(5))

    assert scene["body"] is None
    assert len(scene["edges"]) == 4
    assert all(edge["arrow"] for edge in scene["edges"])


def test_cycle_closes_the_loop():
    scene = build_scene("cycle", make_parts(5))

    assert len(scene["edges"]) == 5
    assert all(edge["arrow"] for edge in scene["edges"])