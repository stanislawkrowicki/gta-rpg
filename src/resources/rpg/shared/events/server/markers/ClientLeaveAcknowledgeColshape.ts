/// #if CLIENT
import Markers from "../../../../client/markers/Markers"
/// #endif

import ServerEvent from "../../ServerEvent"
import type {Marker} from "../../../markers/Markers"

export default class ClientLeaveAcknowledgeColshape extends ServerEvent {
    marker: Marker

    constructor(marker: Marker) {
        super()
        this.marker = marker
    }

    /// #if CLIENT
    static onHandle(object: ClientLeaveAcknowledgeColshape) {
        Markers.stopRenderingMarker(object.marker)
    }
    /// #endif
}