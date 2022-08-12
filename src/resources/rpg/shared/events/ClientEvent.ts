/// #if SERVER
import type altServer from "alt-server"
/// #endif

/// #if CLIENT
import altClient from "alt-client"
/// #endif

import {Event, EventType} from "./Events"

export abstract class ClientEvent extends Event {
    protected static eventType = EventType.CLIENT

    // TODO: Every event should be checked, suspicious ones logged to Mongo
    /// #if SERVER
    static onHandle(client: altServer.Player, object: ClientEvent): void {}
    /// #endif
}

/// #if CLIENT
export function emitEvent(event: ClientEvent) {
    altClient.emitServerRaw((event.constructor as typeof Event).ID as unknown as string, event)
}
/// #endif