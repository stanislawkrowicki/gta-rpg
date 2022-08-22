/// #if SERVER
import Logger from '../../../../../../server/logger/logger'
import type { Client } from '../../../../../../server'
import VehicleStorehouse from "../../../../../../server/world/vehicles/VehicleStorehouse"
/// #endif

import ClientEvent from '../../../../ClientEvent'

export default class TakeVehicleOut extends ClientEvent {
    vehicleId: string

    constructor(vehicleID: string) {
        super()
        this.vehicleId = vehicleID
    }

    /// #if SERVER
    static onHandle(client: Client, object: TakeVehicleOut) {
        if(typeof object.vehicleId !== 'string' || object.vehicleId.length !== 24) {
            return Logger.suspiciousEvent(client, this, object)
        }

        VehicleStorehouse.takeVehicleOut(object.vehicleId)
    }
    /// #endif
}