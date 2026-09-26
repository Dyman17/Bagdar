import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api, isMockMode } from './api'
import { ApiError } from './api-error'
import { Brand } from './components/Brand'
import { CatalogScreen } from './components/CatalogScreen'
import { PageSleep } from './components/pages/PageSleep'
import { PageGreeting } from './components/pages/PageGreeting'
import { PageListening } from './components/pages/PageListening'
import { PageThinking } from './components/pages/PageThinking'
import { PagePlace } from './components/pages/PagePlace'
import { PageRoute } from './components/pages/PageRoute'
import { PageHistory } from './components/pages/PageHistory'
import { PageQr } from './components/pages/PageQr'
import { PageVariants } from './components/pages/PageVariants'
import { PageNearby } from './components/pages/PageNearby'
import { PageHelp } from './components/pages/PageHelp'
import { PageFarewell } from './components/pages/PageFarewell'
import { PageError } from './components/pages/PageError'
import { PageGestures } from './components/pages/PageGestures'
import { useAmbientAudio } from './hooks/useAmbientAudio'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { speechLocale, t } from './i18n'
import { mockConfig, mockDetail, mockRoutes, mockScene, mockSummaries } from './mocks/data'
import type {
  Config,
  DialogAction,
  EventRequest,
  KioskPhase,
  PlaceDetail,
  PlaceSummary,
  QrResponse,
  RouteResponse,
  SceneResponse,
} from './types'

const CONFIG_CACHE = 'bagdar:config:v1'
const PLACES_CACHE = 'bagdar:places:v1'

function readCache<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : null
  } catch {
    return null
  }
}

function writeCache(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* kiosk cache is best effort */
  }
}

export default function App() {
  const [config, setConfig] = useState<Config | null>(null)
  const [places, setPlaces] = useState<PlaceSummary[]>([])
  const [phase, setPhase] = useState<KioskPhase>('catalog')
  const [returnPhase, setReturnPhase] = useState<KioskPhase>('catalog')
  const [lang, setLang] = useState('ru')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [place, setPlace] = useState<PlaceDetail | null>(null)
  const [route, setRoute] = useState<RouteResponse | null>(null)
  const [scene, setScene] = useState<SceneResponse | null>(null)
  const [qr, setQr] = useState<QrResponse | null>(null)
  const [qrRemaining, setQrRemaining] = useState(60)
  const [answer, setAnswer] = useState('')
  const [suggestions, setSuggestions] = useState<{ id: number; name: string }[]>([])
  const [offline, setOffline] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [gesturePrompt, setGesturePrompt] = useState(false)
  const [sceneReveal, setSceneReveal] = useState(0)
  const [lastQuery, setLastQuery] = useState('')

  const lastActivity = useRef(Date.now())
  const gesturePromptedRef = useRef(false)
  const phaseRef = useRef<KioskPhase>(phase)
  const sessionRef = useRef<string | null>(sessionId)
  const speakingRef = useRef(speaking)
  const demoBooted = useRef(false)
  const copy = useMemo(() => t(lang), [lang])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])
  useEffect(() => {
    sessionRef.current = sessionId
  }, [sessionId])
  useEffect(() => {
    speakingRef.current = speaking
  }, [speaking])

  const speak = useCallback(
    (text: string, language = lang) => {
      if (!text || !('speechSynthesis' in window)) return Promise.resolve()
      window.speechSynthesis.cancel()
      setSpeaking(true)
      return new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = speechLocale(language)
        utterance.rate = 0.93
        utterance.pitch = 0.96
        utterance.onend = () => {
          setSpeaking(false)
          resolve()
        }
        utterance.onerror = () => {
          setSpeaking(false)
          resolve()
        }
        window.speechSynthesis.speak(utterance)
      })
    },
    [lang],
  )

  const postEvent = useCallback(
    (type: EventRequest['type'], activeSession: string, placeId?: number | null) => {
      void api.postEvent({ session_id: activeSession, type, place_id: placeId, lang }).catch(() => setOffline(true))
    },
    [lang],
  )

  const startSession = useCallback(() => {
    if (sessionRef.current) return sessionRef.current
    const id = crypto.randomUUID()
    sessionRef.current = id
    setSessionId(id)
    setPhase('catalog')
    setAnswer('Здравствуйте! Спросите меня о городе.')
    setSuggestions([])
    lastActivity.current = Date.now()
    gesturePromptedRef.current = false
    postEvent('session_start', id)
    void speak('Здравствуйте! Спросите меня о городе.', lang)
    return id
  }, [lang, postEvent, speak])

  const endSession = useCallback(
    async (farewell = true) => {
      const id = sessionRef.current
      if (id) {
        if (farewell) await speak('Спасибо за прогулку. До встречи у Каспия.', lang)
        await api.endSession(id).catch(() => setOffline(true))
      }
      sessionRef.current = null
      setSessionId(null)
      setPlace(null)
      setRoute(null)
      setScene(null)
      setQr(null)
      setSuggestions([])
      setAnswer('')
      setRetryCount(0)
      setGesturePrompt(false)
      setPhase('sleep')
      lastActivity.current = Date.now()
      gesturePromptedRef.current = false
    },
    [lang, speak],
  )

  // Bootstrapping Config & Places
  useEffect(() => {
    let cancelled = false
    async function boot() {
      let nextConfig: Config
      try {
        nextConfig = await api.getConfig()
        writeCache(CONFIG_CACHE, nextConfig)
        if (cancelled) return
        setConfig(nextConfig)
        setLang(nextConfig.default_lang)
      } catch {
        setOffline(true)
        nextConfig = readCache<Config>(CONFIG_CACHE) ?? mockConfig
        if (cancelled) return
        setConfig(nextConfig)
        setLang(nextConfig.default_lang)
      }

      try {
        const catalogue = await api.getPlaces(nextConfig.default_lang)
        if (cancelled) return
        setPlaces(catalogue.places)
        writeCache(PLACES_CACHE, catalogue.places)
      } catch {
        setOffline(true)
        const cached = readCache<PlaceSummary[]>(PLACES_CACHE)
        if (cached && !cancelled) setPlaces(cached)
        else if (!cancelled) setPlaces(mockSummaries(nextConfig.default_lang))
      }

      // Pre-seed default place and route for instant inspection
      const defaultPlace = mockDetail(2, nextConfig.default_lang) ?? null
      const defaultRoute = mockRoutes[2] ?? null
      setPlace(defaultPlace)
      setRoute(defaultRoute)
      setScene(mockScene)
      setQr({
        url: 'https://bagdar.kz/route/2?token=demo',
        payload_version: 1,
        expires_in_sec: 60,
      })
    }
    void boot()
    return () => {
      cancelled = true
    }
  }, [])

  const executeAction = useCallback(
    async (action: DialogAction, activeSession: string, actionLang = lang) => {
      const actionCopy = t(actionLang)
      const placeId = action.place_id ?? place?.id ?? 2

      if (action.show === 'map') {
        setPhase('catalog')
        return
      }
      if (action.show === 'sleep') {
        await endSession(false)
        setPhase('sleep')
        return
      }
      if (action.show === 'variants') {
        setPhase('variants')
        return
      }
      if (action.show === 'nearby') {
        setPhase('nearby')
        return
      }
      if (action.show === 'help') {
        setPhase('help')
        return
      }
      if (action.show === 'farewell') {
        setPhase('farewell')
        return
      }
      if (action.show === 'gestures') {
        setPhase('gestures')
        return
      }

      if (action.show === 'route' || action.show === 'place') {
        try {
          const nextPlace = await api.getPlace(placeId, actionLang)
          let nextRoute: RouteResponse
          try {
            nextRoute = await api.getRoute(placeId, nextPlace.access, false, actionLang)
          } catch (error) {
            if (error instanceof ApiError && error.code === 'ROUTE_UNAVAILABLE') {
              nextRoute = await api.getRoute(placeId, nextPlace.access, true, actionLang)
            } else throw error
          }
          setPlace(nextPlace)
          setRoute(nextRoute)
          setPhase(action.show === 'route' ? 'route' : 'place')
          postEvent('place_view', activeSession, placeId)
          postEvent('route_click', activeSession, placeId)

          const openText =
            nextPlace.hours === null
              ? actionCopy.always
              : nextPlace.is_open_now
                ? String(nextPlace.hours)
                : `${actionCopy.closed}. ${nextPlace.opens_next ?? ''}`
          const travel = nextRoute.mode === 'transit' ? actionCopy.transit : actionCopy.walk
          const approximate = nextRoute.is_approximate ? `${actionCopy.approximate}. ` : ''
          const firstStep = nextRoute.steps[0]?.instruction ? `${nextRoute.steps[0].instruction}. ` : ''
          const followUp = nextPlace.has_scene ? actionCopy.routePrompt : actionCopy.phonePrompt
          void speak(
            `${nextPlace.name}. ${nextPlace.summary} ${openText}. ${approximate}${travel}: ${nextRoute.distance_m} м, ${nextRoute.duration_min} мин. ${nextRoute.direction_text}. ${firstStep}${followUp}`,
            actionLang,
          )
        } catch {
          setOffline(true)
          setAnswer('Маршрут временно недоступен. Показываю сохранённый каталог.')
          setPhase('catalog')
        }
        return
      }

      if (action.show === 'scene') {
        try {
          const nextScene = await api.getScene(placeId, actionLang)
          setScene(nextScene)
          setSceneReveal(50)
          setPhase('history')
          postEvent('scene_open', activeSession, placeId)
          const sceneText = nextScene.texts[actionLang] ?? nextScene.texts.ru
          if (sceneText) void speak(`${sceneText.title}. ${sceneText.body}`, actionLang)
        } catch {
          setOffline(true)
          setPhase(place ? 'place' : 'catalog')
        }
        return
      }

      if (action.show === 'qr') {
        try {
          const [nextQr, nextPlace] = await Promise.all([
            api.createQr(placeId, actionLang, activeSession),
            api.getPlace(placeId, actionLang),
          ])
          setQr(nextQr)
          setPlace(nextPlace)
          setQrRemaining(config?.session.qr_timeout_sec ?? 60)
          setPhase('qr')
          void speak(actionCopy.scan, actionLang)
        } catch {
          setAnswer('Не удалось создать код. Я могу повторить адрес вслух.')
          setPhase(place ? 'place' : 'catalog')
        }
      }
    },
    [config?.session.qr_timeout_sec, endSession, lang, place, postEvent, speak],
  )

  const submitTurn = useCallback(
    async (text: string, forcedSession?: string) => {
      const activeSession = forcedSession ?? sessionRef.current ?? startSession()
      lastActivity.current = Date.now()
      setGesturePrompt(false)
      setLastQuery(text)

      const lowered = text.toLowerCase()
      if (phaseRef.current === 'history' || phaseRef.current === 'tarihsky') {
        if (/дальше|forward|алға/.test(lowered)) setSceneReveal(100)
        if (/назад|back|артқа/.test(lowered)) setSceneReveal(0)
        if (/середин|middle|ортасы/.test(lowered)) setSceneReveal(50)
      }

      setPhase('thinking')
      try {
        const response = await api.dialogTurn({
          session_id: activeSession,
          lang: 'auto',
          text,
          context: {
            screen: phaseRef.current === 'history' ? 'tarihsky' : phaseRef.current,
            last_place_id: place?.id ?? null,
          },
        })

        setLang(response.lang)
        setAnswer(response.say)
        setSuggestions(response.suggestions)
        setRetryCount(0)
        void speak(response.say, response.lang)

        if (response.lang !== lang) {
          void api
            .getPlaces(response.lang)
            .then((catalogue) => {
              setPlaces(catalogue.places)
              writeCache(PLACES_CACHE, catalogue.places)
            })
            .catch(() => setOffline(true))
        }

        if (response.actions.length === 0) {
          setPhase(returnPhase === 'tarihsky' || returnPhase === 'history' ? 'history' : 'catalog')
          return
        }

        for (const action of response.actions) {
          await executeAction(action, activeSession, response.lang)
        }
      } catch (error) {
        if (error instanceof ApiError && (error.code === 'SPEECH_UNRECOGNIZED' || error.code === 'AI_UNAVAILABLE')) {
          const nextRetry = retryCount + 1
          setRetryCount(nextRetry)

          const message = copy.repeat
          setAnswer(message)
          setPhase('error')
          void speak(message, lang)
          return
        }

        setOffline(true)
        setAnswer(copy.offline)
        setPhase('catalog')
        void speak(copy.offline, lang)
      }
    },
    [copy, executeAction, lang, place?.id, retryCount, returnPhase, speak, startSession],
  )

  const beginListening = useCallback(() => {
    if (speakingRef.current) return
    if (!sessionRef.current) {
      startSession()
    }
    const current = phaseRef.current
    if (current === 'thinking' || current === 'processing' || current === 'qr' || current === 'listening' || current === 'recording') return
    setReturnPhase(current)
    setPhase('listening')
    lastActivity.current = Date.now()
    gesturePromptedRef.current = false
  }, [startSession])

  const handlePresence = useCallback(() => {
    if (!sessionRef.current) startSession()
    lastActivity.current = Date.now()
    gesturePromptedRef.current = false
  }, [startSession])

  const { db, permission } = useAmbientAudio({
    enabled: true,
    onPresence: handlePresence,
    onSpeech: beginListening,
  })

  const { interim, supported } = useSpeechRecognition({
    active: phase === 'listening' || phase === 'recording',
    language: speechLocale(lang),
    onComplete: (text) => {
      lastActivity.current = Date.now()
      gesturePromptedRef.current = false
      void submitTurn(text)
    },
    onNoSpeech: () => {
      // User is silent during listening turn
      // Note: gesture mode is requested only when 15s of silence pass
      setPhase('error')
      setAnswer(copy.repeat)
      void speak(copy.repeat, lang)
    },
  })

  // User interaction listener resets silence / idle timers
  useEffect(() => {
    const handleActivity = () => {
      lastActivity.current = Date.now()
      gesturePromptedRef.current = false
      if (phaseRef.current === 'gestures') {
        setPhase(returnPhase || 'catalog')
      }
    }

    window.addEventListener('pointerdown', handleActivity, { passive: true })
    window.addEventListener('touchstart', handleActivity, { passive: true })
    window.addEventListener('keydown', handleActivity, { passive: true })

    return () => {
      window.removeEventListener('pointerdown', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
      window.removeEventListener('keydown', handleActivity)
    }
  }, [returnPhase])

  // Silence timers:
  // 15 seconds of silence -> ask for sign language (gestures)
  // 25 seconds of silence -> sleep
  useEffect(() => {
    const timer = window.setInterval(() => {
      // While kiosk is speaking, don't count silence against user
      if (speakingRef.current) {
        if (!gesturePromptedRef.current) {
          lastActivity.current = Date.now()
        }
        return
      }

      if (phaseRef.current === 'sleep') return

      const elapsed = (Date.now() - lastActivity.current) / 1000

      if (elapsed >= 25) {
        // Sleep when silent for 25 seconds
        lastActivity.current = Date.now()
        gesturePromptedRef.current = false
        void endSession(true)
      } else if (elapsed >= 15 && !gesturePromptedRef.current && phaseRef.current !== 'gestures') {
        // Request sign language ONLY when silent for 15 seconds
        gesturePromptedRef.current = true
        setReturnPhase((current) => (current === 'gestures' ? 'catalog' : current))
        setPhase('gestures')
        setAnswer(copy.gesture)
        void speak(copy.gesture, lang)
      }
    }, 1000)

    return () => window.clearInterval(timer)
  }, [copy.gesture, endSession, lang, speak])

  // TarihSky Reveal Animation
  useEffect(() => {
    if (phase !== 'history' && phase !== 'tarihsky') return
    const started = performance.now()
    let frame = 0
    const promptTimer = window.setTimeout(() => void speak('Что ещё показать?', lang), 7000)
    const animate = (time: number) => {
      const progress = Math.min(100, ((time - started) / 6000) * 100)
      setSceneReveal(progress)
      if (progress < 100) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(promptTimer)
    }
  }, [lang, phase, scene?.place_id, speak])

  // QR countdown
  useEffect(() => {
    if (phase !== 'qr' || !qr) return
    const timer = window.setInterval(() => {
      setQrRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          setQr(null)
          setAnswer('Показать что-то ещё?')
          setPhase(place ? 'place' : 'catalog')
          void speak('Показать что-то ещё?', lang)
          return config?.session.qr_timeout_sec ?? 60
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [config?.session.qr_timeout_sec, lang, phase, place, qr, speak])

  // Demo URL Parameter Handler (?screen=route, ?screen=history, etc.)
  useEffect(() => {
    if (!isMockMode || !config || places.length === 0 || demoBooted.current) return
    const screenParam = new URLSearchParams(window.location.search).get('screen')
    if (!screenParam) return
    demoBooted.current = true
    const id = startSession()

    const screenMap: Record<string, () => void> = {
      sleep: () => setPhase('sleep'),
      greeting: () => setPhase('greeting'),
      listening: () => setPhase('listening'),
      thinking: () => setPhase('thinking'),
      place: () => void executeAction({ show: 'place', place_id: 2 }, id),
      route: () => void executeAction({ show: 'route', place_id: 2 }, id),
      history: () => void executeAction({ show: 'scene', place_id: 2 }, id),
      tarihsky: () => void executeAction({ show: 'scene', place_id: 2 }, id),
      qr: () => void executeAction({ show: 'qr', place_id: 2 }, id),
      variants: () => setPhase('variants'),
      nearby: () => setPhase('nearby'),
      help: () => setPhase('help'),
      farewell: () => setPhase('farewell'),
      error: () => setPhase('error'),
      gestures: () => setPhase('gestures'),
    }

    if (screenMap[screenParam]) {
      window.setTimeout(() => screenMap[screenParam](), 400)
    }
  }, [config, executeAction, places.length, startSession])

  // Quick place picker for pages
  const handleSelectPlace = useCallback(
    async (id: number) => {
      const activeSession = sessionRef.current ?? startSession()
      await executeAction({ show: 'place', place_id: id }, activeSession, lang)
    },
    [executeAction, lang, startSession],
  )

  const handleLanguageChange = useCallback((newLang: string) => {
    setLang(newLang)
    void api.getPlaces(newLang).then((catalogue) => {
      setPlaces(catalogue.places)
      writeCache(PLACES_CACHE, catalogue.places)
    })
  }, [])

  const toggleNextLang = useCallback(() => {
    const nextLang = lang === 'kk' ? 'ru' : lang === 'ru' ? 'en' : 'kk'
    handleLanguageChange(nextLang)
  }, [handleLanguageChange, lang])

  if (!config) {
    return (
      <div className="boot-screen">
        <div className="boot-mark">B</div>
        <span>BaGdar · Aktau</span>
      </div>
    )
  }

  // Active Place fallback
  const activePlace: PlaceDetail = place || {
    id: 2,
    name: 'Набережная 15-го микрорайона',
    category: 'park',
    lat: 43.662252,
    lng: 51.133075,
    thumb_url: '/media/waterfront-now.svg',
    photos: ['/media/waterfront-now.svg'],
    summary: 'Прогулочная зона вдоль моря. Променад расположен рядом с амфитеатром.',
    description: 'Прогулочная зона вдоль моря. Променад расположен рядом с амфитеатром.',
    address: 'Актау, набережная 15-го микрорайона',
    has_scene: true,
    hours: null,
    is_open_now: true,
    opens_next: null,
    access: 'walk',
    langs: ['kk', 'ru', 'en'],
  }

  // Active Route fallback
  const activeRoute: RouteResponse = route || mockRoutes[2] || {
    place_id: 2,
    mode: 'walk',
    distance_m: 510,
    duration_min: 7,
    bearing_deg: 342,
    direction_text: 'следуйте по набережной на северо-запад',
    is_approximate: false,
    geometry: {
      type: 'LineString',
      coordinates: [
        [51.1352, 43.6582],
        [51.1341, 43.6602],
        [51.133075, 43.662252],
      ],
    },
    steps: [{ instruction: 'Следуйте по набережной', distance_m: 510 }],
  }

  const activeScene: SceneResponse = scene || mockScene
  const activeQr: QrResponse = qr || {
    url: 'https://bagdar.kz/route/2?token=demo',
    payload_version: 1,
    expires_in_sec: 60,
  }

  return (
    <div className={`app phase-${phase} ${speaking ? 'is-speaking' : ''}`}>
      {/* Brand Header */}
      <Brand
        screenId={config.screen_id}
        lang={lang}
        live={!offline}
        onToggleLang={toggleNextLang}
      />

      {offline && <div className="network-banner">{copy.offline}</div>}

      {/* 14 Distinct Screens in Unified Liquid Glass Aesthetic */}
      {(() => {
        switch (phase) {
          case 'sleep':
          case 'idle':
            return (
              <PageSleep
                copy={copy}
                onWake={() => {
                  startSession()
                  setPhase('greeting')
                }}
              />
            )

          case 'greeting':
            return (
              <PageGreeting
                copy={copy}
                onStartListening={beginListening}
                onSelectPrompt={(text) => void submitTurn(text)}
              />
            )

          case 'listening':
          case 'recording':
            return (
              <PageListening
                copy={copy}
                db={db}
                transcript={interim}
                lang={lang}
              />
            )

          case 'thinking':
          case 'processing':
            return (
              <PageThinking
                copy={copy}
                query={lastQuery}
              />
            )

          case 'place':
          case 'card':
            return (
              <PagePlace
                config={config}
                places={places}
                place={activePlace}
                route={activeRoute}
                copy={copy}
                onOpenRoute={() => setPhase('route')}
                onOpenHistory={() => {
                  void executeAction({ show: 'scene', place_id: activePlace.id }, sessionRef.current ?? startSession(), lang)
                }}
                onOpenQr={() => {
                  void executeAction({ show: 'qr', place_id: activePlace.id }, sessionRef.current ?? startSession(), lang)
                }}
                onBack={() => setPhase('catalog')}
              />
            )

          case 'route':
            return (
              <PageRoute
                config={config}
                places={places}
                place={activePlace}
                route={activeRoute}
                copy={copy}
                onOpenQr={() => {
                  void executeAction({ show: 'qr', place_id: activePlace.id }, sessionRef.current ?? startSession(), lang)
                }}
                onBack={() => setPhase('place')}
              />
            )

          case 'history':
          case 'tarihsky':
            return (
              <PageHistory
                scene={activeScene}
                lang={lang}
                copy={copy}
                initialReveal={sceneReveal || 50}
                onBack={() => setPhase('place')}
              />
            )

          case 'qr':
            return (
              <PageQr
                qr={activeQr}
                place={activePlace}
                remaining={qrRemaining}
                copy={copy}
                onBack={() => setPhase('place')}
              />
            )

          case 'variants':
            return (
              <PageVariants
                places={places}
                copy={copy}
                onSelectPlace={handleSelectPlace}
              />
            )

          case 'nearby':
            return (
              <PageNearby
                config={config}
                places={places}
                copy={copy}
                onSelectPlace={handleSelectPlace}
              />
            )

          case 'help':
            return (
              <PageHelp
                copy={copy}
                onSelectPrompt={(text) => void submitTurn(text)}
              />
            )

          case 'farewell':
            return (
              <PageFarewell
                copy={copy}
                onReturnToSleep={() => setPhase('sleep')}
              />
            )

          case 'error':
          case 'error_speech':
            return (
              <PageError
                copy={copy}
                retryCount={retryCount || 1}
                onRetry={beginListening}
                onSelectPlace={handleSelectPlace}
              />
            )

          case 'gestures':
            return (
              <PageGestures
                copy={copy}
                onGestureRecognized={(sign) => {
                  lastActivity.current = Date.now()
                  gesturePromptedRef.current = false
                  void speak(`Принят жест: ${sign}`, lang)
                  if (sign.includes('Вариант 1')) void handleSelectPlace(1)
                  else if (sign.includes('Вариант 2')) void handleSelectPlace(2)
                  else if (sign.includes('Телефон')) setPhase('qr')
                  else if (sign.includes('Стоп')) setPhase('sleep')
                  else setPhase('catalog')
                }}
              />
            )

          case 'catalog':
          default:
            return (
              <CatalogScreen
                config={config}
                places={places}
                phase={phase}
                db={db}
                transcript={interim}
                answer={answer}
                copy={copy}
                suggestions={suggestions}
                gesturePrompt={gesturePrompt}
                onSelectPlace={handleSelectPlace}
              />
            )
        }
      })()}

      {/* Telemetry line */}
      <div className="system-line">
        <span>{isMockMode ? 'LOCAL CONTRACT' : 'LIVE API'}</span>
        <i />
        <span>{permission === 'ready' ? `${Math.round(db)} dB` : permission === 'denied' ? 'MIC OFF' : 'MIC…'}</span>
        <i />
        <span>{supported ? 'VOICE READY' : 'VOICE FALLBACK'}</span>
        <i />
        <span>GESTURES READY</span>
      </div>
    </div>
  )
}
