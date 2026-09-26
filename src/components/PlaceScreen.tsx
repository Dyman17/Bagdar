import type { Copy } from '../i18n'
import type { Config, PlaceDetail, PlaceSummary, RouteResponse } from '../types'
import { MapView } from './MapView'

interface Props {
  config: Config
  places: PlaceSummary[]
  place: PlaceDetail
  route: RouteResponse
  copy: Copy
  onOpenRoute?: () => void
  onOpenHistory?: () => void
  onOpenQr?: () => void
  onBack?: () => void
}

function formatDistance(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)} км` : `${value} м`
}

export function PlaceScreen({
  config,
  places,
  place,
  route,
  copy,
  onOpenRoute,
  onOpenHistory,
  onOpenQr,
  onBack,
}: Props) {
  const arrowRotation = route.bearing_deg - config.origin.heading_deg
  const hoursText =
    place.hours === null
      ? copy.always
      : place.is_open_now
        ? place.hours
        : `${copy.closed}${place.opens_next ? ` · ${place.opens_next}` : ''}`

  return (
    <main className="place-screen screen-enter">
      <div
        className="place-photo"
        style={{ backgroundImage: `url(${place.photos[0] || place.thumb_url})` }}
      >
        <div className="photo-shade" />
        <div className="photo-label">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="photo-category-tag">{place.category.toUpperCase()}</span>
            <span className="photo-access-tag">
              {place.access === 'transit' ? '🚙 ТРАНЗИТ / ТУР' : '🚶 ПЕШКОМ'}
            </span>
          </div>
          <b>ID: 0{place.id}</b>
        </div>

        <section className="place-copy">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={`open-state ${place.is_open_now ? '' : 'is-closed'}`}>{hoursText}</span>
            {place.has_scene && <span className="tarihsky-badge">🏛️ TARIHSKY 3D</span>}
          </div>

          <h1>{place.name}</h1>
          <p>{place.description || place.summary}</p>
          <small>{place.address}</small>

          {/* Touch-friendly Action Buttons */}
          <div className="place-actions-row">
            <button
              type="button"
              className="kiosk-action-btn btn-route"
              onClick={onOpenRoute}
              title="Открыть карту маршрута"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              <span>{copy.walk}</span>
            </button>

            {place.has_scene && (
              <button
                type="button"
                className="kiosk-action-btn btn-history"
                onClick={onOpenHistory}
                title="Историческая реконструкция"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>TarihSky</span>
              </button>
            )}

            <button
              type="button"
              className="kiosk-action-btn btn-qr"
              onClick={onOpenQr}
              title="QR на телефон"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>{copy.phonePrompt}</span>
            </button>

            <button
              type="button"
              className="kiosk-action-btn btn-back"
              onClick={onBack}
              title="Вернуться к каталогу"
            >
              <span>◀ Каталог</span>
            </button>
          </div>
        </section>
      </div>

      <section className="route-pane">
        <MapView config={config} places={places} selected={place} route={route} compact />
        <div className="route-glass glass-panel">
          <div className="route-topline">
            <span>{route.mode === 'transit' ? copy.transit : copy.walk}</span>
            {route.is_approximate && <strong>{copy.approximate}</strong>}
          </div>
          <div className="route-metrics">
            <div>
              <b>{formatDistance(route.distance_m)}</b>
              <span>{copy.distance}</span>
            </div>
            <i />
            <div>
              <b>{route.duration_min} мин</b>
              <span>{copy.duration}</span>
            </div>
          </div>
          <div className="direction-row">
            <div className="direction-compass">
              <span style={{ transform: `rotate(${arrowRotation}deg)` }}>
                <svg viewBox="0 0 54 54" aria-hidden="true">
                  <path d="m27 5 9.5 38L27 36l-9.5 7Z" />
                </svg>
              </span>
            </div>
            <div>
              <small>{copy.direction}</small>
              <strong>{route.direction_text}</strong>
            </div>
          </div>
          {route.steps[0] && <div className="route-step">{route.steps[0].instruction}</div>}
        </div>
        <div className="route-prompt">
          {place.has_scene ? copy.routePrompt : copy.phonePrompt}
        </div>
      </section>
    </main>
  )
}

