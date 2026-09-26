import { useState } from 'react'
import { TarihSkyScreen } from '../TarihSkyScreen'
import type { SceneResponse } from '../../types'
import type { Copy } from '../../i18n'

interface Props {
  scene: SceneResponse
  lang: string
  copy: Copy
  initialReveal?: number
}

export function PageHistory({ scene, lang, copy, initialReveal = 50 }: Props) {
  const [reveal, setReveal] = useState(initialReveal)

  return (
    <div
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      onPointerMove={(e) => {
        if (e.buttons === 1) {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
          setReveal(x)
        }
      }}
    >
      <TarihSkyScreen scene={scene} lang={lang} reveal={reveal} copy={copy} />
    </div>
  )
}
