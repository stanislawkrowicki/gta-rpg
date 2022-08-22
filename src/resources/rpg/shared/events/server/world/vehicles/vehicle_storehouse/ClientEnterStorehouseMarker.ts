/// #if CLIENT
import VehicleStorehouse from "../../../../../../client/vehicles/VehicleStorehouse"
/// #endif

import ServerEvent from "../../../../ServerEvent"
import type {IStorehousePersonalVehicleData} from "../../../../../world/vehicles/VehicleStorehouse"

export default class ClientEnterStorehouseMarker extends ServerEvent {
    playerVehicles: IStorehousePersonalVehicleData[]

    constructor(playerVehicles: IStorehousePersonalVehicleData[]) {
        super()

        this.playerVehicles = playerVehicles
    }

    /// #if CLIENT
    static onHandle(object: ClientEnterStorehouseMarker) {
        VehicleStorehouse.openPanel(object.playerVehicles)
    }
    /// #endif
}