import type { Copy } from '../i18n'

export function SignScreen({ copy }: { copy: Copy }) {
  return (
    <main className="sign-screen screen-enter">
      <section className="hero-copy">
        <span className="eyebrow"><i />{copy.signTitle}</span>
        <h1>{copy.gesture}</h1>
        <p>{copy.signHint}</p>
      </section>
      <aside className="sign-frame glass-panel" aria-hidden="true">
        <div className="sign-corner" /><div className="sign-corner" />
        <div className="sign-corner" /><div className="sign-corner" />
        <span className="sign-live">● REC</span>
      </aside>
    </main>
  )
}
