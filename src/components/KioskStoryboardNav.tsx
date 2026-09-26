import type { KioskPhase } from '../types'

interface Props {
  currentPhase: KioskPhase
  onSelectPhase: (phase: KioskPhase) => void
  currentLang: string
  onSelectLang: (lang: string) => void
  isAutoMode: boolean
  onToggleAutoMode: () => void
}

const SCREENS: { id: KioskPhase; label: string; num: string }[] = [
  { id: 'sleep', label: 'Сон', num: '01' },
  { id: 'greeting', label: 'Привет', num: '02' },
  { id: 'listening', label: 'Слушаю', num: '03' },
  { id: 'thinking', label: 'Думаю', num: '04' },
  { id: 'place', label: 'Место', num: '05' },
  { id: 'route', label: 'Маршрут', num: '06' },
  { id: 'history', label: 'История', num: '07' },
  { id: 'qr', label: 'QR', num: '08' },
  { id: 'variants', label: 'Варианты', num: '09' },
  { id: 'nearby', label: 'Рядом', num: '10' },
  { id: 'help', label: 'Помощь', num: '11' },
  { id: 'farewell', label: 'Прощание', num: '12' },
  { id: 'error', label: 'Ошибка', num: '13' },
  { id: 'gestures', label: 'Жесты', num: '14' },
]

export function KioskStoryboardNav({
  currentPhase,
  onSelectPhase,
  currentLang,
  onSelectLang,
  isAutoMode,
  onToggleAutoMode,
}: Props) {
  return (
    <nav className="storyboard-toolbar glass-panel" aria-label="Панель переключения 14 экранов стелы">
      <button
        className="mode-toggle-btn"
        onClick={onToggleAutoMode}
        title="Переключить между автоматическим диалоговым режимом и ручным просмотром всех экранов"
      >
        {isAutoMode ? '● АВТО СТЕЛА' : '○ РАСКАДРОВКА'}
      </button>

      <div className="storyboard-divider" />

      {SCREENS.map((s) => {
        const active = currentPhase === s.id ||
          (s.id === 'sleep' && currentPhase === 'idle') ||
          (s.id === 'place' && currentPhase === 'card') ||
          (s.id === 'listening' && currentPhase === 'recording') ||
          (s.id === 'thinking' && currentPhase === 'processing') ||
          (s.id === 'history' && currentPhase === 'tarihsky') ||
          (s.id === 'error' && currentPhase === 'error_speech')

        return (
          <button
            key={s.id}
            className={`storyboard-tab ${active ? 'is-active' : ''}`}
            onClick={() => onSelectPhase(s.id)}
          >
            <span style={{ opacity: 0.5, marginRight: '4px', fontSize: '9px' }}>{s.num}</span>
            {s.label}
          </button>
        )
      })}

      <div className="storyboard-divider" />

      {['kk', 'ru', 'en'].map((lng) => (
        <button
          key={lng}
          className={`storyboard-tab ${currentLang === lng ? 'is-active' : ''}`}
          onClick={() => onSelectLang(lng)}
          style={{ padding: '6px 10px', fontSize: '10px' }}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </nav>
  )
}
