"""In-memory хранилище: сессии, события, rate-limit, QR-токены."""
import secrets
import time
from collections import defaultdict

SESSIONS: dict[str, dict] = {}
EVENTS: list[dict] = []
QR_TOKENS: dict[str, dict] = {}
FEEDBACK: list[dict] = []
VOICE_HITS: dict[str, list[float]] = defaultdict(list)

RATE_LIMIT = 10
RATE_WINDOW_SEC = 60


def log_feedback(session_id: str, place_id: int | None = None, rating: int | None = None, comment: str | None = None) -> None:
    FEEDBACK.append({"session_id": session_id, "place_id": place_id, "rating": rating, "comment": comment, "ts": time.time()})


def cleanup_expired() -> None:
    now = time.time()
    expired_tokens = [k for k, v in list(QR_TOKENS.items()) if v.get("exp", 0) < now]
    for k in expired_tokens:
        QR_TOKENS.pop(k, None)
    expired_sessions = [k for k, v in list(SESSIONS.items()) if now - v.get("created_at", now) > 14400]
    for k in expired_sessions:
        SESSIONS.pop(k, None)


def get_session(session_id: str) -> dict:
    cleanup_expired()
    sess = SESSIONS.get(session_id)
    if sess is None:
        sess = {"lang": "kk", "places": [], "last_intent": None, "turns": [], "prefs": {}, "created_at": time.time()}
        SESSIONS[session_id] = sess
    return sess


def end_session(session_id: str) -> None:
    SESSIONS.pop(session_id, None)
    VOICE_HITS.pop(session_id, None)


def check_rate_limit(session_id: str) -> bool:
    """True — можно, False — превышен лимит."""
    now = time.time()
    hits = [t for t in VOICE_HITS[session_id] if now - t < RATE_WINDOW_SEC]
    VOICE_HITS[session_id] = hits
    if len(hits) >= RATE_LIMIT:
        return False
    hits.append(now)
    return True


def log_event(session_id: str, type_: str, place_id: int | None = None, lang: str = "ru") -> None:
    EVENTS.append({"session_id": session_id, "type": type_, "place_id": place_id, "lang": lang, "ts": time.time()})


def new_qr_token(place_id: int, lang: str, session_id: str, ttl: int = 3600) -> tuple[str, int]:
    token = secrets.token_urlsafe(9)
    QR_TOKENS[token] = {"place_id": place_id, "lang": lang, "session_id": session_id, "exp": time.time() + ttl}
    return token, ttl


def get_qr_token(token: str) -> dict | None:
    data = QR_TOKENS.get(token)
    if not data or time.time() > data.get("exp", 0):
        return None
    return data

