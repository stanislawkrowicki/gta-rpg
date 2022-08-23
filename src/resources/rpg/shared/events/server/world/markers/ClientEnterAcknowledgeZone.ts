/// #if CLIENT
import Markers from "../../../../../client/world/markers/Markers"
/// #endif

import ServerEvent from "../../../ServerEvent"
import type {MarkerData} from "../../../../../shared/world/markers/Markers"

export default class ClientEnterAcknowledgeZone extends ServerEvent {
    markerData: MarkerData

    constructor(markerData: MarkerData) {
        super()
        this.markerData = markerData
    }

    /// #if CLIENT
    static onHandle(object: ClientEnterAcknowledgeZone) {
        Markers.startRenderingMarker(object.markerData)
    }
    /// #endif
}