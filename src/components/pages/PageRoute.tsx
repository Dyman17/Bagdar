import { MapView } from '../MapView'
import type { Config, PlaceDetail, PlaceSummary, RouteResponse } from '../../types'
import type { Copy } from '../../i18n'

interface Props {
  config: Config
  places: PlaceSummary[]
  place: PlaceDetail
  route: RouteResponse
  copy: Copy
  onBack?: () => void
  onOpenQr?: () => void
}

function formatDistance(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)} км` : `${value} м`
}

export function PageRoute({ config, places, place, route, copy, onBack, onOpenQr }: Props) {
  const arrowRotation = route.bearing_deg - config.origin.heading_deg

  return (
    <main className="route-pane screen-enter" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <MapView config={config} places={places} selected={place} route={route} />

      <div className="route-glass glass-panel" style={{ bottom: '48px', right: '48px', maxWidth: '580px' }}>
        <div className="route-topline">
          <span>{route.mode === 'transit' ? copy.transit : copy.walk} · {place.name}</span>
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

        <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
          {onOpenQr && (
            <button
              type="button"
              className="kiosk-action-btn btn-qr"
              onClick={onOpenQr}
              style={{ padding: '9px 16px', fontSize: '10px' }}
            >
              📱 {copy.phonePrompt}
            </button>
          )}
          {onBack && (
            <button
              type="button"
              className="kiosk-action-btn btn-back"
              onClick={onBack}
              style={{ padding: '9px 16px', fontSize: '10px' }}
            >
              ◀ Назад
            </button>
          )}
        </div>
      </div>

      <div className="route-prompt">
        {place.has_scene ? copy.routePrompt : copy.phonePrompt}
      </div>
    </main>
  )
}

