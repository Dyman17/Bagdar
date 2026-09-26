"""BaGdar Backend — FastAPI, контракт: docs/api/backend.md (заморожен)."""
from __future__ import annotations

import json
import os
import urllib.parse
import urllib.request

from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from pydantic import BaseModel, Field

from app.catalog import get_place, load_places, local_text, opening_state
from app.dialog import decide, detect_lang, match_places, say
from app.geo import ORIGIN_LAT, ORIGIN_LNG, bearing_deg, direction_text, haversine_m
from app import store

VERSION = "0.1.0"
SCREEN_ID = os.getenv("SCREEN_ID", "AKTAU-EMB-01")
ORIGIN_HEADING = float(os.getenv("ORIGIN_HEADING_DEG", "45"))
DISTRICT = "aktau-15-mkr"
CATEGORIES = ["park", "mall", "market", "history", "nature", "religion", "culture", "food", "hotel", "tour"]

BASE_DIR = Path(__file__).resolve().parents[1]

app = FastAPI(title="BaGdar API", version=VERSION)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
if (BASE_DIR / "static").exists():
    app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")


def err(status: int, code: str, message: str, lang: str = "ru", details: dict | None = None):
    return JSONResponse(
        status_code=status,
        content={"error": {"code": code, "message": message, "lang": lang, "details": details or {}}},
    )


def ai_enabled() -> bool:
    return bool(os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY"))


def places_all():
    return load_places()


# ---------- Schemas ----------
class QrIn(BaseModel):
    place_id: int
    lang: str = "ru"
    session_id: str


class DialogIn(BaseModel):
    session_id: str
    lang: str = "auto"
    audio_b64: str | None = None
    mime: str | None = None
    text: str | None = None
    signs: list | None = None
    context: dict = Field(default_factory=dict)


class EventIn(BaseModel):
    session_id: str
    type: str
    place_id: int | None = None
    lang: str = "ru"


class SessionEndIn(BaseModel):
    session_id: str


class FeedbackIn(BaseModel):
    session_id: str
    place_id: int | None = None
    rating: int | None = None
    value: int | None = None
    comment: str | None = None


class TtsIn(BaseModel):
    text: str
    lang: str = "ru"


EVENT_TYPES = {"place_view", "route_click", "scene_open", "qr_scan", "voice_query", "session_start"}


# ---------- 01. Витрина ----------
@app.get("/api/config")
def get_config():
    return {
        "screen_id": SCREEN_ID,
        "origin": {"lat": ORIGIN_LAT, "lng": ORIGIN_LNG, "heading_deg": ORIGIN_HEADING},
        "languages": ["kk", "ru", "en"],
        "default_lang": "kk",
        "modes": {"voice": True, "tarihsky": True, "qr": True, "huskylens": False},
        "session": {"idle_timeout_sec": 90, "qr_timeout_sec": 60},
        "district": DISTRICT,
        "categories": CATEGORIES,
    }


@app.get("/api/places")
def list_places(
    lang: str = Query(default="ru"),
    limit: int = Query(default=50, ge=1, le=100),
    q: str | None = Query(default=None),
    categories: str | None = Query(default=None),
    bbox: str | None = Query(default=None),
):
    places = places_all()
    if categories:
        wanted = {c.strip() for c in categories.split(",") if c.strip()}
        places = [p for p in places if p.category in wanted]
    if bbox:
        try:
            min_lng, min_lat, max_lng, max_lat = (float(v) for v in bbox.split(","))
            places = [p for p in places if min_lat <= p.lat <= max_lat and min_lng <= p.lng <= max_lng]
        except ValueError:
            return err(400, "BAD_REQUEST", "Некорректный bbox", lang, {})
    if q:
        places = match_places(q, places)
    total = len(places)
    out = []
    for p in places[:limit]:
        t = local_text(p, lang)
        out.append({
            "id": p.id, "name": t.name, "summary": t.summary,
            "category": p.category, "lat": p.lat, "lng": p.lng,
            "thumb_url": p.thumb_url, "has_scene": p.scene is not None,
            "hours": p.hours.model_dump() if p.hours else None,
            "access": p.access,
        })
    return {"places": out, "total": total, "lang": lang}


# ---------- 02. Место + маршрут ----------
@app.get("/api/places/{place_id}")
def place_detail(place_id: int, lang: str = Query(default="ru")):
    p = get_place(places_all(), place_id)
    if p is None:
        return err(404, "PLACE_NOT_FOUND", "Место не найдено", lang, {"place_id": place_id})
    t = local_text(p, lang)
    is_open, opens_next = opening_state(p.hours)
    return {
        "id": p.id, "name": t.name, "summary": t.summary, "description": t.description,
        "category": p.category, "lat": p.lat, "lng": p.lng, "address": t.address,
        "photos": p.photos, "hours": p.hours.model_dump() if p.hours else None,
        "is_open_now": is_open, "opens_next": opens_next,
        "has_scene": p.scene is not None, "access": p.access,
        "langs": sorted(p.texts.keys()),
    }


def osrm_route(mode: str, lat2: float, lng2: float) -> dict | None:
    profile = "foot"  # OSRM public: foot/driving
    url = (
        f"https://router.project-osrm.org/route/v1/{profile}/"
        f"{ORIGIN_LNG},{ORIGIN_LAT};{lng2},{lat2}"
        f"?overview=full&geometries=geojson&steps=true"
    )
    try:
        with urllib.request.urlopen(url, timeout=4) as resp:
            data = json.loads(resp.read().decode())
        routes = data.get("routes") or []
        if not routes:
            return None
        r = routes[0]
        coords = r["geometry"]["coordinates"]
        steps = []
        for leg in r.get("legs", []):
            for s in leg.get("steps", []):
                name = (s.get("name") or "").strip()
                instr = f"{s['maneuver']['type']} {name}".strip() or "Прямо"
                steps.append({"instruction": instr, "distance_m": round(s.get("distance", 0))})
        return {
            "distance_m": round(r["distance"]),
            "duration_min": max(1, round(r["duration"] / 60)),
            "coordinates": coords,
            "steps": steps or [{"instruction": "Прямо по маршруту", "distance_m": round(r["distance"])}],
        }
    except Exception:
        return None


@app.get("/api/places/{place_id}/route")
def place_route(place_id: int, mode: str = Query(default="walk"), fallback: int = Query(default=0), lang: str = Query(default="ru")):
    if mode not in ("walk", "transit"):
        return err(400, "BAD_REQUEST", "mode: walk|transit", lang, {"mode": mode})
    p = get_place(places_all(), place_id)
    if p is None:
        return err(404, "PLACE_NOT_FOUND", "Место не найдено", lang, {"place_id": place_id})
    bearing = bearing_deg(ORIGIN_LAT, ORIGIN_LNG, p.lat, p.lng)
    straight = haversine_m(ORIGIN_LAT, ORIGIN_LNG, p.lat, p.lng)

    if p.access == "transit" or mode == "transit":
        # за город — способ поездки голосом, геометрия прямая
        dist = round(straight)
        dur = max(1, round(dist / 500))  # ~30 км/ч
        return {
            "place_id": p.id, "mode": "transit",
            "distance_m": dist, "duration_min": dur,
            "bearing_deg": round(bearing, 1),
            "direction_text": direction_text(bearing, lang),
            "is_approximate": True,
            "geometry": {"type": "LineString", "coordinates": [[ORIGIN_LNG, ORIGIN_LAT], [p.lng, p.lat]]},
            "steps": [{"instruction": "Доехать на машине от стелы", "distance_m": dist}],
        }

    live = None if fallback == 1 else osrm_route(mode, p.lat, p.lng)
    if live is None:
        if fallback == 1:
            dist = round(straight)
            dur = max(1, round(dist / 80))  # пешком ~4.8 км/ч
            return {
                "place_id": p.id, "mode": "walk",
                "distance_m": dist, "duration_min": dur,
                "bearing_deg": round(bearing, 1),
                "direction_text": direction_text(bearing, lang),
                "is_approximate": True,
                "geometry": {"type": "LineString", "coordinates": [[ORIGIN_LNG, ORIGIN_LAT], [p.lng, p.lat]]},
                "steps": [{"instruction": "Прямо от стелы", "distance_m": dist}],
            }
        return err(503, "ROUTE_UNAVAILABLE", "Сервис маршрутов недоступен", lang, {"place_id": place_id})
    return {
        "place_id": p.id, "mode": "walk",
        "distance_m": live["distance_m"], "duration_min": live["duration_min"],
        "bearing_deg": round(bearing, 1),
        "direction_text": direction_text(bearing, lang),
        "is_approximate": False,
        "geometry": {"type": "LineString", "coordinates": live["coordinates"]},
        "steps": live["steps"],
    }


# ---------- 03. QR ----------
@app.post("/api/qr")
def create_qr(body: QrIn, request: Request):
    p = get_place(places_all(), body.place_id)
    if p is None:
        return err(404, "PLACE_NOT_FOUND", "Место не найдено", body.lang, {"place_id": body.place_id})
    token, ttl = store.new_qr_token(body.place_id, body.lang, body.session_id)
    store.log_event(body.session_id, "qr_scan", body.place_id, body.lang)
    base = os.getenv("PUBLIC_URL", "").rstrip("/") or str(request.base_url).rstrip("/")
    return {"url": f"{base}/r/{token}", "payload_version": 1, "expires_in_sec": ttl}


@app.get("/r/{token}", response_class=HTMLResponse)
def mobile_route_landing(token: str):
    data = store.get_qr_token(token)
    if not data:
        html = """<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BaGdar — Ссылка не найдена</title>
  <style>
    body { margin: 0; padding: 24px; font-family: system-ui, -apple-system, sans-serif; background: #070d1e; color: #fff; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
    .card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 32px 24px; max-width: 400px; backdrop-filter: blur(20px); }
    h1 { font-size: 22px; margin: 0 0 12px; color: #f87171; }
    p { color: #94a3b8; font-size: 15px; line-height: 1.5; margin: 0 0 20px; }
    .tag { display: inline-block; padding: 6px 14px; border-radius: 9999px; background: rgba(0, 194, 255, 0.15); color: #38bdf8; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  </style>
</head>
<body>
  <div class="card">
    <div class="tag">BaGdar · Ақтау</div>
    <h1 style="margin-top: 16px;">Срок действия истёк</h1>
    <p>Маршрут не найден или срок действия QR-кода истёк. Пожалуйста, отсканируйте новый QR-код на туристической стелле BaGdar.</p>
  </div>
</body>
</html>"""
        return HTMLResponse(content=html, status_code=404)

    places = places_all()
    place = get_place(places, data["place_id"])
    if not place:
        return HTMLResponse(content="<h1>Место не найдено</h1>", status_code=404)

    lang = data.get("lang", "ru")
    t = local_text(place, lang)
    dist_m = round(haversine_m(ORIGIN_LAT, ORIGIN_LNG, place.lat, place.lng))
    dur_min = max(1, round(dist_m / (80 if place.access == "walk" else 500)))
    bearing = bearing_deg(ORIGIN_LAT, ORIGIN_LNG, place.lat, place.lng)
    dir_str = direction_text(bearing, lang)

    dgis_url = f"https://2gis.kz/aktau/search/{place.lat}%2C{place.lng}"
    yandex_url = f"https://yandex.ru/maps/?rtext={ORIGIN_LAT},{ORIGIN_LNG}~{place.lat},{place.lng}&rtt={'pd' if place.access == 'walk' else 'auto'}"
    google_url = f"https://www.google.com/maps/dir/?api=1&origin={ORIGIN_LAT},{ORIGIN_LNG}&destination={place.lat},{place.lng}&travelmode={'walking' if place.access == 'walk' else 'driving'}"

    photo_url = place.photos[0] if place.photos else place.thumb_url
    photo_img = f'<img src="{photo_url}" alt="{t.name}" class="hero-img" onerror="this.style.display=\'none\'">' if photo_url else ''
    open_label = "Всегда открыто" if not place.hours else f"{place.hours.open} – {place.hours.close}"
    mode_label = "Пешком" if place.access == "walk" else "На транспорте"

    html = f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{t.name} — BaGdar</title>
  <style>
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(180deg, #0b1329 0%, #060b18 100%);
      color: #f1f5f9;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }}
    .wrap {{ width: 100%; max-width: 480px; }}
    .header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding: 0 4px;
    }}
    .brand {{
      font-size: 20px;
      font-weight: 800;
      background: linear-gradient(90deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }}
    .city-badge {{
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      color: #94a3b8;
    }}
    .card {{
      background: rgba(19, 31, 55, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      backdrop-filter: blur(24px);
    }}
    .hero-img {{
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 16px;
      margin-bottom: 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }}
    .badges {{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }}
    .badge {{
      background: rgba(56, 189, 248, 0.12);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.25);
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 9999px;
    }}
    .badge.green {{
      background: rgba(74, 222, 128, 0.12);
      color: #4ade80;
      border-color: rgba(74, 222, 128, 0.25);
    }}
    h1 {{
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 8px;
      color: #ffffff;
      line-height: 1.25;
    }}
    .summary {{
      font-size: 15px;
      color: #cbd5e1;
      line-height: 1.5;
      margin: 0 0 16px;
    }}
    .metrics-box {{
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 14px 16px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }}
    .metric-label {{ font-size: 12px; color: #64748b; margin-bottom: 2px; }}
    .metric-val {{ font-size: 16px; font-weight: 700; color: #f8fafc; }}
    .actions-title {{
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #94a3b8;
      margin-bottom: 12px;
    }}
    .btn {{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 14px;
      margin-bottom: 10px;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      transition: transform 0.15s, opacity 0.15s;
    }}
    .btn:active {{ transform: scale(0.98); }}
    .btn-2gis {{ background: #2cb742; color: #ffffff; box-shadow: 0 4px 12px rgba(44, 183, 66, 0.3); }}
    .btn-yandex {{ background: #fc3f1d; color: #ffffff; box-shadow: 0 4px 12px rgba(252, 63, 29, 0.3); }}
    .btn-google {{ background: rgba(255, 255, 255, 0.1); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2); }}
    .hint {{
      font-size: 12px;
      color: #64748b;
      text-align: center;
      margin-top: 18px;
      line-height: 1.4;
    }}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <span class="brand">BaGdar</span>
      <span class="city-badge">Ақтау · Манғыстау</span>
    </div>

    <div class="card">
      {photo_img}
      <div class="badges">
        <span class="badge">{place.category.upper()}</span>
        <span class="badge green">{open_label}</span>
        <span class="badge">{mode_label}</span>
      </div>

      <h1>{t.name}</h1>
      <p class="summary">{t.summary or t.description}</p>

      <div class="metrics-box">
        <div>
          <div class="metric-label">Расстояние от стелы</div>
          <div class="metric-val">~{dist_m} м ({dur_min} мин)</div>
        </div>
        <div>
          <div class="metric-label">Направление</div>
          <div class="metric-val">{dir_str}</div>
        </div>
      </div>

      <div class="actions-title">Открыть навигатор на телефоне:</div>
      <a href="{dgis_url}" target="_blank" rel="noopener" class="btn btn-2gis">
        <span>🟢 Открыть в 2ГИС</span>
      </a>
      <a href="{yandex_url}" target="_blank" rel="noopener" class="btn btn-yandex">
        <span>🟡 Открыть в Яндекс Картах</span>
      </a>
      <a href="{google_url}" target="_blank" rel="noopener" class="btn btn-google">
        <span>🔵 Открыть в Google Maps</span>
      </a>

      <div class="hint">
        Маршрут построен от интерактивной стелы BaGdar (набережная 15-го микрорайона, Актау).
      </div>
    </div>
  </div>
</body>
</html>"""
    return HTMLResponse(content=html)



# ---------- 04. Диалог ----------
def _dialog(payload: DialogIn):
    places = places_all()
    text = (payload.text or "").strip()
    if payload.audio_b64 and not text:
        # STT на сервере пока нет — честно отвечаем 422, фронт переспрашивает
        return err(422, "SPEECH_UNRECOGNIZED", "Не расслышал, повторите", payload.lang, {"stage": "stt"})
    if not text and not payload.signs:
        return err(422, "SPEECH_UNRECOGNIZED", "Не расслышал, повторите", payload.lang, {"stage": "stt"})
    if payload.signs and not text:
        text = ""  # жесты позже (поле зарезервировано), пока — переспрос ниже
        return err(422, "SPEECH_UNRECOGNIZED", "Не расслышал, повторите", payload.lang, {"stage": "stt"})
    if not store.check_rate_limit(payload.session_id):
        return err(429, "RATE_LIMITED", "Подождите немного", payload.lang, {"session_id": payload.session_id})

    lang = detect_lang(payload.lang, text)
    sess = store.get_session(payload.session_id)
    sess["lang"] = lang
    last_place_id = payload.context.get("last_place_id") or (sess["places"][-1] if sess["places"] else None)

    d = decide(text, places, lang if lang in ("kk", "ru", "en") else "ru", last_place_id)
    if not d["intent"]:
        store.log_event(payload.session_id, "voice_query", None, lang)
        return err(422, "SPEECH_UNRECOGNIZED", "Не понял, повторите", lang, {"stage": "intent"})

    # текст ответа
    if d["say_key"] == "found" and d["place_id"]:
        p = get_place(places, d["place_id"])
        t = local_text(p, lang)
        say_text = say(lang if lang in ("kk", "ru", "en") else "ru", "found", name=t.name, summary=t.summary)
    elif d["say_key"] == "scene" and d["place_id"]:
        p = get_place(places, d["place_id"])
        t = local_text(p, lang) if p else None
        say_text = say(lang if lang in ("kk", "ru", "en") else "ru", "scene", name=t.name if t else "")
    elif d["say_key"] == "nearby":
        names = ", ".join(local_text(c, lang).name for c in d.get("candidates", []))
        say_text = say(lang if lang in ("kk", "ru", "en") else "ru", "nearby", names=names)
    else:
        say_text = say(lang if lang in ("kk", "ru", "en") else "ru", d["say_key"])

    if d["place_id"]:
        sess["places"].append(d["place_id"])
    sess["last_intent"] = d["intent"]
    sess["turns"].append({"text": text, "intent": d["intent"]})
    sess["turns"] = sess["turns"][-10:]
    store.log_event(payload.session_id, "voice_query", d["place_id"], lang)

    return {
        "lang": lang,
        "say": say_text,
        "intent": d["intent"],
        "place_id": d["place_id"],
        "actions": d["actions"],
        "suggestions": d["suggestions"],
        "memory_patch": {"places": sess["places"][-5:]},
        "debug": {"stt_text": text, "via": "rules"},
    }


@app.post("/api/dialog/turn")
def dialog_turn(payload: DialogIn):
    return _dialog(payload)


@app.post("/api/voice")
def voice_alias(payload: DialogIn):
    """Совместимость: тот же ответ + need_route/need_scene."""
    res = _dialog(payload)
    if isinstance(res, JSONResponse):
        return res
    shows = [a.get("show") for a in res.get("actions", [])]
    res["need_route"] = "route" in shows
    res["need_scene"] = "scene" in shows
    return res


# ---------- 05. TarihSky ----------
@app.get("/api/places/{place_id}/scene")
def get_scene(place_id: int, lang: str = Query(default="ru")):
    p = get_place(places_all(), place_id)
    if p is None or p.scene is None:
        return err(404, "PLACE_NOT_FOUND", "Истории пока нет", lang, {"place_id": place_id})
    s = p.scene
    return {
        "place_id": p.id, "enabled": True,
        "modern_url": s.modern_url, "historic_url": s.historic_url,
        "attribution": s.attribution,
        "texts": {k: {"title": v.title, "body": v.body} for k, v in s.texts.items()},
        "sources": s.sources,
    }


# ---------- 06. Сеанс, события, здоровье ----------
@app.post("/api/event")
def post_event(body: EventIn):
    if body.type not in EVENT_TYPES:
        return err(400, "BAD_REQUEST", "Неизвестный тип события", body.lang, {"type": body.type})
    store.log_event(body.session_id, body.type, body.place_id, body.lang)
    return {"ok": True}


@app.post("/api/session/end")
def session_end(body: SessionEndIn):
    store.end_session(body.session_id)
    return {"ok": True}


@app.get("/api/health")
def health():
    return {"status": "ok", "db": True, "route_provider": True, "ai": ai_enabled(), "version": VERSION}


# ---------- Админ / аналитика ----------
def _metrics():
    by_lang: dict[str, int] = {}
    top: dict[int, int] = {}
    by_hour: dict[str, int] = {}
    langs = set()
    for e in store.EVENTS:
        by_lang[e["lang"]] = by_lang.get(e["lang"], 0) + 1
        langs.add(e["lang"])
        if e.get("place_id"):
            top[e["place_id"]] = top.get(e["place_id"], 0) + 1
    places = places_all()
    names = {p.id: local_text(p, "ru").name for p in places}
    return {
        "sessions": len(store.SESSIONS),
        "unique_langs": len(langs),
        "by_lang": by_lang,
        "top_places": [{"place_id": pid, "name": names.get(pid, str(pid)), "requests": c} for pid, c in sorted(top.items(), key=lambda x: -x[1])[:10]],
        "by_hour": by_hour,
    }


@app.get("/api/admin/metrics")
def admin_metrics():
    return _metrics()


@app.get("/api/stats")
def stats_alias():
    """B9 алиас для питча."""
    return _metrics()


@app.get("/api/admin/heatmap")
def admin_heatmap():
    places = {p.id: p for p in places_all()}
    weights: dict[int, int] = {}
    for e in store.EVENTS:
        if e.get("place_id"):
            weights[e["place_id"]] = weights.get(e["place_id"], 0) + 1
    return [{"lat": places[pid].lat, "lng": places[pid].lng, "weight": w} for pid, w in weights.items() if pid in places]


@app.get("/api/admin/places/stats")
def admin_places_stats():
    counts: dict[int, dict] = {}
    for e in store.EVENTS:
        pid = e.get("place_id")
        if not pid:
            continue
        c = counts.setdefault(pid, {"requests": 0, "route_clicks": 0, "scene_opens": 0})
        c["requests"] += 1
        if e["type"] == "route_click":
            c["route_clicks"] += 1
        if e["type"] == "scene_open":
            c["scene_opens"] += 1
    places = places_all()
    names = {p.id: local_text(p, "ru").name for p in places}
    return [{"place_id": pid, "name": names.get(pid, str(pid)), **c, "dead": c["requests"] == 0} for pid, c in counts.items()]


@app.post("/api/feedback")
def feedback(body: FeedbackIn):
    store.log_event(body.session_id, "voice_query", body.place_id, "ru")
    return {"ok": True}


# ---------- B11. TTS (на утверждении — заглушка) ----------
@app.post("/api/tts")
def tts(body: TtsIn):
    return err(503, "AI_UNAVAILABLE", "Озвучка пока недоступна", body.lang, {})
