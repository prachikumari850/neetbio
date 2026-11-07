from app.services import bookmark_service

URL = "/api/v1/bookmarks"

NOTE = {
    "item_id": "note-1",
    "type": "note",
    "title": "My note",
    "subtitle": "Cell Biology",
    "folder": "Revision",
    "link": "/my-learning?tab=notes",
}
DIAGRAM = {
    "item_id": "diagram-plant-cell",
    "type": "diagram",
    "title": "Title the client made up",
    "link": "/somewhere-else",
}


def test_bookmarks_require_login(db_client):
    assert db_client.get(URL).status_code == 401


def test_new_user_starts_empty_with_default_folders(db_client, make_user):
    body = db_client.get(URL, headers=make_user()).json()

    assert body["items"] == []
    assert "Revision" in body["folders"]
    assert body["limit"] == 100


def test_add_and_list_a_bookmark(db_client, make_user):
    headers = make_user()

    created = db_client.post(URL, json=NOTE, headers=headers)
    listed = db_client.get(URL, headers=headers).json()

    assert created.status_code == 201
    assert [item["id"] for item in listed["items"]] == ["note-1"]


def test_diagram_details_come_from_the_database(seeded_client, make_user):
    response = seeded_client.post(URL, json=DIAGRAM, headers=make_user())

    assert response.status_code == 201
    body = response.json()
    assert body["title"] == "Plant Cell"
    assert body["link"] == "/diagrams?open=plant-cell"
    assert body["subtitle"] == "Structural Organization in Plants • Class 11"


def test_bookmarking_an_unknown_diagram_fails(seeded_client, make_user):
    response = seeded_client.post(
        URL,
        json={**DIAGRAM, "item_id": "diagram-does-not-exist"},
        headers=make_user(),
    )

    assert response.status_code == 404


def test_duplicate_bookmark_is_rejected(db_client, make_user):
    headers = make_user()
    db_client.post(URL, json=NOTE, headers=headers)

    response = db_client.post(URL, json=NOTE, headers=headers)

    assert response.status_code == 409
    assert response.json()["error"]["code"] == "already_bookmarked"


def test_links_must_stay_inside_the_app(db_client, make_user):
    headers = make_user()

    external = db_client.post(URL, json={**NOTE, "link": "//evil.example"}, headers=headers)
    absolute = db_client.post(URL, json={**NOTE, "link": "https://evil.example"}, headers=headers)

    assert external.status_code == 422
    assert absolute.status_code == 422


def test_item_id_must_match_its_type(db_client, make_user):
    response = db_client.post(
        URL, json={**NOTE, "item_id": "question-1"}, headers=make_user()
    )

    assert response.status_code == 422


def test_unknown_folder_is_rejected(db_client, make_user):
    response = db_client.post(
        URL, json={**NOTE, "folder": "Nope"}, headers=make_user()
    )

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "unknown_folder"


def test_bookmark_can_be_moved_and_removed(db_client, make_user):
    headers = make_user()
    db_client.post(URL, json=NOTE, headers=headers)

    moved = db_client.patch(f"{URL}/note-1", json={"folder": "Weak Areas"}, headers=headers)
    removed = db_client.delete(f"{URL}/note-1", headers=headers)
    removed_again = db_client.delete(f"{URL}/note-1", headers=headers)

    assert moved.json()["folder"] == "Weak Areas"
    assert removed.status_code == 204
    assert removed_again.status_code == 404


def test_users_cannot_see_or_change_each_others_bookmarks(db_client, make_user):
    owner = make_user()
    other = make_user()
    db_client.post(URL, json=NOTE, headers=owner)

    other_list = db_client.get(URL, headers=other).json()
    other_delete = db_client.delete(f"{URL}/note-1", headers=other)
    other_move = db_client.patch(f"{URL}/note-1", json={"folder": "Others"}, headers=other)
    owner_list = db_client.get(URL, headers=owner).json()

    assert other_list["items"] == []
    assert other_delete.status_code == 404
    assert other_move.status_code == 404
    assert len(owner_list["items"]) == 1


def test_the_same_item_can_be_saved_by_two_users(db_client, make_user):
    first = db_client.post(URL, json=NOTE, headers=make_user())
    second = db_client.post(URL, json=NOTE, headers=make_user())

    assert first.status_code == 201
    assert second.status_code == 201


def test_bookmark_limit_is_enforced(db_client, make_user, monkeypatch):
    monkeypatch.setattr(bookmark_service, "BOOKMARK_LIMIT", 1)
    headers = make_user()
    db_client.post(URL, json=NOTE, headers=headers)

    response = db_client.post(
        URL, json={**NOTE, "item_id": "note-2"}, headers=headers
    )

    assert response.status_code == 409
    assert response.json()["error"]["code"] == "bookmark_limit"


def test_clear_removes_only_the_current_users_bookmarks(db_client, make_user):
    owner = make_user()
    other = make_user()
    db_client.post(URL, json=NOTE, headers=owner)
    db_client.post(URL, json=NOTE, headers=other)

    cleared = db_client.delete(URL, headers=owner)

    assert cleared.status_code == 204
    assert db_client.get(URL, headers=owner).json()["items"] == []
    assert len(db_client.get(URL, headers=other).json()["items"]) == 1


def test_custom_folders_are_private_and_unique(db_client, make_user):
    owner = make_user()
    other = make_user()

    created = db_client.post(f"{URL}/folders", json={"name": "Genetics"}, headers=owner)
    duplicate = db_client.post(f"{URL}/folders", json={"name": "genetics"}, headers=owner)
    clashes_with_default = db_client.post(
        f"{URL}/folders", json={"name": "revision"}, headers=owner
    )

    assert created.status_code == 201
    assert "Genetics" in created.json()["folders"]
    assert duplicate.status_code == 409
    assert clashes_with_default.status_code == 409
    assert "Genetics" not in db_client.get(URL, headers=other).json()["folders"]