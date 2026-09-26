import { VoiceHalo } from './VoiceHalo'
import type { Copy } from '../i18n'
import type { KioskPhase } from '../types'

interface Props {
  db: number
  transcript: string
  copy: Copy
}

export function ListeningScreen({ db, transcript, copy }: Props) {
  return (
    <main className="listen-screen screen-enter">
      <div className="listen-orbit" aria-hidden="true" />
      <section className="hero-copy listen-copy">
        <span className="eyebrow"><i />{copy.listening}</span>
        <h1>{transcript || '…'}</h1>
        <VoiceHalo phase={'recording' as KioskPhase} db={db} label={copy.prompt} transcript="" />
      </section>
    </main>
  )
}
