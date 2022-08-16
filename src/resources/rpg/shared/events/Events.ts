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
            Message: add(await import('../chat/events/server/Message')),
            ClientMessage: add(await import('../chat/events/server/ClientMessage'))
        }
    }

    Events.Client = {
        chat: {
            Message: add(await import('../chat/events/client/Message'))
        }
    }

    /// #if SERVER
    altServer.onClient((eventId, player, object) => {
        if((eventId as unknown as number) > Event.ID || (eventId as unknown as number) < 0) {
            return
        }

        Events.map[eventId](player.getMeta('wrapper'), object)
    })
    /// #endif

    /// #if CLIENT
    altClient.onServer((eventId, object) => {
        Events.map[eventId](object)
    })
    /// #endif

    Events.readyToUse = true
})

export default Events