/// #if SERVER
import Logger from '../../../../../../server/core/logger/Logger'
import type { Client } from 'rpg/server/core/client/Client'
import VehicleStorehouseManager from '../../../../../../server/world/vehicles/vehicle_storehouse/VehicleStorehouseManager'
/// #endif

import ClientEvent from '../../../../ClientEvent'

export default class TakeVehicleOut extends ClientEvent {
    vehicleId: string
    storehouseID: number

    constructor(vehicleId: string, storehouseID: number) {
        super()
        this.vehicleId = vehicleId
        this.storehouseID = storehouseID
    }

    /// #if SERVER
    static onHandle(client: Client, object: TakeVehicleOut) {
        if (
            typeof object.vehicleId !== 'string' ||
            object.vehicleId.length !== 24 ||
            typeof object.storehouseID !== 'number'
        ) {
            return this.logAsSuspicious(client, object)
        }

        VehicleStorehouseManager.takeVehicleOut(object.vehicleId, object.storehouseID, client)
    }
    /// #endif
}
