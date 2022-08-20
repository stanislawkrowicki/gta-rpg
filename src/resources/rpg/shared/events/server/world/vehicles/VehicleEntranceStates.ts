/// #if CLIENT
import altClient from 'alt-client'
import type Vehicle from '../../../../../client/world/Vehicle'
/// #endif

import ServerEvent from "../../../ServerEvent"

export default class VehicleEntranceStates extends ServerEvent {
    states: {
        vehicleId: number,

        canEnterAsDriver?: boolean,
        canEnterAsPassenger?: boolean
    }[]

    constructor(states: VehicleEntranceStates['states']) {
        super()
        this.states = states
    }

    /// #if CLIENT
    static onHandle(object: VehicleEntranceStates) {
        const vehicles = altClient.Vehicle.all

        for(let i = 0; i < object.states.length; ++i) {
            const entranceState = object.states[i]

            for(let j = 0; j < vehicles.length; ++j) {
                const altVehicle = vehicles[j]

                if(altVehicle.id === entranceState.vehicleId) {
                    const vehicle = altVehicle.getMeta('wrapper') as Vehicle

                    if(entranceState.canEnterAsDriver) {
                        vehicle.entranceState.canEnterAsDriver = true
                    }

                    if(entranceState.canEnterAsPassenger) {
                        vehicle.entranceState.canEnterAsPassenger = true
                    }
                }
            }
        }
    }
    /// #endif
}