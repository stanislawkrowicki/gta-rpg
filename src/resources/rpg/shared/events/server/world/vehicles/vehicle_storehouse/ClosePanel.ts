/// #if CLIENT
import VehicleStorehouseManager from "../../../../../../client/vehicles/VehicleStorehouseManager"
/// #endif

import ServerEvent from "../../../../ServerEvent"

export default class ClosePanel extends ServerEvent {
    constructor() {
        super()
    }

    /// #if CLIENT
    static onHandle(object: ClosePanel) {
        VehicleStorehouseManager.closePanel()
    }
    /// #endif
}