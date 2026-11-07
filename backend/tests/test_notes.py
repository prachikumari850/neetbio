from app.services import note_service

URL = "/api/v1/notes"
NOTE = {"title": "Plant cell", "content": "Cell wall, chloroplasts and a large central vacuole."}


def create(client, headers, **changes):
    return client.post(URL, json={**NOTE, **changes}, headers=headers)


def test_notes_require_login(db_client):
    assert db_client.get(URL).status_code == 401
    assert db_client.post(URL, json=NOTE).status_code == 401


def test_a_note_can_be_created_listed_updated_and_deleted(db_client, make_user):
    headers = make_user()

    created = create(db_client, headers)
    note_id = created.json()["id"]
    updated = db_client.put(
        f"{URL}/{note_id}", json={"title": "Plant cell notes", "content": "Updated."}, headers=headers
    )
    listed = db_client.get(URL, headers=headers).json()["items"]
    deleted = db_client.delete(f"{URL}/{note_id}", headers=headers)

    assert created.status_code == 201
    assert updated.json()["title"] == "Plant cell notes"
    assert [item["content"] for item in listed] == ["Updated."]
    assert deleted.status_code == 204
    assert db_client.get(URL, headers=headers).json()["items"] == []


def test_the_most_recently_changed_note_comes_first(db_client, make_user):
    headers = make_user()
    first = create(db_client, headers, title="First").json()["id"]
    create(db_client, headers, title="Second")

    db_client.put(f"{URL}/{first}", json={"title": "First", "content": "edited"}, headers=headers)

    titles = [item["title"] for item in db_client.get(URL, headers=headers).json()["items"]]
    assert titles == ["First", "Second"]


def test_students_cannot_read_change_or_delete_each_others_notes(db_client, make_user):
    owner = make_user()
    other = make_user()
    note_id = create(db_client, owner).json()["id"]

    assert db_client.get(URL, headers=other).json()["items"] == []
    assert db_client.put(f"{URL}/{note_id}", json=NOTE, headers=other).status_code == 404
    assert db_client.delete(f"{URL}/{note_id}", headers=other).status_code == 404
    assert len(db_client.get(URL, headers=owner).json()["items"]) == 1


def test_bad_ids_and_missing_notes_return_404(db_client, make_user):
    headers = make_user()

    bad = db_client.delete(f"{URL}/not-an-id", headers=headers)

    assert bad.status_code == 404
    assert bad.json()["error"]["code"] == "note_not_found"


def test_blank_and_oversized_notes_are_rejected(db_client, make_user):
    headers = make_user()

    assert create(db_client, headers, title="   ").status_code == 422
    assert create(db_client, headers, content="   ").status_code == 422
    assert create(db_client, headers, title="a" * 101).status_code == 422
    assert create(db_client, headers, content="a" * 5001).status_code == 422


def test_the_note_limit_is_enforced(db_client, make_user, monkeypatch):
    monkeypatch.setattr(note_service, "NOTE_LIMIT", 1)
    headers = make_user()
    create(db_client, headers)

    response = create(db_client, headers, title="Another")

    assert response.status_code == 409
    assert response.json()["error"]["code"] == "note_limit"