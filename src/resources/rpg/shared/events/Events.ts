/// #if SERVER
import altServer from 'alt-server'
/// #endif

/// #if CLIENT
import altClient from 'alt-client'
/// #endif

import Event from './Event'

const Events: any = {
    map: {} as Record<number, Event>,

    readyToUse: false
}

function add(eventModule: any): any {
    return eventModule.default.new()
}

Events.initialize = (async () => {
    Events.Server = {
        chat: {
            Message: add(await import('./server/chat/Message')),
            ClientMessage: add(await import('./server/chat/ClientMessage'))
        },

        world: {
            markers: {
                ClientEnterAcknowledgeZone: add(await import('./server/world/markers/ClientEnterAcknowledgeZone')),
                ClientLeaveAcknowledgeZone: add(await import('./server/world/markers/ClientLeaveAcknowledgeZone'))
            },

            vehicles: {
                VehicleEntranceStates: add(await import('./server/world/vehicles/VehicleEntranceStates'))
            },

            vehicleStorehouse: {
                ClientEnterStorehouseMarker: add(await import('./server/world/vehicles/vehicle_storehouse/ClientEnterStorehouseMarker')),
                ClientLeaveStorehouseMarker: add(await import('./server/world/vehicles/vehicle_storehouse/ClientLeaveStorehouseMarker')),
                ClosePanel: add(await import('./server/world/vehicles/vehicle_storehouse/ClosePanel'))
            }
        }
    }

    Events.Client = {
        auth: {
            RequestLogin: add(await import('./client/auth/RequestLogin')),
            RequestRegister: add(await import('./client/auth/RequestRegistration')),
        },
        chat: {
            Message: add(await import('./client/chat/Message'))
        },

        world: {
            vehicleStorehouse: {
                TakeVehicleOut: add(await import('./client/world/vehicles/vehicle_storehouse/TakeVehicleOut'))
            }
        }
    }

    /// #if SERVER
    altServer.onClient((eventId, player, object) => {
        if((eventId as unknown as number) > Event.ID || (eventId as unknown as number) < 0) {
            return
        }

        const handleEvent = Events.map[eventId]

        if(handleEvent) {
            handleEvent(player.getMeta('wrapper'), object)
        }
        else {
            altServer.logError('Uninitialized event: ' + eventId)
        }

    })
    /// #endif

    /// #if CLIENT
    altClient.onServer((eventId, object) => {
        if (!(eventId in Events.map)) return

        Events.map[eventId](object)
    })
    /// #endif

    Events.readyToUse = true
})

export default Events