import math

CANVAS_WIDTH = 800
PADDING = 40
ARROW_GAP = 4

STRUCTURE_LABEL_SIZE = (190, 44)
STRUCTURE_LABEL_MARGIN = 20
STRUCTURE_ROW_GAP = 70
STRUCTURE_MIN_HEIGHT = 300
BODY_RADIUS_X = 110

PROCESS_NODE_SIZE = (360, 52)
PROCESS_GAP = 40

CYCLE_NODE_SIZE = (160, 48)
CYCLE_RADIUS_X = 260
CYCLE_RADIUS_Y = 190


def _round(value: float) -> float:
    return round(value, 1)


def _node(index: int, part: dict, x: float, y: float, size: tuple[int, int]) -> dict:
    width, height = size
    return {
        "id": index,
        "label": part["name"],
        "description": part["description"],
        "x": _round(x),
        "y": _round(y),
        "w": width,
        "h": height,
    }


def _clip_to_box(node: dict, target_x: float, target_y: float) -> tuple[float, float]:
    dx = target_x - node["x"]
    dy = target_y - node["y"]

    if dx == 0 and dy == 0:
        return node["x"], node["y"]

    scale = min(
        (node["w"] / 2) / abs(dx) if dx else math.inf,
        (node["h"] / 2) / abs(dy) if dy else math.inf,
    )
    return node["x"] + dx * scale, node["y"] + dy * scale


def _edge_between(first: dict, second: dict) -> dict:
    start_x, start_y = _clip_to_box(first, second["x"], second["y"])
    end_x, end_y = _clip_to_box(second, first["x"], first["y"])
    length = math.hypot(end_x - start_x, end_y - start_y)

    if length > 2 * ARROW_GAP:
        unit_x = (end_x - start_x) / length
        unit_y = (end_y - start_y) / length
        start_x += unit_x * ARROW_GAP
        start_y += unit_y * ARROW_GAP
        end_x -= unit_x * ARROW_GAP
        end_y -= unit_y * ARROW_GAP

    return {
        "x1": _round(start_x),
        "y1": _round(start_y),
        "x2": _round(end_x),
        "y2": _round(end_y),
        "arrow": True,
    }


def _leader_line(node: dict, body: dict, is_left: bool) -> dict:
    start_x = node["x"] + node["w"] / 2 if is_left else node["x"] - node["w"] / 2
    target_y = body["cy"] + (node["y"] - body["cy"]) * 0.55
    offset = (target_y - body["cy"]) / body["ry"]
    reach = body["rx"] * math.sqrt(max(0.0, 1 - offset * offset)) * 0.7
    target_x = body["cx"] - reach if is_left else body["cx"] + reach

    return {
        "x1": _round(start_x),
        "y1": node["y"],
        "x2": _round(target_x),
        "y2": _round(target_y),
        "arrow": False,
    }


def _structure_scene(parts: list[dict]) -> dict:
    label_width, _ = STRUCTURE_LABEL_SIZE
    left_count = (len(parts) + 1) // 2
    right_count = len(parts) // 2
    height = max(STRUCTURE_MIN_HEIGHT, 2 * PADDING + left_count * STRUCTURE_ROW_GAP)
    center_y = height / 2
    body = {
        "cx": CANVAS_WIDTH / 2,
        "cy": center_y,
        "rx": BODY_RADIUS_X,
        "ry": height / 2 - 30,
    }

    nodes = []
    edges = []

    for index, part in enumerate(parts):
        is_left = index % 2 == 0
        row = index // 2
        count = left_count if is_left else right_count
        top = (height - count * STRUCTURE_ROW_GAP) / 2
        y = top + STRUCTURE_ROW_GAP * (row + 0.5)
        x = (
            STRUCTURE_LABEL_MARGIN + label_width / 2
            if is_left
            else CANVAS_WIDTH - STRUCTURE_LABEL_MARGIN - label_width / 2
        )

        node = _node(index, part, x, y, STRUCTURE_LABEL_SIZE)
        nodes.append(node)
        edges.append(_leader_line(node, body, is_left))

    return {"width": CANVAS_WIDTH, "height": _round(height), "body": body, "nodes": nodes, "edges": edges}


def _process_scene(parts: list[dict]) -> dict:
    _, node_height = PROCESS_NODE_SIZE
    height = 2 * PADDING + len(parts) * node_height + (len(parts) - 1) * PROCESS_GAP

    nodes = [
        _node(
            index,
            part,
            CANVAS_WIDTH / 2,
            PADDING + node_height / 2 + index * (node_height + PROCESS_GAP),
            PROCESS_NODE_SIZE,
        )
        for index, part in enumerate(parts)
    ]
    edges = [_edge_between(first, second) for first, second in zip(nodes, nodes[1:])]

    return {"width": CANVAS_WIDTH, "height": _round(height), "body": None, "nodes": nodes, "edges": edges}


def _cycle_scene(parts: list[dict]) -> dict:
    _, node_height = CYCLE_NODE_SIZE
    height = 2 * (CYCLE_RADIUS_Y + node_height / 2 + PADDING)
    center_x = CANVAS_WIDTH / 2
    center_y = height / 2

    nodes = []
    for index, part in enumerate(parts):
        angle = -math.pi / 2 + 2 * math.pi * index / len(parts)
        nodes.append(
            _node(
                index,
                part,
                center_x + CYCLE_RADIUS_X * math.cos(angle),
                center_y + CYCLE_RADIUS_Y * math.sin(angle),
                CYCLE_NODE_SIZE,
            )
        )

    edges = [
        _edge_between(node, nodes[(index + 1) % len(nodes)])
        for index, node in enumerate(nodes)
    ]

    return {"width": CANVAS_WIDTH, "height": _round(height), "body": None, "nodes": nodes, "edges": edges}


LAYOUTS = {
    "structure": _structure_scene,
    "process": _process_scene,
    "cycle": _cycle_scene,
}


def build_scene(kind: str, parts: list[dict]) -> dict:
    return LAYOUTS[kind](parts)