import type { Copy } from '../i18n'

export function SignScreen({ copy }: { copy: Copy }) {
  return (
    <main className="sign-screen screen-enter">
      <div className="sign-frame">
        <div className="sign-corner" /><div className="sign-corner" />
        <div className="sign-corner" /><div className="sign-corner" />
        <span className="sign-live">● REC</span>
      </div>
      <h1>{copy.signTitle}</h1>
      <p>{copy.gesture}</p>
      <small>{copy.signHint}</small>
    </main>
  )
}
