"""Контрактные тесты бэка: форма ответов из docs/api/backend.md."""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_config_shape():
    r = client.get("/api/config")
    assert r.status_code == 200
    body = r.json()
    assert body["screen_id"] == "AKTAU-EMB-01"
    assert set(body["origin"]) == {"lat", "lng", "heading_deg"}
    assert body["default_lang"] == "kk"


def test_places_filters_and_fallback_lang():
    r = client.get("/api/places", params={"lang": "zh", "limit": 50})
    assert r.status_code == 200
    body = r.json()
    assert body["lang"] == "zh"  # язык запроса возвращаем, тексты — фолбэк ru
    assert body["total"] >= 12
    assert all("name" in p and "has_scene" in p for p in body["places"])

    r = client.get("/api/places", params={"lang": "ru", "q": "набережная"})
    assert r.json()["total"] >= 1

    r = client.get("/api/places", params={"lang": "ru", "categories": "nature,religion"})
    assert all(p["category"] in ("nature", "religion") for p in r.json()["places"])


def test_place_detail_and_404():
    r = client.get("/api/places/1", params={"lang": "ru"})
    assert r.status_code == 200
    assert r.json()["is_open_now"] is True
    r = client.get("/api/places/9999")
    assert r.status_code == 404
    assert r.json()["error"]["code"] == "PLACE_NOT_FOUND"


def test_route_fallback_and_bearing():
    r = client.get("/api/places/1/route", params={"mode": "walk", "fallback": 1})
    assert r.status_code == 200
    body = r.json()
    assert 0 <= body["bearing_deg"] <= 360
    assert body["is_approximate"] is True
    assert body["geometry"]["type"] == "LineString"

    r = client.get("/api/places/101/route", params={"mode": "transit"})
    assert r.status_code == 200
    assert r.json()["mode"] == "transit"


def test_dialog_turn_route_qr_scene():
    s = "test-sess-1"
    r = client.post("/api/dialog/turn", json={"session_id": s, "lang": "ru", "text": "Как пройти к амфитеатру?", "context": {}})
    assert r.status_code == 200
    body = r.json()
    assert body["place_id"] == 1
    assert body["actions"][0]["show"] == "route"

    r = client.post("/api/dialog/turn", json={"session_id": s, "lang": "ru", "text": "Отправь на телефон", "context": {"last_place_id": 1}})
    assert r.json()["actions"][0]["show"] == "qr"

    r = client.post("/api/voice", json={"session_id": s, "lang": "ru", "text": "Как пройти к амфитеатру?", "context": {}})
    assert r.json()["need_route"] is True

    r = client.post("/api/dialog/turn", json={"session_id": "empty", "lang": "ru", "text": "", "context": {}})
    assert r.status_code == 422
    assert r.json()["error"]["code"] == "SPEECH_UNRECOGNIZED"


def test_scene_qr_event_session_health():
    r = client.get("/api/places/2/scene")
    assert r.status_code == 200
    assert "modern_url" in r.json()
    r = client.get("/api/places/3/scene")
    assert r.status_code == 404

    r = client.post("/api/qr", json={"place_id": 1, "lang": "ru", "session_id": "s1"})
    assert r.status_code == 200
    assert r.json()["payload_version"] == 1
    qr_url = r.json()["url"]
    token = qr_url.split("/")[-1]
    res_landing = client.get(f"/r/{token}")
    assert res_landing.status_code == 200
    assert "2GIS" in res_landing.text or "2gis" in res_landing.text

    bad_landing = client.get("/r/invalid_token_xyz")
    assert bad_landing.status_code == 404

    assert client.post("/api/event", json={"session_id": "s1", "type": "place_view", "lang": "ru"}).json() == {"ok": True}
    bad = client.post("/api/event", json={"session_id": "s1", "type": "nope", "lang": "ru"})
    assert bad.status_code == 400

    assert client.post("/api/session/end", json={"session_id": "s1"}).json() == {"ok": True}
    h = client.get("/api/health").json()
    assert h["status"] == "ok" and h["version"] == "0.1.0"

    assert "sessions" in client.get("/api/admin/metrics").json()
    assert "sessions" in client.get("/api/stats").json()
    assert isinstance(client.get("/api/admin/heatmap").json(), list)
    assert isinstance(client.get("/api/admin/places/stats").json(), list)

    fb = client.post("/api/feedback", json={"session_id": "s1", "place_id": 1, "rating": 5, "comment": "Great!"})
    assert fb.status_code == 200
    assert fb.json() == {"ok": True}

    tts_resp = client.post("/api/tts", json={"text": "Привет", "lang": "ru"})
    assert tts_resp.status_code == 503
    assert tts_resp.json()["error"]["code"] == "AI_UNAVAILABLE"

