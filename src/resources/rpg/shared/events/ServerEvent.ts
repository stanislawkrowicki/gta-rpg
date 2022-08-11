/// #if SERVER
import altServer from 'alt-server'
/// #endif

import {Event} from "./Events"

export abstract class ServerEvent extends Event {
    /// #if CLIENT
    static onHandle(object: ServerEvent): void {}
    /// #endif
}

/// #if SERVER
export function emitEvent(player: altServer.Player, event: ServerEvent) {
    altServer.emitClientRaw(player, (event.constructor as typeof Event).ID as unknown as string)
}

export function emitEventToAll(event: ServerEvent) {
    altServer.emitAllClientsRaw((event.constructor as typeof Event).ID as unknown as string)
}
/// #endif