/// #if SERVER
import altServer from 'alt-server'
/// #endif

import {Event, EventType} from "./Events"

export abstract class ServerEvent extends Event {
    protected static eventType = EventType.SERVER

    /// #if CLIENT
    static onHandle(object: ServerEvent): void {}
    /// #endif
}

/// #if SERVER
export function emitEvent(player: altServer.Player, event: ServerEvent) {
    altServer.emitClientRaw(player, (event.constructor as typeof Event).ID as unknown as string, event)
}

export function emitEventToAll(event: ServerEvent) {
    altServer.emitAllClientsRaw((event.constructor as typeof Event).ID as unknown as string, event)
}
/// #endif