import type { Copy } from '../i18n'

export function GoodbyeScreen({ copy }: { copy: Copy }) {
  return (
    <main className="goodbye-screen screen-enter">
      <div className="sleep-horizon" aria-hidden="true" />
      <section className="sleep-time">
        <span>{copy.goodbye}</span>
        <h1>{copy.goodbye}</h1>
        <p>{copy.wake}</p>
      </section>
    </main>
  )
}
