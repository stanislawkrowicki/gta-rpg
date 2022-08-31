import ServerEvent from '../../../../ServerEvent'
import type { MarkerData } from '../../../../../../shared/world/markers/Markers'

export default class ClientLeaveStorehouseMarker extends ServerEvent {
    constructor(markerData: MarkerData) {
        super()
    }

    /// #if CLIENT
    static onHandle(object: ClientLeaveStorehouseMarker) {}
    /// #endif
}
