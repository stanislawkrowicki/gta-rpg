/// #if SERVER
import altServer from 'alt-server'
/// #endif

/// #if CLIENT
import altClient from 'alt-client'
/// #endif

// import {ClientEvent} from "./ClientEvent";
// import {ServerEvent} from "./ServerEvent";

const Events: any = {}

function add(eventModule: any): any {
    return eventModule.default.new()
}

Events.readyToUse = false

export abstract class Event {
    static ID = 0

    static new() {
        this.ID++

        // /// #if SERVER
        // if (this instanceof ClientEvent)
        //     altServer.onClient(this.ID as unknown as string, (this.constructor as typeof ClientEvent).onHandle)
        // /// #endif
        //
        // /// #if CLIENT
        // if (this instanceof ServerEvent)
        //     altClient.onServer(this.ID as unknown as string, (this.constructor as typeof ServerEvent).onHandle)
        // /// #endif
    }
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

    Events.readyToUse = true
})

// await Events.initialize()

export default Events