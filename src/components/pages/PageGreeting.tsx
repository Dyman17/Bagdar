import type { Copy } from '../../i18n'

interface Props {
  copy: Copy
  onStartListening: () => void
  onSelectPrompt?: (text: string) => void
}

export function PageGreeting({ copy, onStartListening, onSelectPrompt }: Props) {
  const suggestions = [
    'Как пройти к Скальной тропе?',
    'Покажи историю набережной',
    'Что находится рядом?',
    'Маршрут к Амфитеатру',
  ]

  return (
    <main className="kiosk-fullscreen-stage greeting-screen screen-enter">
      <div className="greeting-beacon-wrap" onClick={onStartListening} style={{ cursor: 'pointer' }}>
        <div className="greeting-rings" />
        <div className="greeting-beacon-core">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </div>
      </div>

      <div className="hero-copy" style={{ textAlign: 'center' }}>
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          <i />
          {copy.eyebrow}
          <i />
        </span>
        <h1 className="screen-headline" style={{ fontSize: 'clamp(54px, 5.2vw, 88px)' }}>
          {copy.greetingTitle}
        </h1>
        <p style={{ maxWidth: '640px', margin: '22px auto 0' }}>
          {copy.greetingSubtitle}
        </p>
      </div>

      <div className="greeting-suggestions">
        {suggestions.map((text, i) => (
          <button
            key={i}
            className="suggestion-pill glass-panel"
            onClick={() => (onSelectPrompt ? onSelectPrompt(text) : onStartListening())}
          >
            {text}
          </button>
        ))}
      </div>
    </main>
  )
}
