/// #if SERVER
import type { Client } from '../../server'
/// #endif

/// #if CLIENT
import altClient from "alt-client"
/// #endif

import Event, {EventType} from './Event'

export default abstract class ClientEvent extends Event {
    protected static eventType = EventType.CLIENT

    /// #if SERVER
    static onHandle(client: Client, object: ClientEvent): void {}
    /// #endif

    /// #if CLIENT
    static emitEvent(event: ClientEvent) {
        altClient.emitServerRaw((event.constructor as typeof Event).ID as unknown as string, event)
    }
    /// #endif
}