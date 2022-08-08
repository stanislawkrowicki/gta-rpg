/// #if SERVER
import type altServer from 'alt-server'
/// #endif

const Events: any = {}

function add(eventModule: any): any {
    return eventModule.default.new()
}

Events.readyToUse = false

export abstract class Event {
    static ID = 0
}

export abstract class ClientEvent {
    /// #if SERVER
    abstract onHandle(client: altServer.Player, object: this): void
    /// #endif
}

export abstract class ServerEvent {
    /// #if CLIENT
    abstract onHandle(object: this): void
    /// #endif
}

Events.initialize = (async () => {})

export default Events