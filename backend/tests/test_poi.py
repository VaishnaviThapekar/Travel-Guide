import os
import sys

# Ensure backend package is importable when running tests from workspace root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_places_search():
    response = client.get('/places/search?q=Lisbon')
    assert response.status_code == 200
    data = response.json()
    assert data.get('query').lower() == 'lisbon'
    assert isinstance(data.get('results'), list)
    assert len(data['results']) >= 1
