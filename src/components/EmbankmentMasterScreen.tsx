import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Navigation,
  History,
  QrCode,
  Footprints,
  Wind,
  MapPin,
  Mic,
  ArrowRight,
  Volume2,
  Clock,
  Compass,
  Check,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import type { Place, RouteResponse, SceneResponse, QrResponse } from '../types';
import { fetchRoute, fetchScene, fetchQr } from '../api';
import { speakText, stopSpeaking } from '../utils/tts';
import { VoiceWave } from './ui/VoiceWave';

interface EmbankmentMasterScreenProps {
  places: Place[];
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  onVoicePrompt?: (text: string) => void;
}

export const EmbankmentMasterScreen: React.FC<EmbankmentMasterScreenProps> = ({
  places,
  currentLang,
  onLanguageChange,
  onVoicePrompt,
}) => {
  // Theme: Light (Limestone & Sand) or Dark (Caspian Basalt & Slate)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Current active place on the embankment
  const [selectedPlaceId, setSelectedPlaceId] = useState<number>(() => places[0]?.id || 1);

  useEffect(() => {
    if (places.length > 0 && !places.some((p) => p.id === selectedPlaceId)) {
      setSelectedPlaceId(places[0].id);
    }
  }, [places, selectedPlaceId]);

  const activePlace: Place = places.find((p) => p.id === selectedPlaceId) || places[0] || {
    id: 1,
    name: 'Амфитеатр',
    category: 'culture',
    lat: 43.661365,
    lng: 51.132965,
    thumb_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    summary: 'Каспий жағасындағы ашық сахна және басты мәдени алаң.',
    has_scene: true,
    access: 'walk',
    hours: null,
  };

  // Modals & sub-panels
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'route' | 'history' | 'qr'>('none');
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [sceneData, setSceneData] = useState<SceneResponse | null>(null);
  const [qrData, setQrData] = useState<QrResponse | null>(null);
  const [historySlider, setHistorySlider] = useState<number>(50);
  const [isListeningActive, setIsListeningActive] = useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');

  // Clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateStr = currentTime.toLocaleDateString(
    currentLang === 'kk' ? 'kk-KZ' : currentLang === 'en' ? 'en-US' : 'ru-RU',
    {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }
  );

  // Active place localized texts
  const localized = activePlace.texts?.[currentLang] || {
    name: activePlace.name,
    summary: activePlace.summary,
    description: activePlace.description || activePlace.summary,
    address: activePlace.address || 'Ақтау, 15-шағынаудан жағалауы',
  };

  // Actions
  const handleOpenRoute = async () => {
    try {
      const r = await fetchRoute(activePlace.id, currentLang);
      setRouteData(r);
      setActiveOverlay('route');
    } catch {
      setActiveOverlay('route');
    }
  };

  const handleOpenHistory = async () => {
    try {
      const s = await fetchScene(activePlace.id);
      setSceneData(s);
      setActiveOverlay('history');
    } catch {
      setActiveOverlay('history');
    }
  };

  const handleOpenQr = async () => {
    try {
      const q = await fetchQr(activePlace.id, currentLang, 'sess-master');
      setQrData(q);
      setActiveOverlay('qr');
    } catch {
      setActiveOverlay('qr');
    }
  };

  // Voice simulation
  const handleTriggerVoice = (promptText?: string) => {
    if (promptText) {
      setSpeechTranscript(promptText);
      setIsListeningActive(false);
      onVoicePrompt?.(promptText);

      const matched = places.find(
        (p) =>
          p.name.toLowerCase().includes(promptText.toLowerCase()) ||
          promptText.toLowerCase().includes(p.name.toLowerCase())
      );
      if (matched) {
        setSelectedPlaceId(matched.id);
      }
    } else {
      setIsListeningActive((prev) => !prev);
    }
  };

  // Speak place summary
  const handleSpeakSummary = () => {
    const textToSpeak = `${localized.name}. ${localized.summary}`;
    speakText(textToSpeak, currentLang);
  };

  // Cycle language on click (single index display)
  const handleCycleLang = () => {
    const nextLang = currentLang === 'kk' ? 'ru' : currentLang === 'ru' ? 'en' : 'kk';
    onLanguageChange(nextLang);
  };

  return (
    <div className={`embankment-screen-root theme-${theme}`}>
      {/* 0. COASTAL TOPOGRAPHY & MARITIME ISOLINES BACKGROUND */}
      <div className="embankment-bg-topography" aria-hidden="true">
        <svg className="topography-svg" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          {/* Coastal Bathymetric Contours */}
          <path
            d="M-50 200 C 280 140, 560 300, 1020 160 C 1220 110, 1380 230, 1500 200"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            className="topo-path-subtle"
          />
          <path
            d="M-50 340 C 220 270, 700 450, 1000 290 C 1300 170, 1480 340, 1550 310"
            stroke="currentColor"
            strokeWidth="2"
            className="topo-path-main"
          />
          <path
            d="M-50 500 C 300 400, 620 580, 1140 430 C 1340 370, 1480 490, 1550 460"
            stroke="currentColor"
            strokeWidth="2"
            className="topo-path-bold"
          />
          <path
            d="M-50 670 C 180 570, 750 750, 1100 580 C 1300 480, 1480 610, 1550 600"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            className="topo-path-subtle"
          />

          {/* Grid Latitude / Longitude lines */}
          <line x1="220" y1="0" x2="220" y2="900" stroke="currentColor" strokeWidth="1" strokeDasharray="3 7" className="topo-grid-line" />
          <line x1="720" y1="0" x2="720" y2="900" stroke="currentColor" strokeWidth="1" strokeDasharray="3 7" className="topo-grid-line" />
          <line x1="1220" y1="0" x2="1220" y2="900" stroke="currentColor" strokeWidth="1" strokeDasharray="3 7" className="topo-grid-line" />

          {/* Aktau Waterfront Coordinates Mark */}
          <text x="36" y="865" className="topo-coord-mark">
            43°39'41"N · 51°09'18"E · AKTAU CASPIAN PROMENADE
          </text>
        </svg>
      </div>

      {/* 1. TOP STATUS BAR (High-contrast plate with dark outlines) */}
      <header className="embankment-header">
        {/* Brand & Location */}
        <div className="embankment-brand-block">
          <span className="embankment-brand-name">BAĠDAR</span>
          <span className="embankment-brand-sep">/</span>
          <span className="embankment-brand-location">АКТАУ · НАБЕРЕЖНАЯ</span>
        </div>

        {/* Caspian Marine Weather & Current Local Time */}
        <div className="embankment-marine-weather">
          <div className="weather-pill">
            <Wind size={15} />
            <span>4 м/с</span>
            <span className="divider">·</span>
            <span>Су +21°C</span>
            <span className="divider">·</span>
            <span>Ауа +26°C</span>
          </div>

          <div className="clock-pill">
            <Clock size={14} />
            <span className="clock-time">{timeStr}</span>
            <span className="clock-date">{dateStr}</span>
          </div>
        </div>

        {/* Controls: Single AI Language Index Badge & Theme Switcher */}
        <div className="embankment-top-controls">
          {/* Single AI Speech Language Badge */}
          <button
            type="button"
            onClick={handleCycleLang}
            className="ai-lang-badge"
            title="AI сөйлесу тілі (басып ауыстыру) / Язык речи ИИ"
          >
            <Globe size={14} />
            <span className="ai-lang-label">AI ТІЛ:</span>
            <span className="ai-lang-code">{currentLang.toUpperCase()}</span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            className="theme-toggle-btn"
            title={theme === 'light' ? 'Қараңғы тақырыпқа ауысу' : 'Жарық тақырыпқа ауысу'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span className="theme-toggle-text">{theme === 'light' ? 'ТҮН' : 'КҮН'}</span>
          </button>
        </div>
      </header>

      {/* 2. PROMENADE PLACES SELECTOR (Architectural Plate with Dark Contours) */}
      <nav className="embankment-places-strip" aria-label="Орындар тізімі">
        {places.map((p) => {
          const isSelected = p.id === activePlace.id;
          const pName = p.texts?.[currentLang]?.name || p.name;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                stopSpeaking();
                setSelectedPlaceId(p.id);
                setActiveOverlay('none');
              }}
              className={`strip-place-tab ${isSelected ? 'is-selected' : ''}`}
            >
              <div className="strip-tab-thumb-wrap">
                <img src={p.thumb_url} alt={pName} className="strip-tab-thumb" />
              </div>
              <span className="strip-tab-title">{pName}</span>
              {isSelected && (
                <motion.div
                  layoutId="active-strip-indicator"
                  className="strip-tab-indicator"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. CENTER HERO MONOGRAPH (Clean Architectural Monograph Card) */}
      <main className="embankment-hero-stage">
        <motion.div
          key={activePlace.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="embankment-monograph-card"
        >
            {/* Left Column: Authentic Photography with Dark Contours */}
            <div className="monograph-photo-column">
              <div className="monograph-photo-wrapper">
                <img
                  src={activePlace.thumb_url}
                  alt={localized.name}
                  className="monograph-photo"
                />

                {/* Direct Functional Navigation Badge */}
                <button
                  type="button"
                  onClick={handleOpenRoute}
                  className="monograph-photo-badge"
                  title="Бағытты көру"
                >
                  <MapPin size={13} />
                  <span>{activePlace.category === 'culture' ? 'Мәдени орын' : 'Жағалау'}</span>
                </button>
              </div>

              {/* Functional Clickable Metrics (Opens Route) */}
              <div className="monograph-metrics-row">
                <button
                  type="button"
                  onClick={handleOpenRoute}
                  className="meta-action-pill"
                  title="Қашықтықты көру"
                >
                  <Footprints size={14} />
                  <span>~850 м · 11 мин жаяу</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenRoute}
                  className="meta-action-pill"
                  title="Бағытты қарау"
                >
                  <Compass size={14} />
                  <span>СҚО бағыты</span>
                </button>
              </div>
            </div>

            {/* Right Column: Title, Functional Narrative, and Core Buttons */}
            <div className="monograph-details-column">
              {/* Header: Title & Audio Narration Trigger */}
              <div className="monograph-header-row">
                <h1 className="monograph-title">{localized.name}</h1>

                <button
                  type="button"
                  onClick={handleSpeakSummary}
                  className="audio-read-btn"
                  title="Дыбыстап оқу / Озвучить"
                >
                  <Volume2 size={20} />
                </button>
              </div>

              {/* Direct Concise Summary (No generic marketing filler) */}
              <p className="monograph-summary">{localized.summary}</p>

              {/* Functional Address Button (Opens Route) */}
              <button
                type="button"
                onClick={handleOpenRoute}
                className="monograph-address-btn"
                title="Орналасқан жерін картадан көру"
              >
                <MapPin size={15} className="shrink-0" />
                <span>{localized.address}</span>
              </button>

              {/* The 3 Core Functional Buttons (High Contrast & Clear Purpose) */}
              <div className="monograph-actions-row">
                <button
                  type="button"
                  onClick={handleOpenRoute}
                  className="btn-action-primary"
                >
                  <Navigation size={18} />
                  <span>Бағытты көру</span>
                  <ArrowRight size={16} className="ml-1 opacity-80" />
                </button>

                {activePlace.has_scene && (
                  <button
                    type="button"
                    onClick={handleOpenHistory}
                    className="btn-action-secondary"
                  >
                    <History size={18} />
                    <span>TarihSky 1968</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleOpenQr}
                  className="btn-action-outline"
                >
                  <QrCode size={18} />
                  <span>Телефонға алу</span>
                </button>
              </div>
            </div>
          </motion.div>
      </main>

      {/* 4. BOTTOM DOCK — VOICE CONTROL & QUICK ACTION CHIPS */}
      <footer className="embankment-voice-dock">
        <div className="voice-dock-inner">
          {/* Tactile Mic Trigger */}
          <button
            type="button"
            onClick={() => handleTriggerVoice()}
            className={`voice-mic-trigger ${isListeningActive ? 'is-active' : ''}`}
            title="Дауыспен басқару"
          >
            <Mic size={22} />
          </button>

          {/* Voice Status & Active Input */}
          <div className="voice-status-block">
            {isListeningActive ? (
              <div className="flex items-center gap-3">
                <VoiceWave active={true} bars={16} />
                <span className="voice-status-text active">
                  {currentLang === 'kk' ? 'Тыңдап тұрмын...' : 'Слушаю вас...'}
                </span>
              </div>
            ) : (
              <div className="voice-status-content">
                <span className="voice-hint-title">
                  {speechTranscript ? `«${speechTranscript}»` : (currentLang === 'kk' ? 'Дауыспен сұраңыз:' : 'Спросите голосом:')}
                </span>
              </div>
            )}
          </div>

          {/* Quick Action Destination Chips */}
          <div className="voice-quick-chips">
            {[
              { id: 'rock', kk: 'Скальная тропа', ru: 'Скальная тропа', en: 'Rock Trail' },
              { id: 'light', kk: 'Маяк', ru: 'Маяк', en: 'Lighthouse' },
              { id: 'sunset', kk: 'Күн батуы', ru: 'Закат на море', en: 'Sunset' },
            ].map((chip) => {
              const chipLabel = chip[currentLang as keyof typeof chip] || chip.ru;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleTriggerVoice(chipLabel)}
                  className="voice-quick-chip"
                >
                  <span>{chipLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </footer>

      {/* 5. INTEGRATED MODAL DIALOGS (Route / TarihSky / QR) */}
      <AnimatePresence>
        {activeOverlay !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="embankment-modal-backdrop"
            onClick={() => setActiveOverlay('none')}
          >
            <motion.div
              initial={{ y: 24, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 16, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="embankment-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="modal-dialog-header">
                <div className="flex items-center gap-3">
                  <span className="modal-type-badge">
                    {activeOverlay === 'route'
                      ? 'МАРШРУТ'
                      : activeOverlay === 'history'
                      ? 'TARIHSKY · 1968'
                      : 'QR КОД'}
                  </span>
                  <h3 className="modal-title">{localized.name}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveOverlay('none')}
                  className="modal-close-btn"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="modal-dialog-body">
                {activeOverlay === 'route' && (
                  <div className="modal-route-layout">
                    <div className="route-summary-box">
                      <div className="route-metric">
                        <Footprints size={20} />
                        <div>
                          <div className="metric-value">{routeData?.distance_m || 850} м</div>
                          <div className="metric-label">қашықтық</div>
                        </div>
                      </div>

                      <div className="route-metric">
                        <Clock size={20} />
                        <div>
                          <div className="metric-value">~{routeData?.duration_min || 11} мин</div>
                          <div className="metric-label">жаяу уақыт</div>
                        </div>
                      </div>
                    </div>

                    <div className="route-step-card">
                      <div className="step-num">1</div>
                      <p className="step-instruction">
                        {routeData?.direction_text ||
                          'Идите вдоль набережной 15-го микрорайона на северо-восток в сторону моря.'}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleOpenQr}
                        className="btn-action-primary"
                      >
                        <QrCode size={16} />
                        <span>Телефонға жіберу</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeOverlay === 'history' && (
                  <div className="modal-history-layout">
                    <div className="modal-split-box">
                      <div className="split-img-layer modern">
                        <img
                          src={sceneData?.modern_url || activePlace.thumb_url}
                          alt="Сегодня"
                          className="split-img"
                        />
                        <span className="split-tag right">Бүгін</span>
                      </div>

                      <div
                        className="split-img-layer historic"
                        style={{ clipPath: `inset(0 ${100 - historySlider}% 0 0)` }}
                      >
                        <img
                          src={
                            sceneData?.historic_url ||
                            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85'
                          }
                          alt="1968"
                          className="split-img grayscale"
                        />
                        <span className="split-tag left">1968 жыл</span>
                      </div>

                      <div className="split-handle-line" style={{ left: `${historySlider}%` }}>
                        <div className="split-handle-knob">◀ ▶</div>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={historySlider}
                        onChange={(e) => setHistorySlider(Number(e.target.value))}
                        className="split-slider-input"
                      />
                    </div>

                    <p className="modal-history-text">
                      {sceneData?.texts?.[currentLang]?.body ||
                        '1968 жылы Ақтау қаласының Каспий жағалауында ақ ұлутастан (ракушечник) жасалған бірегей сәулеттік кешендер мен теңізге түсетін каскадты баспалдақтар салынды.'}
                    </p>
                  </div>
                )}

                {activeOverlay === 'qr' && (
                  <div className="modal-qr-layout">
                    <div className="modal-qr-box">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                          qrData?.url || `https://bagdar.kz/route/${activePlace.id}`
                        )}&bgcolor=FFFFFF&color=111315&margin=1`}
                        alt="QR код"
                        className="modal-qr-code"
                      />
                      <span className="qr-caption">Смартфон камерасын бағыттаңыз</span>
                    </div>

                    <div className="modal-qr-desc">
                      <h4>{localized.name}</h4>
                      <p>Маршрут телефон браузерінде қосымшасыз ашылады.</p>
                      <div className="flex items-center gap-2 mt-4 text-xs font-semibold">
                        <Check size={16} className="text-emerald-500" />
                        <span>Навигация мен қадамдық бағыт</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
