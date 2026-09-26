"""Правила диалога v1: intent -> place_id из каталога. LLM — позже (B7/B8)."""
from __future__ import annotations

from app.catalog import Place, local_text

FAREWELL = ("спасибо", "пока", "рахмет", "рақмет", "сау бол", "до свидания", "всё", "все", "bye", "thank", "goodbye", "qosh")
QR_WORDS = ("телефон", "qr", "кьюар", "скан", "phone", "telefon")
SCENE_WORDS = ("как было", "раньше", "история", "тарих", "тарихы", "then", "now", "тогда", "сейчас", "historic", "history")
NEARBY_WORDS = ("рядом", "поблизости", "nearby", "near", "жанында", "маңында", "что посмотреть", "куда сходить", "где поесть", "отели", "қайда баруға")
HELP_WORDS = ("помощь", "умеешь", "help", "көмек", "что ты", "пример")
ROUTE_WORDS = ("как пройти", "где", "покажи", "маршрут", "қайда", "қалай", "where", "how", "route", "museum", "музей", "отель", "шашлык", "еда", "кафе", "ресторан", "пляж", "маяк", "бозжыра", "туры")


def detect_lang(requested: str, text: str) -> str:
    if requested and requested != "auto":
        return requested
    t = (text or "").lower()
    if any(c in t for c in "әғқңөұүі"):
        return "kk"
    # грубая эвристика: латиница -> en, иначе ru
    latin = sum(1 for c in t if "a" <= c <= "z")
    cyr = sum(1 for c in t if "а" <= c <= "я" or c == "ё")
    if latin > cyr and latin > 0:
        return "en"
    return "ru"


SAY = {
    "kk": {
        "found": "Міне, {name}. {summary} Бағытты картадан көрсетемін.",
        "scene": "{name}: бұрын және қазір. Экраннан салыстырыңыз.",
        "qr": "Сканерлеңіз — бағыт телефонда ашылады.",
        "many": "Жақын жерден бірнеше орын таптым. Қайсысы?",
        "nearby": "Жақында: {names}. Қайсысын көрсетейін?",
        "help": "Менен сұраңыз: қайда баруға болады, қалай жетуге болады, бұрын қалай болған, телефонға жіберу.",
        "bye": "Сау болыңыз! Тағы келіңіз!",
    },
    "ru": {
        "found": "{name}. {summary} Показываю маршрут на карте.",
        "scene": "{name}: тогда и сейчас. Сравните на экране.",
        "qr": "Сканируйте — маршрут откроется на телефоне.",
        "many": "Нашёл несколько мест рядом. Какое показать?",
        "nearby": "Рядом: {names}. Какое показать?",
        "help": "Спросите меня: куда сходить, как пройти, как было раньше, отправь на телефон.",
        "bye": "До свидания! Приходите ещё!",
    },
    "en": {
        "found": "{name}. {summary} Showing the route on the map.",
        "scene": "{name}: then and now. Compare on the screen.",
        "qr": "Scan it — the route will open on your phone.",
        "many": "Found several places nearby. Which one?",
        "nearby": "Nearby: {names}. Which one to show?",
        "help": "Ask me: where to go, how to get there, how it looked before, send to phone.",
        "bye": "Goodbye! Come again!",
    },
}


def say(lang: str, key: str, **kw: str) -> str:
    table = SAY.get(lang, SAY["ru"])
    template = table.get(key, SAY["ru"][key])
    try:
        return template.format(**kw)
    except KeyError:
        return template


STOPWORDS = {
    "как", "где", "что", "это", "или", "меня", "мне", "есть", "к", "на", "в", "с",
    "пройти", "дойти", "покажи", "покажите", "показать", "найти", "находится",
    "қалай", "қайда", "көрсет", "where", "how", "route", "show", "find", "near",
}


def _tokens(blob: str) -> list[str]:
    return [w.strip("?,.!\u2014-").lower() for w in blob.split()]


def match_places(text: str, places: list[Place]) -> list[Place]:
    t = text.lower().strip()
    if not t:
        return []
    scored: list[tuple[int, Place]] = []
    for p in places:
        names = [v.name.lower() for v in p.texts.values()] + [v.summary.lower() for v in p.texts.values()]
        blob = " ".join(names)
        btokens = _tokens(blob)
        hits = 0
        # целые короткие запросы: "музей", "набережная"
        if t in blob:
            hits += 2
        for word in _tokens(t):
            w = word.strip("?,.!").lower()
            if len(w) < 4 or w in STOPWORDS:
                continue
            stem = w[:5] if len(w) >= 5 else w
            if w in blob:
                hits += len(w)  # длинные слова весят больше ("амфитеатр" > "как")
                continue
            if any(bt.startswith(stem) or stem.startswith(bt[:5]) for bt in btokens if len(bt) >= 4):
                hits += len(stem)
        if hits:
            scored.append((hits, p))
    scored.sort(key=lambda x: -x[0])
    return [p for _, p in scored]


def decide(text: str, places: list[Place], lang: str, last_place_id: int | None) -> dict:
    """Возвращает intent/place_id/actions/suggestions/say-key."""
    t = text.lower()

    if any(w in t for w in FAREWELL):
        return {"intent": "farewell", "place_id": None, "actions": [{"show": "sleep"}], "suggestions": [], "say_key": "bye"}

    matched = match_places(text, places)

    if any(w in t for w in QR_WORDS):
        pid = matched[0].id if matched else last_place_id
        return {"intent": "qr_request", "place_id": pid, "actions": ([{"show": "qr", "place_id": pid}] if pid else []), "suggestions": [], "say_key": "qr"}

    if any(w in t for w in SCENE_WORDS):
        pid = matched[0].id if matched else last_place_id
        if pid is not None:
            with_scene = next((p for p in places if p.id == pid and p.scene is not None), None)
            if with_scene is not None:
                return {"intent": "scene_info", "place_id": pid, "actions": [{"show": "scene", "place_id": pid}], "suggestions": [], "say_key": "scene"}
        if matched:
            return {"intent": "scene_info", "place_id": matched[0].id, "actions": [], "suggestions": [], "say_key": "scene"}
        return {"intent": "scene_info", "place_id": None, "actions": [], "suggestions": [], "say_key": "scene"}

    if any(w in t for w in NEARBY_WORDS):
        cands = matched[:3] if matched else places[:3]
        if last_place_id:
            cands = [p for p in places if p.id != last_place_id][:3]
        return {
            "intent": "nearby",
            "place_id": None,
            "actions": [],
            "suggestions": [{"id": p.id, "name": local_text(p, lang).name} for p in cands],
            "say_key": "nearby",
            "candidates": cands,
        }

    if any(w in t for w in HELP_WORDS):
        return {"intent": "help", "place_id": None, "actions": [{"show": "map"}], "suggestions": [], "say_key": "help"}

    # местоимения: "а что рядом с ним", "как туда пройти" -> последнее место
    if last_place_id and (("ним" in t or "туда" in t or "него" in t or "it" in t) and not matched):
        p = next((x for x in places if x.id == last_place_id), None)
        if p:
            if any(w in t for w in ("пройти", "дойти", "жету", "route", "go", "get")):
                return {"intent": "route_to_place", "place_id": p.id, "actions": [{"show": "route", "place_id": p.id}], "suggestions": [], "say_key": "found"}
            return {"intent": "place_info", "place_id": p.id, "actions": [{"show": "route", "place_id": p.id}], "suggestions": [], "say_key": "found"}

    if len(matched) == 1:
        return {"intent": "route_to_place", "place_id": matched[0].id, "actions": [{"show": "route", "place_id": matched[0].id}], "suggestions": [], "say_key": "found"}
    if len(matched) > 1:
        return {
            "intent": "search",
            "place_id": None,
            "actions": [],
            "suggestions": [{"id": p.id, "name": local_text(p, lang).name} for p in matched[:3]],
            "say_key": "many",
        }
    return {"intent": "", "place_id": None, "actions": [], "suggestions": [], "say_key": ""}
