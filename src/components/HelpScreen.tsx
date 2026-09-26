import type { Copy } from '../i18n'

export function HelpScreen({ copy }: { copy: Copy }) {
  return (
    <main className="help-screen screen-enter">
      <section className="hero-copy">
        <span className="eyebrow"><i />{copy.helpTitle}</span>
        <h1>{copy.helpTitle}</h1>
        <div className="spoken-list suggest-big">
          {[copy.help1, copy.help2, copy.help3, copy.help4].map((line, index) => (
            <span key={index}><b>{String(index + 1).padStart(2, '0')}</b>«{line}»</span>
          ))}
        </div>
      </section>
    </main>
  )
}
