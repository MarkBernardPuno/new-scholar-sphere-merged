import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    # If serving React, response is HTML; if API, response is JSON
    assert response.headers["content-type"].startswith("text/html") or response.headers["content-type"].startswith("application/json")
