# BaGdar — полный технологический стек

Фронт (готов) + бэк (строится). Все ключи — только на сервере.

## Frontend — `Dyman17/Bagdar` (это репо)

| Слой | Технология | Зачем |
|------|------------|-------|
| UI | React 19 + TypeScript + Vite 8 | экраны стеллы, state-машина фаз |
| Карта | Leaflet + react-leaflet + OSM-тайлы (без ключа, grayscale-фильтр) | витрина Мангистау, zoom, полилиния маршрута |
| Речь → текст | Web Speech API (Chrome, kk/ru/en/zh) | микрофон, автостарт, живой транскрипт |
| Озвучка | SpeechSynthesis (сейчас) → OpenAI TTS (B11) | голос стеллы |
| Громкость | Web Audio API (RMS → dBFS) | автовключение −30 дБ, сон |
| QR | qrcode.react (SVG) | маршрут на телефон |
| Шрифты | Manrope Variable + Newsreader Variable | grotesk + serif, liquid-glass |
| Состояние | React state-машина: idle/catalog/card/recording/processing/error_speech/tarihsky/qr/help/goodbye | фазы из `docs` Arch-репозитория |
| Кэш | localStorage (config, places — best effort) | деградация без сети |
| Демо | mock-режим (`?screen=route/scene/qr/sleep`) | проверка экранов без бэка |
| API-клиент | `src/api.ts` строго по контракту | `dialog/turn`, places, route, scene, qr, event, admin |
| Сборка | `npm run build` → `dist/` | деплой на мини-ПК |

Экраны (12): sleep, catalog, listening, thinking, error, suggest, help, goodbye, sign, place, tarihsky, qr.

## Backend — строится (см. контракт `Arch/docs/api/backend.md`)

| Слой | Технология | Зачем |
|------|------------|-------|
| Язык | Python 3.13 | — |
| API | FastAPI + uvicorn + pydantic | 13 эндпоинтов + 3 админских |
| Каталог | `catalog.py` (валидация, kk/ru/en, provenance) | ✅ уже в `Arch/backend` |
| БД | SQLAlchemy 2.0 → SQLite (черновик) → PostgreSQL + psycopg (прод, `DATABASE_URL`) | places, scenes, sessions, events, voice_queries, qr_tokens |
| Маршруты | OSRM public (без ключа) + haversine-фолбэк | пешие пути, `bearing_deg` считает бэк |
| Мозг | `POST /dialog/turn`: STT-текст → intent → `place_id` + `actions` | память сессии на сервере, сброс на человека |
| LLM | Gemini 2.0 Flash / GPT-4o-mini (ключ в `.env`) | любой язык (zh, pt-BR…), без ключа — правила+ru |
| TTS | OpenAI TTS (B11) | озвучка на языке туриста |
| Трекинг | YOLOv8 (человек издалека) + MediaPipe Face (вблизи) + HuskyLens (позже) | пробуждение, присутствие |
| Жесты | MediaPipe Hands 21 точка (roadmap) | немые: звук без речи ×2 → алерт → жесты |
| Тесты | pytest + httpx TestClient | контракт-тесты каждого эндпоинта |
| Конфиг | `.env` (не в репо): `DATABASE_URL`, `LLM_PROVIDER`, `GEMINI/OPENAI_API_KEY` | — |
| CORS | открыт для киоска (сузить в проде) | — |

Эндпоинты: `config`, `places` (`q`, `categories`), `place`, `route` (`fallback`), `dialog/turn` (+алиас `voice`), `scene`, `qr`, `event`, `session/end`, `health`, `admin/metrics|heatmap|places/stats`, `tts` (B11).

## Железо стеллы

Несенсорный вертикальный монитор + микрофон + динамик + камера + мини-ПК. Точка: амфитеатр 15 мкр (43.6582, 51.1352, heading 45° — сверить на месте).

## Связи

```
экран :5173 ──REST──▶ бэк :8000 ──▶ OSRM · Gemini/GPT · TTS
  │──▶ OSM-тайлы (карта)     ◀── STT: браузер
  └──▶ /r/:token (телефон)   ◀── камера: YOLO/MediaPipe (позже)
```

## Запуск (черновик)

```bash
# бэк
cd backend && python -m uvicorn app.main:app --port 8000
# фронт
cd frontend && npm install && npm run dev   # http://localhost:5173
```
