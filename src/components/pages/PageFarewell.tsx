import { useEffect } from 'react'
import type { Copy } from '../../i18n'

interface Props {
  copy: Copy
  onReturnToSleep?: () => void
}

export function PageFarewell({ copy, onReturnToSleep }: Props) {
  useEffect(() => {
    if (!onReturnToSleep) return
    const timer = window.setTimeout(onReturnToSleep, 3500)
    return () => window.clearTimeout(timer)
  }, [onReturnToSleep])

  return (
    <main className="kiosk-fullscreen-stage farewell-screen screen-enter">
      <div className="farewell-beacon">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--sand)" strokeWidth="1.5">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.707-.707M6.343 6.343l-.707-.707m12.728 0-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
        </svg>
      </div>

      <div className="hero-copy" style={{ textAlign: 'center' }}>
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          <i />
          Ақтау · Каспий теңізі
          <i />
        </span>
        <h1 className="screen-headline" style={{ fontSize: 'clamp(52px, 5vw, 84px)' }}>
          {copy.farewellTitle}
        </h1>
        <p style={{ maxWidth: '600px', margin: '22px auto 0', color: 'var(--muted)' }}>
          {copy.farewellSubtitle}
        </p>
      </div>
    </main>
  )
}
