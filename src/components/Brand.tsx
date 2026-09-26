interface Props {
  screenId?: string
  lang: string
  live?: boolean
  onToggleLang?: () => void
}

export function Brand({ screenId, lang, live = true, onToggleLang }: Props) {
  return (
    <header className="brandbar">
      <div className="brandmark" aria-label="BaGdar">
        <svg viewBox="0 0 42 42" aria-hidden="true">
          <path d="M21 3 36.5 12v18L21 39 5.5 30V12Z" />
          <path d="M14 27.5V15l13.5 6.2L14 27.5Z" />
        </svg>
        <span>BaGdar</span>
      </div>
      <div className="brandmeta">
        {screenId && <span className="screen-code">{screenId}</span>}
        <button
          type="button"
          className="language-code-btn"
          onClick={onToggleLang}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--ink)',
            cursor: onToggleLang ? 'pointer' : 'default',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.12em',
            padding: '4px 6px',
            borderRadius: '6px',
          }}
          title="Сменить язык / Тілді ауыстыру / Switch language"
        >
          {lang.toUpperCase()}
        </button>
        <span className={`live-dot ${live ? 'is-live' : ''}`} aria-label={live ? 'В сети' : 'Не в сети'} />
      </div>
    </header>
  )
}
