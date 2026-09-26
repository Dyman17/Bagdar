import type { Copy } from '../../i18n'

interface Props {
  copy: Copy
  retryCount?: number
  onRetry?: () => void
  onSelectPlace?: (placeId: number) => void
}

export function PageError({ copy, retryCount = 1, onRetry, onSelectPlace }: Props) {
  const quickOptions = [
    { id: 1, name: 'Амфитеатр' },
    { id: 2, name: 'Набережная 15-го мкр' },
    { id: 3, name: 'Смотровая площадка' },
  ]

  return (
    <main className="kiosk-fullscreen-stage error-screen screen-enter">
      <div className="error-halo" onClick={onRetry} style={{ cursor: 'pointer' }}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" />
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      </div>

      <div className="error-retry-badge">
        <span>Попытка {retryCount} из 2</span>
      </div>

      <div className="hero-copy" style={{ textAlign: 'center' }}>
        <h1 className="screen-headline" style={{ fontSize: 'clamp(46px, 4.2vw, 72px)' }}>
          {copy.errorTitle}
        </h1>
        <p style={{ maxWidth: '620px', margin: '18px auto 0', color: 'var(--muted)' }}>
          {copy.errorSubtitle}
        </p>
      </div>

      <div className="greeting-suggestions" style={{ marginTop: '34px' }}>
        {quickOptions.map((opt) => (
          <button
            key={opt.id}
            className="suggestion-pill glass-panel"
            onClick={() => onSelectPlace?.(opt.id)}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </main>
  )
}
