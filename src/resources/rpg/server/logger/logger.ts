import alt from "alt-server"
import { Queues, QueueChannels } from '../queue/queue'
import MainDB from "../db/MainDB"
import QuickDB from "../db/QuickDB"
import type { Channel } from "amqplib"
import type { Repository } from "redis-om"
import {Warn, WarnSchema} from "../../../../db/QuickAccessDB/schemas/errors/Warn.schema"
import {Error, ErrorSchema} from "../../../../db/QuickAccessDB/schemas/errors/Error.schema"
import {CaughtError, CaughtErrorSchema} from "../../../../db/QuickAccessDB/schemas/errors/CaughtError.schema"
import type {Event} from "../../shared/events/Events"
import type SuspiciousEventSchema from "../../../../db/MainDB/schemas/suspiciousEvents/SuspiciousEvent.schema"
import Utils from "../../shared/utils/Utils"
import type {Client} from "../index"

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
        /// #if process.env['ENVIRONMENT'] !== 'prod'
        alt.logWarning(`[${resource}][${id}]: ${message}`)
        /// #endif

        const warn = Logger.warnRepository.createEntity()

        warn.resource = resource
        warn.id = id
        warn.message = message

        await Logger.warnRepository.save(warn)
    }

    static error = async (resource: string, id: number, message: string) => {
        /// #if process.env['ENVIRONMENT'] !== 'prod'
        alt.logError(`[${resource}][${id}]: ${message}`)
        /// #endif

        const error = Logger.errorRepository.createEntity()

        error.resource = resource
        error.id = id
        error.message = message

        await Logger.errorRepository.save(error)
    }

    static caughtError = async (resource: string, id: number, stacktrace: string, message?: string) => {
        /// #if process.env['ENVIRONMENT'] !== 'prod'
        alt.logError(`[${resource}][${id}]: CAUGHT: ${message || ''} ${stacktrace}`)
        /// #endif

        const caughtError = Logger.caughtErrorRepository.createEntity()

        caughtError.resource = resource
        caughtError.id = id
        caughtError.stacktrace = stacktrace
        caughtError.message = message || ''

        await Logger.caughtErrorRepository.save(caughtError)
    }

    // SUSPICIOUS EVENTS -> MONGO
    static suspiciousEvent = (player: alt.Player, event: typeof Event | any, eventContent: Event) => {
        MainDB.collections.gameDevices
            .findOne({
                $or: [
                    { hwidHash: player.hwidHash },
                    { hwidExHash: player.hwidExHash },
                ],
            }).then((gameDevice) => {
                MainDB.collections.suspiciousEvents.create(
                    Utils.typeCheck<SuspiciousEventSchema>({
                        eventID: event.ID,
                        eventContent: eventContent,
                        gameDevice: gameDevice, // TODO: Add Account when its ready
                        timestamp: Date.now()
                    })
                ).catch((err) => {
                    Logger.caughtError('logger', 1, err)
                        .then()
                })
            }).catch((err) => {
                Logger.caughtError('logger', 0, err)
                    .then()
            })
    }

    // NORMAL LOGS -> RABBIT -> ELASTIC
    static connection = {
        disconnect: (wrapper: Client) => {
            const altPlayer = wrapper.wrapped
            const hwidHash = altPlayer.hwidHash
            const hwidExHash = altPlayer.hwidExHash
            const ip = altPlayer.ip

            const username = altPlayer.name

            const posX = altPlayer.pos.x
            const posY = altPlayer.pos.y
            const posZ = altPlayer.pos.z

            Logger.qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                type: 'connection.disconnect',
                username: username,
                hwidHash: hwidHash,
                hwidExHash: hwidExHash,
                ip: ip,
                x: posX,
                y: posY,
                z: posZ,
                timestamp: Date.now()
            })))
        }
    }

    static auth = {
        login: {
            success: (player: alt.Player) => {
                Logger.qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                    type: 'auth.login.success',
                    username: player.name,
                    hwidHash: player.hwidHash,
                    hwidExHash: player.hwidExHash,
                    ip: player.ip,
                    timestamp: Date.now()
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
                    timestamp: Date.now()
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
                    timestamp: Date.now()
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
                    timestamp: Date.now()
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
                    timestamp: Date.now()
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
                posX: player.pos.x,
                posY: player.pos.y,
                posZ: player.pos.z,
                timestamp: Date.now()
            })))
        }
    }

    static sessions = {
        restore: (player: alt.Player) => {
            Logger.qChannel.sendToQueue(logQueue, Buffer.from(JSON.stringify({
                type: 'session.restore',
                username: player.name,
                hwidHash: player.hwidHash,
                hwidExHash: player.hwidExHash,
                timestamp: Date.now()
            })))
        }
    }
}