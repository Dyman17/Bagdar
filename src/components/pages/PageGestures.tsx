import type { Copy } from '../../i18n'

interface Props {
  copy: Copy
  onGestureRecognized?: (sign: string) => void
}

export function PageGestures({ copy, onGestureRecognized }: Props) {
  const gestureCards = [
    { emoji: '👍', label: 'Да / Растау', action: 'Выбрать / Select' },
    { emoji: '✋', label: 'Стоп / Тоқта', action: 'Сброс / Reset' },
    { emoji: '☝️', label: 'Вариант 1', action: 'Место 01' },
    { emoji: '✌️', label: 'Вариант 2', action: 'Место 02' },
    { emoji: '🤙', label: 'Телефонға', action: 'QR Маршрут' },
  ]

  return (
    <main className="kiosk-fullscreen-stage gestures-screen screen-enter">
      <div className="gestures-alert-banner">
        <span>{copy.gesturesTitle}</span>
      </div>

      <div className="hero-copy" style={{ textAlign: 'center' }}>
        <h1 className="screen-headline" style={{ fontSize: 'clamp(44px, 4vw, 68px)' }}>
          Оптический интерфейс жестов
        </h1>
        <p style={{ maxWidth: '640px', margin: '14px auto 0', color: 'var(--muted)', fontSize: '15px' }}>
          {copy.gesturesSubtitle}
        </p>
      </div>

      <div className="gestures-hud-grid">
        {gestureCards.map((g, i) => (
          <div
            key={i}
            className="gesture-hud-card glass-panel"
            onClick={() => onGestureRecognized?.(g.label)}
            style={{ cursor: 'pointer' }}
          >
            <span className="gesture-emoji">{g.emoji}</span>
            <span className="gesture-label">{g.label}</span>
            <span className="gesture-action">{g.action}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
