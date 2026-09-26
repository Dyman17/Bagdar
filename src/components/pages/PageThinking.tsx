import type { Copy } from '../../i18n'

interface Props {
  copy: Copy
  query?: string
}

export function PageThinking({ copy, query }: Props) {
  return (
    <main className="kiosk-fullscreen-stage thinking-screen screen-enter">
      <div className="neural-orbit-wrap">
        <div className="neural-orbit-ring ring-a" />
        <div className="neural-orbit-ring ring-b" />
        <div className="neural-core" />
      </div>

      <div className="hero-copy" style={{ textAlign: 'center' }}>
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          <i />
          {copy.processing}
          <i />
        </span>
        <h1 className="screen-headline" style={{ fontSize: 'clamp(46px, 4.4vw, 76px)' }}>
          {copy.thinkingTitle}
        </h1>
        <p style={{ maxWidth: '560px', margin: '20px auto 0' }}>
          {copy.thinkingSubtitle}
        </p>
        {query && (
          <div
            className="glass-panel"
            style={{
              display: 'inline-block',
              marginTop: '30px',
              padding: '12px 28px',
              borderRadius: '999px',
              color: 'var(--sand)',
              fontSize: '15px',
              fontStyle: 'italic',
            }}
          >
            «{query}»
          </div>
        )}
      </div>
    </main>
  )
}
