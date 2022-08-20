/// #if CLIENT
import Markers from "../../../../../client/world/markers/Markers"
/// #endif

import ServerEvent from "../../../ServerEvent"
import type {Marker} from "../../../../world/markers/Markers"
import type {MarkerData} from "../../../../world/markers/Markers"

export default class ClientLeaveAcknowledgeZone extends ServerEvent {
    markerData: MarkerData

    constructor(markerData: MarkerData) {
        super()
        this.markerData = markerData
    }

    /// #if CLIENT
    static onHandle(object: ClientLeaveAcknowledgeZone) {
        Markers.stopRenderingMarker(object.markerData.id)
    }
    /// #endif
}