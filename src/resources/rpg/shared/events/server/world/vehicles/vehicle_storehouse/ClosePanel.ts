/// #if CLIENT
import VehicleStorehouse from "../../../../../../client/vehicles/VehicleStorehouse"
/// #endif

import ServerEvent from "../../../../ServerEvent"

export default class ClosePanel extends ServerEvent {
    constructor() {
        super()
    }

    /// #if CLIENT
    static onHandle(object: ClosePanel) {
        VehicleStorehouse.closePanel()
    }
    /// #endif
}