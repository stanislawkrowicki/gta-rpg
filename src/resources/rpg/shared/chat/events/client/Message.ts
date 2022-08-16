/// #if SERVER
import Logger from "../../../../server/logger/logger"
/// #endif

import ClientEvent from "../../../events/ClientEvent"
import {emitEvent} from "../../../events/ServerEvent"
import ClientMessage from "../server/ClientMessage"
import type { Client } from '../../../../server'
import { Clients } from '../../../../server'

export default class Message extends ClientEvent {
    /** Maximum distance where players should see the message */
    static MAX_MESSAGE_DISTANCE = 100

    message: string

    constructor(message: string) {
        super()
        this.message = message
    }

    /// #if SERVER
    static onHandle(client: Client, object: Message): void {
        if (typeof object.message !== 'string')
            return Logger.suspiciousEvent(client, Message, object)

        Logger.chat.message(client, object.message)

        const sx = client.wrapped.pos.x
        const sy = client.wrapped.pos.y
        const sz = client.wrapped.pos.z

        for (let i = 0; i < Clients.length; i++) {
            const player = Clients[i]

            if (player === client) {
                emitEvent(player, new ClientMessage(client.wrapped.name, object.message))
                continue
            }

            const tx = player.wrapped.pos.x
            const ty = player.wrapped.pos.y
            const tz = player.wrapped.pos.z

            const dx = tx - sx
            const dy = ty - sy
            const dz = tz - sz

            const distance = Math.sqrt((dx * dx) + (dy * dy) + (dz * dz))

            if (distance <= Message.MAX_MESSAGE_DISTANCE)
                emitEvent(player, new ClientMessage(client.wrapped.name, object.message))
        }
    }
    /// #endif
}