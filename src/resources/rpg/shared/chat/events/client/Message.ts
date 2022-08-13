/// #if SERVER
import altServer from 'alt-server'
import Logger from "../../../../server/logger/logger"
/// #endif

import {ClientEvent} from "../../../events/ClientEvent"
import {emitEvent} from "../../../events/ServerEvent"
import ClientMessage from "../server/ClientMessage"

export default class Message extends ClientEvent {
    message: string

    constructor(message: string) {
        super()
        this.message = message
    }

    /// #if SERVER
    static onHandle(client: altServer.Player, object: Message): void {
        if (typeof object.message !== 'string')
            Logger.suspiciousEvent(client, Message, object)

        Logger.chat.message(client, object.message)

        const MESSAGE_DISTANCE = 100 // maximum distance where players should see the message

        const sx = client.pos.x
        const sy = client.pos.y
        const sz = client.pos.z

        for (let i = 0; i < altServer.Player.all.length; i++) {
            const player = altServer.Player.all[i]

            if (player === client) {
                emitEvent(player, new ClientMessage(client.name, object.message))
                continue
            }

            const tx = player.pos.x
            const ty = player.pos.y
            const tz = player.pos.z

            const dx = tx - sx
            const dy = ty - sy
            const dz = tz - sz

            if (Math.sqrt((dx * dx) + (dy * dy) + (dz * dz)) <= MESSAGE_DISTANCE)
                emitEvent(player, new ClientMessage(client.name, object.message))
        }
    }
    /// #endif
}