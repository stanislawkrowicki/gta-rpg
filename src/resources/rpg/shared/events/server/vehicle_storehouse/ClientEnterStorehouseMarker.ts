/// #if CLIENT
import VehicleStorehouse from "../../../../client/vehicles/VehicleStorehouse"
/// #endif

import ServerEvent from "../../ServerEvent"
import type {IPersonalVehicle} from "../../../vehicles/VehicleStorehouse"

export default class ClientEnterStorehouseMarker extends ServerEvent {
    playerVehicles: IPersonalVehicle[]

    constructor(playerVehicles: IPersonalVehicle[]) {
        super()

        this.playerVehicles = playerVehicles
    }

    /// #if CLIENT
    static onHandle(object: ClientEnterStorehouseMarker) {
        VehicleStorehouse.openPanel(object.playerVehicles)
    }
    /// #endif
}