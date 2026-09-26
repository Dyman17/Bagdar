import { VoiceHalo } from '../VoiceHalo'
import type { Copy } from '../../i18n'

interface Props {
  copy: Copy
  db: number
  transcript: string
  lang: string
}

export function PageListening({ copy, db, transcript, lang }: Props) {
  return (
    <main className="kiosk-fullscreen-stage listening-screen screen-enter">
      <div className="listening-aura-box">
        <span className="eyebrow" style={{ marginBottom: 0 }}>
          <i />
          {copy.listening}
          <i />
        </span>

        <VoiceHalo
          phase="recording"
          db={db}
          label={copy.listening}
          transcript={transcript}
        />

        <div className="live-transcript-box glass-panel">
          {transcript ? (
            `«${transcript}»`
          ) : (
            <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontStyle: 'normal', fontSize: '18px' }}>
              {copy.prompt}
            </span>
          )}
        </div>

        <div className="listening-lang-badges">
          {['KK', 'RU', 'EN'].map((code) => (
            <span
              key={code}
              className={`lang-badge ${lang.toUpperCase() === code ? 'is-current' : ''}`}
            >
              {code}
            </span>
          ))}
          <span className="lang-badge">AUTO DETECT</span>
        </div>
      </div>
    </main>
  )
}
