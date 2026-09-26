import { PlaceScreen } from '../PlaceScreen'
import type { Config, PlaceDetail, PlaceSummary, RouteResponse } from '../../types'
import type { Copy } from '../../i18n'

interface Props {
  config: Config
  places: PlaceSummary[]
  place: PlaceDetail
  route: RouteResponse
  copy: Copy
  onOpenRoute?: () => void
  onOpenHistory?: () => void
  onOpenQr?: () => void
  onBack?: () => void
}

export function PagePlace(props: Props) {
  return <PlaceScreen {...props} />
}

