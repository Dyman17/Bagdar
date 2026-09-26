import { QrScreen } from '../QrScreen'
import type { PlaceDetail, QrResponse } from '../../types'
import type { Copy } from '../../i18n'

interface Props {
  qr: QrResponse
  place: PlaceDetail | null
  remaining: number
  copy: Copy
}

export function PageQr(props: Props) {
  return <QrScreen {...props} />
}
