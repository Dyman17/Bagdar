import type { Copy } from '../i18n'

export function HelpScreen({ copy }: { copy: Copy }) {
  return (
    <main className="help-screen screen-enter">
      <span className="eyebrow"><i />{copy.helpTitle}</span>
      <h1>{copy.helpTitle}</h1>
      <div className="help-list">
        {[copy.help1, copy.help2, copy.help3, copy.help4].map((line, index) => (
          <div className="help-row glass-panel" key={index}>
            <b>{String(index + 1).padStart(2, '0')}</b>
            <span>«{line}»</span>
          </div>
        ))}
      </div>
    </main>
  )
}
