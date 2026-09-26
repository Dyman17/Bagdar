import { useState } from 'react'
import { MapView } from './MapView'
import { VoiceHalo } from './VoiceHalo'
import type { Config, KioskPhase, PlaceSummary } from '../types'
import type { Copy } from '../i18n'

interface Props {
  config: Config
  places: PlaceSummary[]
  phase: KioskPhase
  db: number
  transcript: string
  answer: string
  copy: Copy
  suggestions: { id: number; name: string }[]
  gesturePrompt: boolean
  onSelectPlace?: (placeId: number) => void
}

const CATEGORY_TABS = [
  { id: 'all', label: 'Все' },
  { id: 'city', label: '🏛️ Город', match: ['culture', 'history', 'religion', 'mall'] },
  { id: 'mangystau', label: '🏔️ Мангистау', match: ['nature'] },
  { id: 'beach', label: '🏖️ Пляжи', match: ['park'] },
  { id: 'food', label: '🍽️ Где поесть', match: ['food'] },
  { id: 'hotel', label: '🏨 Отели', match: ['hotel'] },
  { id: 'tour', label: '🚙 Туры', match: ['tour'] },
]

const QUICK_PICKS = [
  { id: 3, label: '🌊 Скальная тропа' },
  { id: 101, label: '🏔️ Бозжыра' },
  { id: 102, label: '⚪ Долина шаров' },
  { id: 104, label: '🏛️ Шакпак-ата' },
  { id: 201, label: '🍽️ Ethno Ungir' },
  { id: 202, label: '🍖 Дядя Гадим' },
  { id: 301, label: '🏨 Rixos Aktau' },
]

export function CatalogScreen({
  config,
  places,
  phase,
  db,
  transcript,
  answer,
  copy,
  suggestions,
  gesturePrompt,
  onSelectPlace,
}: Props) {
  const [selectedCat, setSelectedCat] = useState('all')

  const voiceLabel = phase === 'recording'
    ? copy.listening
    : phase === 'processing'
      ? copy.processing
      : phase === 'error_speech'
        ? copy.repeat
        : copy.prompt

  const filteredPlaces = places.filter((p) => {
    if (selectedCat === 'all') return true
    const tab = CATEGORY_TABS.find((t) => t.id === selectedCat)
    if (tab?.match) return tab.match.includes(p.category)
    return p.category === selectedCat
  })

  return (
    <main className="catalog-screen screen-enter">
      <div className="catalog-map">
        <MapView config={config} places={places} />
      </div>
      <div className="catalog-wash" />
      <section className="catalog-content">
        <div className="hero-copy">
          <span className="eyebrow"><i />{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{answer || copy.prompt}</p>

          {/* Quick research highlights */}
          <div className="catalog-quick-chips">
            {QUICK_PICKS.map((q) => (
              <button
                key={q.id}
                type="button"
                className="quick-chip"
                onClick={() => onSelectPlace?.(q.id)}
              >
                {q.label}
              </button>
            ))}
          </div>

          {suggestions.length > 0 && (
            <div className="spoken-list" aria-label="Предложенные места">
              {suggestions.map((item, index) => (
                <span
                  key={item.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectPlace?.(item.id)}
                >
                  <b>{String(index + 1).padStart(2, '0')}</b>{item.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <VoiceHalo phase={phase} db={db} label={voiceLabel} transcript={transcript} />
      </section>

      <aside className="catalog-index glass-panel">
        <div className="index-head">
          <span>{copy.nearby}</span>
          <b>{String(filteredPlaces.length).padStart(2, '0')}</b>
        </div>

        {/* Categories Tab Selector */}
        <div className="catalog-categories">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`category-chip ${selectedCat === tab.id ? 'is-active' : ''}`}
              onClick={() => setSelectedCat(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="index-flow" style={{ maxHeight: '42vh', overflowY: 'auto' }}>
          {filteredPlaces.map((place) => (
            <div
              className="index-row"
              key={place.id}
              onClick={() => onSelectPlace?.(place.id)}
              style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '12px', alignItems: 'center' }}
            >
              <img
                src={place.thumb_url || '/static/places/placeholder.svg'}
                alt={place.name}
                className="index-thumb"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none'
                }}
              />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{place.name}</strong>
                  <span style={{ fontSize: '9px', opacity: 0.6, textTransform: 'uppercase' }}>
                    {place.access === 'transit' ? '🚙 ТУР' : '🚶 ПЕШКОМ'}
                  </span>
                </div>
                <small>{place.summary}</small>
              </div>
            </div>
          ))}
        </div>
        <div className="index-note">Нажмите на карточку любого места, чтобы открыть маршрут и фото</div>
      </aside>

      {gesturePrompt && <div className="gesture-prompt glass-panel">{copy.gesture}</div>}
    </main>
  )
}

