import type { PlaceSummary } from '../../types'
import type { Copy } from '../../i18n'

interface Props {
  places: PlaceSummary[]
  copy: Copy
  onSelectPlace?: (placeId: number) => void
}

export function PageVariants({ places, copy, onSelectPlace }: Props) {
  const displayPlaces = places.slice(0, 3)

  return (
    <main className="kiosk-fullscreen-stage variants-screen screen-enter">
      <div className="variants-header">
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          <i />
          {copy.eyebrow}
          <i />
        </span>
        <h1 className="screen-headline" style={{ fontSize: 'clamp(46px, 4.4vw, 76px)' }}>
          {copy.variantsTitle}
        </h1>
        <p style={{ maxWidth: '620px', margin: '18px auto 0', color: 'var(--muted)' }}>
          {copy.variantsSubtitle}
        </p>
      </div>

      <div className="variants-grid">
        {displayPlaces.map((place, index) => (
          <div
            key={place.id}
            className="variant-card glass-panel"
            onClick={() => onSelectPlace?.(place.id)}
          >
            <div
              className="variant-thumb"
              style={{ backgroundImage: `url(${place.thumb_url})` }}
            >
              <span className="variant-badge">{place.category}</span>
            </div>
            <span className="variant-num">0{index + 1}</span>
            <h3>{place.name}</h3>
            <p>{place.summary}</p>
            <div className="variant-footer">
              <span>{place.access === 'transit' ? copy.transit : copy.walk}</span>
              <span>43°39′ N</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
