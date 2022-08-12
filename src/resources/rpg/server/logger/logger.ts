import type alt from "alt-server"
import { Queues, QueueChannels } from '../queue/queue'
import QuickDB from "../db/QuickDB"
import type { Channel } from "amqplib"
import type { Repository } from "redis-om"
import {Warn, WarnSchema} from "../../../../db/QuickAccessDB/schemas/errors/Warn.schema"
import {Error, ErrorSchema} from "../../../../db/QuickAccessDB/schemas/errors/Error.schema"
import {CaughtError, CaughtErrorSchema} from "../../../../db/QuickAccessDB/schemas/errors/CaughtError.schema"

const logQueue = 'logs'

export default class Logger {
    private static qChannel: Channel

    private static warnRepository: Repository<Warn>
    private static errorRepository: Repository<Error>
    private static caughtErrorRepository: Repository<CaughtError>

    static initialize = async () => {
        Logger.qChannel = await Queues.channel(QueueChannels.logs)

        Logger.warnRepository = QuickDB.client.fetchRepository(WarnSchema)
        Logger.errorRepository = QuickDB.client.fetchRepository(ErrorSchema)
        Logger.caughtErrorRepository = QuickDB.client.fetchRepository(CaughtErrorSchema)
    }

    // WARNS, ERRORS -> REDIS
    static warn = async(resource: string, id: number, message: string) => {
        const warn = Logger.warnRepository.createEntity()

        warn.resource = resource
        warn.id = id
        warn.message = message

        await Logger.warnRepository.save(warn)
    }

    static error = async (resource: string, id: number, message: string) => {
        const error = Logger.errorRepository.createEntity()

        error.resource = resource
        error.id = id
        error.message = message

        await Logger.errorRepository.save(error)
    }

    static caughtError = async (resource: string, id: number, stacktrace: string) => {
        const caughtError = Logger.caughtErrorRepository.createEntity()

        caughtError.resource = resource
        caughtError.id = id
        caughtError.stacktrace = stacktrace

        await Logger.caughtErrorRepository.save(caughtError)
    }

    // NORMAL LOGS -> RABBIT -> ELASTIC
    static auth = {
        login: {
            success: (player: alt.Player) => {
                Logger.qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                    type: 'auth.login.success',
                    username: player.name,
                    hwidHash: player.hwidHash,
                    hwidExHash: player.hwidExHash,
                    ip: player.ip,
                    timestamp: new Date().toISOString()
                }))
                )
            },

            restore: (player: alt.Player) => {
                Logger.qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                    type: 'auth.login.restore',
                    username: player.name,
                    hwidHash: player.hwidHash,
                    hwidExHash: player.hwidExHash,
                    ip: player.ip,
                    timestamp: new Date().toISOString()
                }))
                )
            },

            error: (player: alt.Player, tryCount: number) => {
                Logger.qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                    type: 'auth.login.error',
                    username: player.name,
                    hwidHash: player.hwidHash,
                    hwidExHash: player.hwidExHash,
                    ip: player.ip,
                    tryCount: tryCount,
                    timestamp: new Date().toISOString()
                }))
                )
            }
        },

        register: {
            success: (player: alt.Player) => {
                Logger.qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                    type: 'auth.register.success',
                    username: player.name,
                    hwidHash: player.hwidHash,
                    hwidExHash: player.hwidExHash,
                    ip: player.ip,
                    timestamp: new Date().toISOString()
                }))
                )
            },

            error: (player: alt.Player) => {
                Logger.qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                    type: 'auth.register.error',
                    username: player.name,
                    hwidHash: player.hwidHash,
                    hwidExHash: player.hwidExHash,
                    ip: player.ip,
                    timestamp: new Date().toISOString()
                }))
                )
            }
        }
    }

    static chat = {
        message: (player: alt.Player, message: string) => {
            Logger.qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                type: 'chat.message',
                username: player.name,
                hwidHash: player.hwidHash,
                hwidExHash: player.hwidExHash,
                message: message,
                timestamp: new Date().toISOString()
            })))
        }
    }
}