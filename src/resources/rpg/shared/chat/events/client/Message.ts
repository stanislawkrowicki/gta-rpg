/// #if SERVER
import altServer from 'alt-server'
/// #endif

import {ClientEvent} from "../../../events/ClientEvent"

export default class Message extends ClientEvent {
    message: string

    constructor(message: string) {
        super()
        this.message = message
    }

    /// #if SERVER
    static onHandle(client: altServer.Player): void {
        altServer.log('eventasdhf')
    }
    /// #endif
}