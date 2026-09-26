import type { Copy } from '../i18n'

export function ThinkingScreen({ copy, answer }: { copy: Copy; answer: string }) {
  return (
    <main className="think-screen screen-enter">
      <div className="think-orbit"><i /><i /><i /></div>
      <h1>{copy.processing}</h1>
      {answer && <p>{answer}</p>}
    </main>
  )
}
