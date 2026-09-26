import type { Copy } from '../i18n'

export function ThinkingScreen({ copy, answer }: { copy: Copy; answer: string }) {
  return (
    <main className="think-screen screen-enter">
      <div className="think-lens" aria-hidden="true"><div className="voice-caustic" /></div>
      <section className="hero-copy">
        <span className="eyebrow"><i />{copy.processing}</span>
        <h1>{answer || '…'}</h1>
      </section>
    </main>
  )
}
