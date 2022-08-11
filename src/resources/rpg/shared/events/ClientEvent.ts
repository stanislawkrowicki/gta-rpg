/// #if SERVER
import type altServer from "alt-server"
/// #endif

/// #if CLIENT
import altClient from "alt-client"
/// #endif

import {Event} from "./Events"

export abstract class ClientEvent extends Event {
    /// #if SERVER
    static onHandle(client: altServer.Player, object: ClientEvent): void {}
    /// #endif
}

/// #if CLIENT
export function emitEvent(event: ClientEvent) {
    altClient.emit((event.constructor as typeof Event).ID as unknown as string)
}
/// #endif