from app.api.v1.endpoints import health


def test_health_is_ok_when_database_is_up(client, monkeypatch):
    async def database_up() -> bool:
        return True

    monkeypatch.setattr(health, "ping_database", database_up)

    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["database"] == "up"


def test_health_is_degraded_when_database_is_down(client, monkeypatch):
    async def database_down() -> bool:
        return False

    monkeypatch.setattr(health, "ping_database", database_down)

    response = client.get("/api/v1/health")

    assert response.status_code == 503
    assert response.json()["status"] == "degraded"
    assert response.json()["database"] == "down"


def test_unknown_route_uses_the_standard_error_shape(client):
    response = client.get("/api/v1/does-not-exist")

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "http_404"