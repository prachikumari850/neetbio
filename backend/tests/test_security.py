from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_password_hash_verifies_only_the_right_password():
    password_hash = hash_password("neetbio123")

    assert password_hash != "neetbio123"
    assert verify_password("neetbio123", password_hash)
    assert not verify_password("wrong-password", password_hash)


def test_token_round_trip_keeps_user_and_version():
    token = create_access_token("user-1", 3)
    payload = decode_access_token(token)

    assert payload["sub"] == "user-1"
    assert payload["ver"] == 3


def test_tampered_token_is_rejected():
    token = create_access_token("user-1", 0)

    assert decode_access_token(token + "x") is None
    assert decode_access_token("not-a-token") is None