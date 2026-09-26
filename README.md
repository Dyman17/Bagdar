# 🚀 BaGdar — Интерактивная туристическая стела Актау и Мангистау

> **BaGdar** («Бағдар» — направление, ориентир) — цифровой голосовой гид на городской набережной Каспийского моря. Обеспечивает мгновенную пешеходную навигацию, голосовой диалог на казахском, русском и английском языках, историческую шторку «Тогда и сейчас» (TarihSky), оптический интерфейс жестов и перенос маршрута на смартфон по QR-коду.

---

## 🗺 Карта флоу: Сквозная архитектура (End-to-End Flow Map)

На схеме показано взаимодействие между физическим слоем стелы, клиентским приложением (React), сервером обработки (FastAPI) и внешними сервисами.

```mermaid
flowchart TD
    subgraph SENSORS ["1. Физический слой и сенсоры"]
        MIC["Микрофон (Web Audio / dB)"]
        TOUCH["Сенсорный экран (Pointer Events)"]
        CAM["Оптическая камера (HuskyLens / Gestures)"]
        AUDIO_OUT["Акустическая система (TTS Озвучка)"]
    end

    subgraph FRONTEND ["2. Frontend (React 19 + TypeScript + Vite)"]
        F_AUDIO["useAmbientAudio / useSpeechRecognition"]
        F_STATE["State Machine (14 экранов стелы)"]
        F_TIMER["Silence Timers (15s Gestures / 25s Sleep)"]
        F_MAP["MapLibre GL + Direction Compass"]
        F_TARIHSKY["TarihSky Scene Reveal Canvas"]
        F_API["api.ts (HTTP Client / Fallback Cache)"]
    end

    subgraph BACKEND ["3. Backend (FastAPI + Python 3.13)"]
        B_MAIN["main.py (API Routing & Schema Validation)"]
        B_DIALOG["dialog.py (NLP, Intent Matching, L10n)"]
        B_GEO["geo.py (Haversine, Bearing, Azimuth, OSRM)"]
        B_CATALOG["catalog.py (29 локаций Актау и Мангистау)"]
        B_STORE["store.py (In-Memory Session & Telemetry Store)"]
    end

    subgraph EXTERNAL ["4. Внешний контур и турист"]
        PHONE["Смартфон туриста (Web Route PWA)"]
        OSRM["OSRM Routing Server (Пеший граф)"]
        GEMINI["AI LLM Fallback (Gemini / OpenAI)"]
    end

    %% Потоки данных
    MIC -->|"Звук > -30 dBFS"| F_AUDIO
    TOUCH -->|"Тап / свайп / выбор"| F_STATE
    CAM -->|"Символы жестов"| F_STATE
    F_AUDIO -->|"Распознанный текст"| F_STATE
    F_STATE -->|"Сброс активности"| F_TIMER

    F_STATE -->|"POST /api/dialog/turn"| B_MAIN
    F_STATE -->|"GET /api/places/{id}/route"| B_MAIN
    F_STATE -->|"GET /api/places/{id}/scene"| B_MAIN
    F_STATE -->|"POST /api/qr"| B_MAIN

    B_MAIN --> B_DIALOG
    B_MAIN --> B_GEO
    B_MAIN --> B_CATALOG
    B_MAIN --> B_STORE

    B_GEO -.->|"Запрос геометрии пути"| OSRM
    B_DIALOG -.->|"Сложный диалог (опц.)"| GEMINI

    B_MAIN -->|"JSON Ответ + Actions"| F_API
    F_API --> F_STATE
    F_STATE -->|"Отрисовка карты и стрелки"| F_MAP
    F_STATE -->|"Шторка реконструкции"| F_TARIHSKY
    F_STATE -->|"Синтез речи"| AUDIO_OUT
    F_STATE -->|"QR-код экрана"| PHONE
```

---

## 🧭 Карта состояний и таймеров фронтенда (Frontend State & Timeout Flow)

Стела работает как строгий конечный автомат (State Machine). Управление таймерами активности гарантирует, что стела не остаётся зависшей в промежуточных экранах:

- **15 секунд тишины** → запрос перехода на **язык жестов** (`gestures`) с голосовым дублированием.
- **25 секунд тишины** → завершение сессии и переход в **режим сна** (`sleep`).
- **Любое касание или речь** → мгновенный сброс таймера и возврат в активный режим.

```mermaid
stateDiagram-v2
    [*] --> sleep: Инициализация

    sleep --> greeting: Звуковой порог (> -30 dB) / Тап по экрану
    greeting --> listening: Голосовой вопрос / Тап по микрофону
    greeting --> catalog: Просмотр списка мест

    listening --> thinking: Тишина 1.2с (речь завершена)
    listening --> error: Речь не распознана (onNoSpeech)

    error --> listening: Повторить голосом
    error --> catalog: Выбрать место касанием

    thinking --> place: Ответ найден (показ карточки места)
    thinking --> route: Запрошен маршрут
    thinking --> tarihsky: Запрошена история («Тогда и сейчас»)
    thinking --> qr: Запрошен перенос на телефон
    thinking --> variants: Несколько совпадений

    place --> route: Кнопка «Маршрут» / Голос: «Как пройти»
    place --> tarihsky: Голос: «Покажи историю»
    place --> qr: Кнопка «На телефон» / Голос: «QR»
    place --> catalog: Кнопка «Все места»

    route --> qr: Перенести маршрут на телефон
    tarihsky --> place: Назад к карточке
    qr --> place: Завершить просмотр QR

    %% Тайм-ауты тишины
    greeting --> gestures: Молчание 15 секунд
    catalog --> gestures: Молчание 15 секунд
    place --> gestures: Молчание 15 секунд
    route --> gestures: Молчание 15 секунд
    error --> gestures: Молчание 15 секунд

    gestures --> sleep: Молчание 25 секунд (суммарно)
    place --> sleep: Молчание 25 секунд
    catalog --> sleep: Молчание 25 секунд
    greeting --> sleep: Молчание 25 секунд

    gestures --> catalog: Касание экрана / Голос / Принят жест
```

---

## ⚡ Диаграмма последовательности: Голосовой запрос туриста (Voice Turn Sequence)

Пошаговый сценарий от момента, когда турист произносит вопрос, до прокладки пешеходного маршрута на карте:

```mermaid
sequenceDiagram
    autonumber
    actor Tourist as Турист
    participant UI as Frontend (App.tsx / MapLibre)
    participant Audio as Speech Engine (Web Speech / STT)
    participant API as FastAPI Router (main.py)
    participant Dialog as Dialog NLP Engine (dialog.py)
    participant Geo as Geo & Routing Engine (geo.py)
    participant Store as Catalog & Store (catalog.py)

    Tourist->>Audio: «Как пройти к Скальной тропе?»
    Audio->>UI: onComplete(text = "Как пройти к Скальной тропе?")
    UI->>UI: setPhase("thinking"), сброс таймера молчания

    UI->>API: POST /api/dialog/turn {session_id, text, lang: "auto"}
    API->>Dialog: decide(text, lang, context)
    Dialog->>Dialog: detect_lang("Как пройти...") -> "ru"
    Dialog->>Dialog: match_places("Скальная тропа") -> place_id: 1, score: 0.95
    Dialog-->>API: {say: "Скальная тропа...", actions: [{show: "place", id: 1}, {show: "route", id: 1}]}

    API-->>UI: 200 OK DialogResponse
    UI->>UI: setAnswer(say), TTS Speak(say)

    par Загрузка деталей и маршрута
        UI->>API: GET /api/places/1?lang=ru
        API->>Store: get_place(1)
        Store-->>API: PlaceDetail (lat, lng, hours, photos, summary)
        API-->>UI: 200 OK PlaceDetail
    and Расчет пешеходного пути
        UI->>API: GET /api/places/1/route?access=walk&lang=ru
        API->>Geo: build_route(origin, dest, access)
        Geo->>Geo: haversine_m() -> 1850 м
        Geo->>Geo: bearing_deg() -> 172° (юг-юго-восток)
        Geo->>Geo: direction_text(172°) -> "направляйтесь на юг вдоль моря"
        Geo-->>API: RouteResponse (distance_m: 1850, duration_min: 24, geometry)
        API-->>UI: 200 OK RouteResponse
    end

    UI->>UI: setPhase("route"), отрисовка MapLibre полилинии + компас 172°
    Tourist->>UI: Молчит 15 секунд...
    UI->>UI: setPhase("gestures") + Озвучка: «Общаетесь на языке жестов? Показывайте.»
    Tourist->>UI: Молчит еще 10 секунд (всего 25с)...
    UI->>API: DELETE /api/session/{id} (Завершение сессии)
    UI->>UI: setPhase("sleep") (Заставка Каспийского времени)
```

---

## 📊 Матрица функций Frontend ↔ Backend (Function Map)

В таблице представлена полная карта привязки функций клиентской части к эндпоинтам и алгоритмам сервера:

| Пользовательский флоу | Frontend функция / хук | HTTP Эндпоинт | Backend функция / модуль | Источник данных / Алгоритм | Результат на стеле |
|---|---|---|---|---|---|
| **Инициализация стелы** | `boot()` в `App.tsx`<br>`api.getConfig()` | `GET /api/config` | `get_config()` в `main.py` | Переменные окружения, координаты стелы `ORIGIN_LAT/LNG` | Локация `43.662252, 51.133075`, языки `kk/ru/en`, screen_id |
| **Каталог 29 мест** | `api.getPlaces(lang)` | `GET /api/places` | `get_places()` в `main.py`<br>`load_places()` в `catalog.py` | `data/places/places.json`<br>29 мест Актау и Мангистау | Сетка карточек по 10 категориям (парк, набережная, отели, еда, туры) |
| **Голосовой диалог** | `submitTurn(text)`<br>`useSpeechRecognition` | `POST /api/dialog/turn` | `dialog_turn()` в `main.py`<br>`decide()` в `dialog.py` | Левенштейн / fuzzy-поиск, классификатор интентов, мультиязычность | Ответ ассистента в TTS, цепочка действий `actions[]` |
| **Карточка места** | `api.getPlace(id, lang)` | `GET /api/places/{id}` | `get_place_by_id()` в `main.py`<br>`opening_state()` | `places.json`<br>Проверка времени работы и статуса `is_open_now` | Фото, статус открытия, описание, кнопки навигации |
| **Маршрут и навигация** | `api.getRoute(id, access)` | `GET /api/places/{id}/route` | `get_route()` в `main.py`<br>`haversine_m()`, `bearing_deg()` в `geo.py` | OSRM графовый роутер с фоллбэком на ортодромический азимут | Синяя линия пути на MapLibre, метры, минуты, стрелка компаса |
| **TarihSky («Тогда/Сейчас»)** | `api.getScene(id, lang)` | `GET /api/places/{id}/scene` | `get_scene()` в `main.py` | Архивные фото и современный вид (`then_url`, `now_url`) | Интерактивный ползунок исторической реконструкции |
| **Перенос на смартфон** | `api.postQr(payload)` | `POST /api/qr` | `create_qr()` в `main.py`<br>`build_mobile_url()` | Генерация защищенного токена и мобильной ссылки | QR-код на экране с обратным отсчетом 60 секунд |
| **Телеметрия стелы** | `postEvent(type)` | `POST /api/events` | `log_event()` в `main.py`<br>`store.append_event()` | Хранилище событий в памяти / SQLite | Логирование кликов, просмотров, сканирований и сессий |
| **Таймер молчания (15с)** | `useEffect(timer)` в `App.tsx` | *Локальный автомат* | `copy.gesture` в `i18n.ts` | Сравнение `Date.now() - lastActivity >= 15` | Переключение на `PageGestures`, озвучка жестового приглашения |
| **Таймер сна (25с)** | `endSession(true)` в `App.tsx` | `DELETE /api/session/{id}` | `end_session()` в `main.py`<br>`store.end_session()` | Сравнение `Date.now() - lastActivity >= 25` | Озвучка прощания, очистка состояния, `PageSleep` |

---

## 🛡 Отказоустойчивость и сценарии деградации (Graceful Degradation)

Стела спроектирована для надежной работы в автономных условиях на улице:

```mermaid
flowchart LR
    subgraph FAILURES ["Сбой"]
        F1["Нет интернета"]
        F2["Шум на улице / Сбой микрофона"]
        F3["Сбой OSRM маршрутизации"]
        F4["Сбой камеры жестов"]
    end

    subgraph DEGRADATION ["Режим деградации"]
        D1["Кэш в localStorage (каталог и конфиг)"]
        D2["Повтор фразы -> 15с: жесты -> Сенсорное управление"]
        D3["Азимут по прямой + флаг is_approximate: true"]
        D4["Полный сенсорный режим без жестов"]
    end

    F1 ==> D1
    F2 ==> D2
    F3 ==> D3
    F4 ==> D4
```

---

## 🏛 Каталог объектов (Актау и Мангистау)

В систему заложен полный верифицированный каталог из 29 ключевых объектов региона (файл `data/places/places.json`):

1. **Городской променад и прибрежная зона**: Скальная тропа, Набережная 15-го мкр, Амфитеатр, Мыс Меловой (Маяк), Парк Акбота.
2. **Культура и история**: Мангистауский областной историко-краеведческий музей, Мечеть Бекет-Ата (городская).
3. **Шопинг и гастрономия**: ТРК «Актау», ТРК «Гум», Рынок «Жёлтый» (Шыгыс), Каспийский ресторан «Aidyn», Чайхана «Mangi», Fish Bar у пирса.
4. **Отели**: Rixos Water World Aktau, Caspian Riviera Grand Palace, Renaissance Aktau, Grand Hotel Victory, Holiday Inn Aktau.
5. **Транспортные узлы**: Международный аэропорт Актау (SCO), Ж/Д вокзал Мангышлак (Мангистау), Автовокзал 28-й микрорайон, Морской порт Актау.
6. **Экспедиционные туры по Мангистау**: Урочище Бозжыра, Впадина Каракия, Долина шаров Торыш, Мечеть Шакпак-Ата, Мечеть Бекет-Ата (Огланды), Каньон Ыбыкты, Каспийская лагуна Саура.

---

## 🛠 Технологический стек

- **Frontend**: React 19, TypeScript, Vite, MapLibre GL, Web Audio API, Web Speech API.
- **Backend**: Python 3.13, FastAPI, Pydantic v2, Uvicorn, OSRM Integration.
- **Данные и геометрия**: GeoJSON, Haversine formula, ортодромический азимут, SQLite/In-memory store.
- **Дизайн**: Liquid Glass Design System, CSS Variables, Manrope & Newsreader типографика.

---

## 🚀 Быстрый запуск

### 1. Запуск Backend

```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Проверка тестов:
```bash
$env:PYTHONPATH="backend"; python -m pytest backend/tests
```

### 2. Запуск Frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется по адресу `http://localhost:5173`.
Сборка для продакшена:
```bash
npm run build
```

---

## 👥 Команда проекта

| Роль | Участник | Зона ответственности |
|---|---|---|
| **Tech Lead** | [@Dyman17](https://github.com/Dyman17) | Архитектура, ревью, контракты, интеграция и деплой |
| **Backend** | [@RKydyrali](https://github.com/RKydyrali) | FastAPI, каталог, маршруты, NLP-диалог, QR |
| **Frontend** | [@yernurge](https://github.com/yernurge) | React-экраны стелы, MapLibre, аудио-слой, TarihSky, тайм-ауты |
