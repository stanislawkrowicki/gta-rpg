/// #if CLIENT
import Markers from "../../../../client/markers/Markers"
/// #endif

import ServerEvent from "../../ServerEvent"
import type {Marker} from "../../../markers/Markers"
import type {MarkerData} from "../../../markers/Markers"

export default class ClientLeaveAcknowledgeZone extends ServerEvent {
    markerData: MarkerData

    constructor(markerData: MarkerData) {
        super()
        this.markerData = markerData
    }

    /// #if CLIENT
    static onHandle(object: ClientLeaveAcknowledgeZone) {
        Markers.stopRenderingMarker(object.markerData)
    }
    /// #endif
}