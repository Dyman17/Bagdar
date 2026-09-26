import type { Copy } from '../i18n'

export function GoodbyeScreen({ copy }: { copy: Copy }) {
  return (
    <main className="goodbye-screen screen-enter">
      <div className="goodbye-wave" />
      <h1>{copy.goodbye}</h1>
      <p>{copy.wake}</p>
    </main>
  )
}
