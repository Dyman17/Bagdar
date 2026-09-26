import type { Copy } from '../i18n'

interface Props {
  answer: string
  suggestions: { id: number; name: string }[]
  copy: Copy
}

export function SuggestScreen({ answer, suggestions, copy }: Props) {
  return (
    <main className="suggest-screen screen-enter">
      <section className="hero-copy">
        <span className="eyebrow"><i />{copy.suggest}</span>
        <h1>{answer}</h1>
        <div className="spoken-list suggest-big">
          {suggestions.map((item, index) => (
            <span key={item.id}><b>{String(index + 1).padStart(2, '0')}</b>{item.name}</span>
          ))}
        </div>
      </section>
    </main>
  )
}
