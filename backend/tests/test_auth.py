SIGNUP = {
    "full_name": "Ashu Kumar",
    "email": "Ashu@Example.com",
    "mobile": "9876543210",
    "password": "neetbio123",
}


def signup(client, **overrides):
    return client.post("/api/v1/auth/signup", json={**SIGNUP, **overrides})


def auth_header(token):
    return {"Authorization": f"Bearer {token}"}


def test_signup_returns_token_and_public_user(db_client):
    response = signup(db_client)

    assert response.status_code == 201
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["user"]["email"] == "ashu@example.com"
    assert body["user"]["username"] == "ashu"
    assert "password_hash" not in body["user"]


def test_signup_rejects_duplicate_email(db_client):
    signup(db_client)
    response = signup(db_client, full_name="Someone Else")

    assert response.status_code == 409
    assert response.json()["error"]["code"] == "email_taken"


def test_signup_rejects_weak_password(db_client):
    response = signup(db_client, password="abcdefgh")

    assert response.status_code == 422


def test_login_works_with_email_and_username(db_client):
    signup(db_client)

    by_email = db_client.post(
        "/api/v1/auth/login",
        json={"identifier": "ashu@example.com", "password": "neetbio123"},
    )
    by_username = db_client.post(
        "/api/v1/auth/login",
        json={"identifier": "ASHU", "password": "neetbio123"},
    )

    assert by_email.status_code == 200
    assert by_username.status_code == 200


def test_login_rejects_wrong_password_and_unknown_user(db_client):
    signup(db_client)

    wrong_password = db_client.post(
        "/api/v1/auth/login",
        json={"identifier": "ashu@example.com", "password": "wrong-pass1"},
    )
    unknown_user = db_client.post(
        "/api/v1/auth/login",
        json={"identifier": "nobody@example.com", "password": "neetbio123"},
    )

    assert wrong_password.status_code == 401
    assert unknown_user.status_code == 401
    assert wrong_password.json() == unknown_user.json()


def test_current_user_requires_a_valid_token(db_client):
    assert db_client.get("/api/v1/users/me").status_code == 401
    assert (
        db_client.get("/api/v1/users/me", headers=auth_header("bad-token")).status_code
        == 401
    )


def test_current_user_returns_the_logged_in_user(db_client):
    token = signup(db_client).json()["access_token"]

    response = db_client.get("/api/v1/users/me", headers=auth_header(token))

    assert response.status_code == 200
    assert response.json()["name"] == "Ashu Kumar"


def test_logout_revokes_the_token(db_client):
    token = signup(db_client).json()["access_token"]

    logout = db_client.post("/api/v1/auth/logout", headers=auth_header(token))
    after_logout = db_client.get("/api/v1/users/me", headers=auth_header(token))

    assert logout.status_code == 204
    assert after_logout.status_code == 401


def test_profile_can_be_updated(db_client):
    token = signup(db_client).json()["access_token"]

    response = db_client.patch(
        "/api/v1/users/me",
        json={"name": "Ashu K", "mobile": "9123456780"},
        headers=auth_header(token),
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Ashu K"
    assert response.json()["mobile"] == "9123456780"


def test_profile_update_rejects_an_email_used_by_someone_else(db_client):
    signup(db_client)
    token = signup(db_client, email="other@example.com").json()["access_token"]

    response = db_client.patch(
        "/api/v1/users/me",
        json={"email": "ashu@example.com"},
        headers=auth_header(token),
    )

    assert response.status_code == 409