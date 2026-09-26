import type { Copy } from '../i18n'

export function ErrorScreen({ copy, answer }: { copy: Copy; answer: string }) {
  return (
    <main className="error-screen screen-enter">
      <section className="hero-copy">
        <span className="eyebrow"><i />{copy.repeat}</span>
        <h1>{answer || copy.repeat}</h1>
        <p>{copy.errorHint}</p>
      </section>
    </main>
  )
}
