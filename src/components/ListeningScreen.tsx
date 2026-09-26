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
      <div className="listen-orbit" />
      <VoiceHalo phase={'recording' as KioskPhase} db={db} label={copy.listening} transcript={transcript} />
      <p className="listen-hint">{transcript || copy.prompt}</p>
    </main>
  )
}
