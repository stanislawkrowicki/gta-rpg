/// #if SERVER
import altServer from 'alt-server'
/// #endif

/// #if CLIENT
import altClient from 'alt-client'
/// #endif

const Events: any = {}

function add(eventModule: any): any {
    return eventModule.default.new()
}

Events.readyToUse = false

export abstract class Event {
    static ID = 0

    static new() {
        this.ID++

        /// #ifdef SERVER
        if (this instanceof ClientEvent)
            altServer.onClient(this.ID as unknown as string, (this.constructor as typeof ClientEvent).onHandle)
        /// #endif

        /// #ifdef CLIENT
        if (this instanceof ServerEvent)
            altClient.onServer(this.ID as unknown as string, (this.constructor as typeof ServerEvent).onHandle)
        /// #endif
    }
}

export abstract class ClientEvent extends Event {
    /// #if SERVER
    static onHandle(client: altServer.Player, object: ClientEvent): void {}
    /// #endif
}

export abstract class ServerEvent extends Event {
    /// #if CLIENT
    static onHandle(object: ServerEvent): void {}
    /// #endif
}

Events.initialize = (async () => {})

export default Events