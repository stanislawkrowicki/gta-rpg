/// #if SERVER
import type { Client } from '../../server/core/client/Client'
import Logger from '../../server/core/logger/Logger'
/// #endif

/// #if CLIENT
import altClient from 'alt-client'
/// #endif

import Event, { EventType } from './Event'

export default abstract class ClientEvent extends Event {
    protected static eventType = EventType.CLIENT

    /// #if SERVER
    static onHandle(client: Client, object: ClientEvent): void {}
    static logAsSuspicious(client: Client, object: ClientEvent): void {
        Logger.logSuspiciousEvent(client, this, object)
    }
    /// #endif

    /// #if CLIENT
    static emit(event: ClientEvent) {
        altClient.emitServerRaw((event.constructor as typeof Event).ID as unknown as string, event)
    }
    /// #endif
}
