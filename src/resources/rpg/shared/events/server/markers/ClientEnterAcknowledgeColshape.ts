/// #if CLIENT
import Markers from "../../../../client/markers/Markers"
/// #endif

import ServerEvent from "../../ServerEvent"
import type {Marker} from "../../../markers/Markers"

export default class ClientEnterAcknowledgeColshape extends ServerEvent {
    marker: Marker

    constructor(marker: Marker) {
        super()
        this.marker = marker
    }

    /// #if CLIENT
    static onHandle(object: ClientEnterAcknowledgeColshape) {
        Markers.startRenderingMarker(object.marker)
    }
    /// #endif
}