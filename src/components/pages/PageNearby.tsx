import { MapView } from '../MapView'
import type { Config, PlaceSummary } from '../../types'
import type { Copy } from '../../i18n'

interface Props {
  config: Config
  places: PlaceSummary[]
  copy: Copy
  onSelectPlace?: (placeId: number) => void
}

export function PageNearby({ config, places, copy, onSelectPlace }: Props) {
  const nearbyPlaces = places.slice(0, 5)

  return (
    <main className="nearby-screen screen-enter">
      <section className="nearby-left-pane">
        <span className="eyebrow">
          <i />
          {copy.eyebrow}
        </span>
        <h1 className="screen-headline" style={{ fontSize: 'clamp(44px, 3.8vw, 68px)' }}>
          {copy.nearbyTitle}
        </h1>
        <p style={{ maxWidth: '540px', margin: '16px 0 0', color: 'var(--muted)', fontSize: '15px' }}>
          {copy.nearbySubtitle}
        </p>

        <div className="nearby-cards-stack">
          {nearbyPlaces.map((place, i) => (
            <div
              key={place.id}
              className="nearby-card-row glass-panel"
              onClick={() => onSelectPlace?.(place.id)}
            >
              <div
                className="nearby-row-thumb"
                style={{ backgroundImage: `url(${place.thumb_url})` }}
              />
              <div className="nearby-row-info">
                <h4>{place.name}</h4>
                <span>{place.summary}</span>
              </div>
              <div className="nearby-row-dist">
                {`${(i + 1) * 120} м`}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="nearby-right-map">
        <MapView config={config} places={places} />
      </section>
    </main>
  )
}
