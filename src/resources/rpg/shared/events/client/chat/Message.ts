/// #if SERVER
import Logger from '../../../../server/logger/logger'
import ServerEvent from '../../ServerEvent'
import type { Client } from '../../../../server'
import { Clients } from '../../../../server'
/// #endif

import ClientEvent from '../../ClientEvent'
import ClientMessage from '../../server/chat/ClientMessage'
import Vector3 from '../../../utils/Vector3'

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
            return Logger.logSuspiciousEvent(client, Message, object)

        Logger.chat.logMessage(client, object.message)

        for (let i = 0; i < Clients.length; i++) {
            const player = Clients[i]

            if (player === client) {
                ServerEvent.emit(player, new ClientMessage(client.wrapped.name, object.message))
                continue
            }

            const distance = Vector3.getDistanceBetweenTwoVectors(client.wrapped.pos, player.wrapped.pos)

            if (distance <= Message.MAX_MESSAGE_DISTANCE)
                ServerEvent.emit(player, new ClientMessage(client.wrapped.name, object.message))
        }
    }
    /// #endif
}