/// #if SERVER
import altServer from 'alt-server'
import type { Client } from '../../server'
/// #endif

import Event, { EventType } from './Event'

export default abstract class ServerEvent extends Event {
    protected static eventType = EventType.SERVER

    /// #if CLIENT
    static onHandle(object: ServerEvent): void {}
    /// #endif
}

/// #if SERVER
export function emitEvent(player: Client, event: ServerEvent) {
    altServer.emitClientRaw(player.wrapped, (event.constructor as typeof Event).ID as unknown as string, event)
}

export function emitEventToAll(event: ServerEvent) {
    altServer.emitAllClientsRaw((event.constructor as typeof Event).ID as unknown as string, event)
}
/// #endif