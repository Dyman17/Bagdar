import type { Copy } from '../i18n'

interface Props {
  answer: string
  suggestions: { id: number; name: string }[]
  copy: Copy
}

export function SuggestScreen({ answer, suggestions, copy }: Props) {
  return (
    <main className="suggest-screen screen-enter">
      <span className="eyebrow"><i />{copy.suggest}</span>
      <h1>{answer}</h1>
      <div className="suggest-list">
        {suggestions.map((item, index) => (
          <div className="suggest-row glass-panel" key={item.id} style={{ animationDelay: `${index * 120}ms` }}>
            <b>{String(index + 1).padStart(2, '0')}</b>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
