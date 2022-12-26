/// #if SERVER
import altServer from 'alt-server'
import type { Client } from '../../server/core/client/Client'
/// #endif

import Event, { EventType } from './Event'

export default abstract class ServerEvent extends Event {
    protected static eventType = EventType.SERVER

    /// #if CLIENT
    static onHandle(object: ServerEvent): void {}
    /// #endif

    /// #if SERVER
    static emit(player: Client, event: ServerEvent) {
        altServer.emitClientRaw(
            player.wrapped,
            (event.constructor as typeof Event).ID as unknown as string,
            event
        )
    }

    static emitToUnwrappedClient(player: altServer.Player, event: ServerEvent) {
        altServer.emitClientRaw(
            player,
            (event.constructor as typeof Event).ID as unknown as string,
            event
        )
    }

    static emitToAll(event: ServerEvent) {
        altServer.emitAllClientsRaw(
            (event.constructor as typeof Event).ID as unknown as string,
            event
        )
    }
    /// #endif
}
