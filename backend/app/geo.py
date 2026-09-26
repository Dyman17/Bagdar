"""Гео-утилиты: bearing считает только бэк (контракт)."""
import math

ORIGIN_LAT = 43.6582
ORIGIN_LNG = 51.1352
EARTH_R_M = 6_371_000


def haversine_m(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * EARTH_R_M * math.asin(math.sqrt(a))


def bearing_deg(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Азимут от точки 1 к точке 2, 0-360."""
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dl = math.radians(lng2 - lng1)
    x = math.sin(dl) * math.cos(p2)
    y = math.cos(p1) * math.sin(p2) - math.sin(p1) * math.cos(p2) * math.cos(dl)
    return (math.degrees(math.atan2(x, y)) + 360) % 360


RU_DIRECTIONS = [
    (22.5, "идите на север"),
    (67.5, "идите на северо-восток"),
    (112.5, "идите на восток"),
    (157.5, "идите на юго-восток"),
    (202.5, "идите на юг"),
    (247.5, "идите на юго-запад"),
    (292.5, "идите на запад"),
    (337.5, "идите на северо-запад"),
]

KK_DIRECTIONS = [
    (22.5, "солтүстікке қарай жүріңіз"),
    (67.5, "солтүстік-шығысқа қарай жүріңіз"),
    (112.5, "шығысқа қарай жүріңіз"),
    (157.5, "оңтүстік-шығысқа қарай жүріңіз"),
    (202.5, "оңтүстікке қарай жүріңіз"),
    (247.5, "оңтүстік-батысқа қарай жүріңіз"),
    (292.5, "батысқа қарай жүріңіз"),
    (337.5, "солтүстік-батысқа қарай жүріңіз"),
]

EN_DIRECTIONS = [
    (22.5, "head north"),
    (67.5, "head northeast"),
    (112.5, "head east"),
    (157.5, "head southeast"),
    (202.5, "head south"),
    (247.5, "head southwest"),
    (292.5, "head west"),
    (337.5, "head northwest"),
]


def direction_text(bearing: float, lang: str = "ru") -> str:
    table = KK_DIRECTIONS if lang == "kk" else (EN_DIRECTIONS if lang == "en" else RU_DIRECTIONS)
    fallback = "солтүстікке қарай жүріңіз" if lang == "kk" else ("head north" if lang == "en" else "идите на север")
    for bound, text in table:
        if bearing < bound:
            return text
    return fallback

