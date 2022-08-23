/// #if CLIENT
import VehicleStorehouseManager from "../../../../../../client/world/vehicles/vehicle_storehouse/VehicleStorehouseManager"
/// #endif

import ServerEvent from "../../../../ServerEvent"
import type {IStorehousePersonalVehicleData} from "../../../../../world/vehicles/VehicleStorehouse"

export default class ClientEnterStorehouseMarker extends ServerEvent {
    storehouseID: number
    storehouseDescription: string

    playerVehicles: IStorehousePersonalVehicleData[]

    constructor(storehouseID: number, storehouseDescription: string, playerVehicles: IStorehousePersonalVehicleData[]) {
        super()

        this.storehouseID = storehouseID
        this.storehouseDescription = storehouseDescription
        this.playerVehicles = playerVehicles
    }

    /// #if CLIENT
    static onHandle(object: ClientEnterStorehouseMarker) {
        VehicleStorehouseManager.openPanel(object.storehouseID, object.storehouseDescription, object.playerVehicles)
    }
    /// #endif
}