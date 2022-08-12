/// #if SERVER
import altServer from 'alt-server'
/// #endif

/// #if CLIENT
import altClient from 'alt-client'
/// #endif

import type {ClientEvent} from "./ClientEvent"
import type {ServerEvent} from "./ServerEvent"

const Events: any = {}

function add(eventModule: any): any {
    return eventModule.default.new()
}

Events.readyToUse = false

export enum EventType {
    CLIENT = 'ClientEvent',
    SERVER = 'ServerEvent'
}

export abstract class Event {
    static ID = 0

    protected static eventType: EventType

    static new() {
        this.ID++

        /// #if SERVER
        if (this.eventType === EventType.CLIENT)
            altServer.onClient(this.ID as unknown as string, (this as typeof ClientEvent).onHandle)
        /// #endif

        /// #if CLIENT
        if (this.eventType === EventType.SERVER)
            altClient.onServer(this.ID as unknown as string, (this as typeof ServerEvent).onHandle)
        /// #endif
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

export default Events