import type alt from "alt-server"
import { Queues, QueueChannels } from '../queue/queue'

const logQueue = 'logs'

const qChannel = await Queues.channel(QueueChannels.logs)

export default class Logger {
    static auth = {
        login: {
            success: (player: alt.Player) => {
                qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                    type: 'auth.login.success',
                    username: player.name,
                    hwid: player.hwidHash,
                    hwidExtended: player.hwidExHash,
                    ip: player.ip,
                    timestamp: new Date().toISOString()
                }))
                )
            },

            restore: (player: alt.Player) => {
                qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                    type: 'auth.login.restore',
                    username: player.name,
                    hwid: player.hwidHash,
                    hwidExtended: player.hwidExHash,
                    ip: player.ip,
                    timestamp: new Date().toISOString()
                }))
                )
            },

            error: (player: alt.Player, tryCount: number) => {
                qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                    type: 'auth.login.error',
                    username: player.name,
                    hwid: player.hwidHash,
                    hwidExtended: player.hwidExHash,
                    ip: player.ip,
                    tryCount: tryCount,
                    timestamp: new Date().toISOString()
                }))
                )
            }
        },

        register: {
            success: (player: alt.Player) => {
                qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                    type: 'auth.register.success',
                    username: player.name,
                    hwid: player.hwidHash,
                    hwidExtended: player.hwidExHash,
                    ip: player.ip,
                    timestamp: new Date().toISOString()
                }))
                )
            },

            error: (player: alt.Player) => {
                qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                    type: 'auth.register.error',
                    username: player.name,
                    hwid: player.hwidHash,
                    hwidExtended: player.hwidExHash,
                    ip: player.ip,
                    timestamp: new Date().toISOString()
                }))
                )
            }
        }
    }
}