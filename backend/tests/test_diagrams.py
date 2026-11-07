URL = "/api/v1/diagrams"


def test_diagrams_require_login(seeded_client):
    assert seeded_client.get(URL).status_code == 401


def test_list_returns_the_first_page_without_structures(seeded_client, make_user):
    body = seeded_client.get(URL, headers=make_user()).json()

    assert body["total"] == 12
    assert body["total_pages"] == 2
    assert len(body["items"]) == 8
    assert body["items"][0]["id"] == "plant-cell"
    assert "structures" not in body["items"][0]


def test_pagination_returns_the_remaining_items(seeded_client, make_user):
    body = seeded_client.get(
        URL, params={"page": 3, "page_size": 5}, headers=make_user()
    ).json()

    assert body["total_pages"] == 3
    assert len(body["items"]) == 2


def test_class_filter(seeded_client, make_user):
    body = seeded_client.get(
        URL, params={"class_level": "12"}, headers=make_user()
    ).json()

    assert body["total"] == 3


def test_search_matches_title_topic_and_chapter(seeded_client, make_user):
    headers = make_user()

    by_title = seeded_client.get(URL, params={"q": "dna"}, headers=headers).json()
    by_topic = seeded_client.get(URL, params={"q": "mitosis"}, headers=headers).json()

    assert [item["id"] for item in by_title["items"]] == ["dna-structure"]
    assert by_topic["total"] == 2


def test_search_treats_special_characters_literally(seeded_client, make_user):
    body = seeded_client.get(URL, params={"q": ".*"}, headers=make_user()).json()

    assert body["total"] == 0


def test_type_filter_accepts_several_values(seeded_client, make_user):
    body = seeded_client.get(
        URL, params={"type": ["process", "lifecycle"]}, headers=make_user()
    ).json()

    assert body["total"] == 4


def test_feature_filter_requires_every_selected_feature(seeded_client, make_user):
    body = seeded_client.get(
        URL,
        params={"feature": ["interactive", "explanation"], "page_size": 50},
        headers=make_user(),
    ).json()

    assert body["total"] == 6


def test_ids_filter(seeded_client, make_user):
    body = seeded_client.get(
        URL, params={"ids": ["flower", "plant-cell"]}, headers=make_user()
    ).json()

    assert body["total"] == 2


def test_sorting_by_title(seeded_client, make_user):
    headers = make_user()

    ascending = seeded_client.get(
        URL, params={"sort": "az", "page_size": 50}, headers=headers
    ).json()["items"]
    descending = seeded_client.get(
        URL, params={"sort": "za", "page_size": 50}, headers=headers
    ).json()["items"]

    assert ascending[0]["id"] == "alveolus"
    assert ascending[-1]["id"] == "nephron"
    assert descending[0]["id"] == "nephron"


def test_invalid_filter_values_are_rejected(seeded_client, make_user):
    headers = make_user()

    assert seeded_client.get(URL, params={"class_level": "13"}, headers=headers).status_code == 422
    assert seeded_client.get(URL, params={"page_size": 500}, headers=headers).status_code == 422


def test_detail_includes_structures(seeded_client, make_user):
    response = seeded_client.get(f"{URL}/plant-cell", headers=make_user())

    assert response.status_code == 200
    assert len(response.json()["structures"]) == 4


def test_unknown_diagram_returns_404(seeded_client, make_user):
    response = seeded_client.get(f"{URL}/nothing-here", headers=make_user())

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "diagram_not_found"


def test_facets_list_chapters_topics_and_counts(seeded_client, make_user):
    body = seeded_client.get(f"{URL}/facets", headers=make_user()).json()
    class_12_chapters = [c for c in body["chapters"] if c["class_level"] == "12"]

    assert len(class_12_chapters) == 3
    assert body["types"]["structural"] == 7
    assert {"name", "chapter", "class_level"} <= set(body["topics"][0])