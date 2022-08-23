import type ClientEvent from './ClientEvent'
import type ServerEvent from './ServerEvent'
import Events from './Events'
/// #if CLIENT
import altClient from "alt-client"
/// #endif

/// #if SERVER
import altServer from "alt-server"
/// #endif

export enum EventType {
    CLIENT,
    SERVER
}

export default abstract class Event {
    static ID = 0

    protected static eventType: EventType

    static new() {
        this.ID = Event.ID++

        /// #if SERVER
        if (this.eventType === EventType.CLIENT) {
            Events.map[this.ID] = (this as typeof ClientEvent).onHandle
        }
        /// #endif

        /// #if CLIENT
        if (this.eventType === EventType.SERVER)
            Events.map[this.ID] = (this as typeof ServerEvent).onHandle
        /// #endif
    }
}