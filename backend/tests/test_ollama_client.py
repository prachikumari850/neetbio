import json

from app.services.ollama_client import describe_failure, model_installed


def test_model_installed_matches_exact_names():
    assert model_installed("llama3.2:3b", ["llama3.2:3b", "qwen2.5:0.5b"])
    assert not model_installed("llama3.1:8b", ["llama3.2:3b"])


def test_model_installed_accepts_the_implicit_latest_tag():
    assert model_installed("nomic-embed-text", ["nomic-embed-text:latest"])


def test_missing_model_message_tells_you_how_to_install_it():
    message = describe_failure(404, b"{}", "llama3.2:3b")

    assert "ollama pull llama3.2:3b" in message


def test_other_failures_use_the_ollama_error_text():
    body = json.dumps({"error": "out of memory"}).encode()

    assert describe_failure(500, body, "llama3.2:3b") == "out of memory"
    assert "HTTP 500" in describe_failure(500, b"not json", "llama3.2:3b")