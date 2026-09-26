import type { Copy } from '../i18n'
import type { SceneResponse } from '../types'

interface Props {
  scene: SceneResponse
  lang: string
  reveal: number
  copy: Copy
  onBack?: () => void
}

export function TarihSkyScreen({ scene, lang, reveal, copy, onBack }: Props) {
  const text = scene.texts[lang] ?? scene.texts.ru ?? Object.values(scene.texts)[0]
  return (
    <main className="scene-screen screen-enter">
      <div className="scene-image scene-modern" style={{ backgroundImage: `url(${scene.modern_url})` }} />
      <div
        className="scene-image scene-historic"
        style={{ backgroundImage: `url(${scene.historic_url})`, clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
      />
      <div className="scene-tone" />
      <div className="scene-year scene-year-left"><span>{copy.then}</span><b>1963</b></div>
      <div className="scene-year scene-year-right"><span>{copy.now}</span><b>2026</b></div>
      <div className="scene-divider" style={{ left: `${reveal}%` }}><i /></div>
      <section className="scene-story glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="reconstruction-badge">TarihSky · {copy.reconstruction}</span>
          {onBack && (
            <button
              type="button"
              className="kiosk-action-btn btn-back"
              onClick={onBack}
              style={{ padding: '6px 14px', fontSize: '10px' }}
            >
              ◀ Назад
            </button>
          )}
        </div>
        <h1>{text.title}</h1>
        <p>{text.body}</p>
        <div className="scene-commands"><span>«назад»</span><span>«середина»</span><span>«дальше»</span></div>
      </section>
    </main>
  )
}

