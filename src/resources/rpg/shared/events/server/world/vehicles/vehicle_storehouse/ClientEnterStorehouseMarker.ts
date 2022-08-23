/// #if CLIENT
import VehicleStorehouseManager from "../../../../../../client/vehicles/VehicleStorehouseManager"
import altClient from "alt-client"
/// #endif

import ServerEvent from "../../../../ServerEvent"
import type {IStorehousePersonalVehicleData} from "../../../../../world/vehicles/VehicleStorehouse"

export default class ClientEnterStorehouseMarker extends ServerEvent {
    storehouseID: number

    playerVehicles: IStorehousePersonalVehicleData[]

    constructor(storehouseID: number, playerVehicles: IStorehousePersonalVehicleData[]) {
        super()

        this.storehouseID = storehouseID
        this.playerVehicles = playerVehicles
    }

    /// #if CLIENT
    static onHandle(object: ClientEnterStorehouseMarker) {
        altClient.log(object.storehouseID)
        VehicleStorehouseManager.openPanel(object.storehouseID, object.playerVehicles)
    }
    /// #endif
}