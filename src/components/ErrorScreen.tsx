import type { Copy } from '../i18n'

export function ErrorScreen({ copy, answer }: { copy: Copy; answer: string }) {
  return (
    <main className="error-screen screen-enter">
      <div className="error-mark">?</div>
      <h1>{answer || copy.repeat}</h1>
      <p>{copy.errorHint}</p>
    </main>
  )
}
