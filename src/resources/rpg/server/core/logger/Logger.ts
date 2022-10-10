import alt from 'alt-server'
import { Queues, QueueChannels } from '../../queue/queue'
import MainDB from '../db/MainDB'
import QuickDB from '../db/QuickDB'
import type { Channel } from 'amqplib'
import type { Repository } from 'redis-om'
import { Warn, WarnSchema } from '../../../../../db/QuickAccessDB/schemas/errors/Warn.schema'
import { Error, ErrorSchema } from '../../../../../db/QuickAccessDB/schemas/errors/Error.schema'
import {
    CaughtError,
    CaughtErrorSchema,
} from '../../../../../db/QuickAccessDB/schemas/errors/CaughtError.schema'
import type Event from '../../../shared/events/Event'
import type SuspiciousEventSchema from '../../../../../db/MainDB/schemas/suspiciousEvents/SuspiciousEvent.schema'
import Utils from '../../../shared/utils/Utils'
import type { Client } from '../client/Client'

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
    static logWarn = async (resource: string, message: string) => {
        /// #if process.env['ENVIRONMENT'] !== 'prod'
        alt.logWarning(`[${resource}]: ${message}`)
        /// #endif

        const warn = Logger.warnRepository.createEntity()

        warn.resource = resource
        warn.message = message

        await Logger.warnRepository.save(warn)
    }

    static logError = async (resource: string, message: string) => {
        /// #if process.env['ENVIRONMENT'] !== 'prod'
        alt.logError(`[${resource}]: ${message}`)
        /// #endif

        const error = Logger.errorRepository.createEntity()

        error.resource = resource
        error.message = message

        await Logger.errorRepository.save(error)
    }

    static logCaughtError = async (resource: string, stacktrace: string, message?: string) => {
        /// #if process.env['ENVIRONMENT'] !== 'prod'
        alt.logError(`[${resource}]: CAUGHT: ${message || ''} ${stacktrace}`)
        /// #endif

        const caughtError = Logger.caughtErrorRepository.createEntity()

        caughtError.resource = resource
        caughtError.stacktrace = stacktrace
        caughtError.message = message || ''

        await Logger.caughtErrorRepository.save(caughtError)
    }

    // SUSPICIOUS EVENTS -> MONGO
    static logSuspiciousEvent = (
        client: Client,
        eventClass: typeof Event | any,
        suspiciousEventContent: Event
    ): void => {
        /// #if process.env['ENVIRONMENT'] !== 'prod'
        alt.log('~y~Suspicious event:', suspiciousEventContent)
        /// #endif

        MainDB.collections.gameDevices
            .findOne({
                $or: [
                    { hwidHash: client.wrapped.hwidHash },
                    { hwidExHash: client.wrapped.hwidExHash },
                ],
            })
            .then((gameDevice) => {
                MainDB.collections.suspiciousEvents
                    .create(
                        Utils.typeCheck<SuspiciousEventSchema>({
                            eventID: eventClass.ID,
                            eventContent: suspiciousEventContent,
                            gameDevice: gameDevice, // TODO: Add Account when its ready
                            timestamp: Date.now(),
                        })
                    )
                    .catch((err) => {
                        Logger.logCaughtError(
                            'logger',
                            err,
                            'Failed to insert suspicious event to Mongo'
                        ).then()
                    })
            })
            .catch((err) => {
                Logger.logCaughtError('logger', err, 'Failed to get player game device').then()
            })
    }

    // NORMAL LOGS -> RABBIT -> ELASTIC
    static connection = {
        logDisconnection: (client: Client) => {
            const altPlayer = client.wrapped
            const hwidHash = altPlayer.hwidHash
            const hwidExHash = altPlayer.hwidExHash
            const ip = altPlayer.ip

            const username = altPlayer.name

            const posX = altPlayer.pos.x
            const posY = altPlayer.pos.y
            const posZ = altPlayer.pos.z

            Logger.qChannel.sendToQueue(
                logQueue,
                Buffer.from(
                    JSON.stringify({
                        type: 'connection.disconnection',
                        username: username,
                        hwidHash: hwidHash,
                        hwidExHash: hwidExHash,
                        ip: ip,
                        x: posX,
                        y: posY,
                        z: posZ,
                        timestamp: Date.now(),
                    })
                )
            )
        },
    }

    static auth = {
        login: {
            logSuccess: (client: Client) => {
                Logger.qChannel.sendToQueue(
                    logQueue,
                    Buffer.from(
                        JSON.stringify({
                            type: 'auth.login.success',
                            username: client.wrapped.name,
                            hwidHash: client.wrapped.hwidHash,
                            hwidExHash: client.wrapped.hwidExHash,
                            ip: client.wrapped.ip,
                            timestamp: Date.now(),
                        })
                    )
                )
            },

            logRestoration: (client: Client) => {
                Logger.qChannel.sendToQueue(
                    logQueue,
                    Buffer.from(
                        JSON.stringify({
                            type: 'auth.login.restoration',
                            username: client.wrapped.name,
                            hwidHash: client.wrapped.hwidHash,
                            hwidExHash: client.wrapped.hwidExHash,
                            ip: client.wrapped.ip,
                            timestamp: Date.now(),
                        })
                    )
                )
            },

            logError: (client: Client, tryCount: number) => {
                Logger.qChannel.sendToQueue(
                    logQueue,
                    Buffer.from(
                        JSON.stringify({
                            type: 'auth.login.error',
                            username: client.wrapped.name,
                            hwidHash: client.wrapped.hwidHash,
                            hwidExHash: client.wrapped.hwidExHash,
                            ip: client.wrapped.ip,
                            tryCount: tryCount,
                            timestamp: Date.now(),
                        })
                    )
                )
            },
        },

        register: {
            logSuccess: (client: Client) => {
                Logger.qChannel.sendToQueue(
                    logQueue,
                    Buffer.from(
                        JSON.stringify({
                            type: 'auth.register.success',
                            username: client.wrapped.name,
                            hwidHash: client.wrapped.hwidHash,
                            hwidExHash: client.wrapped.hwidExHash,
                            ip: client.wrapped.ip,
                            timestamp: Date.now(),
                        })
                    )
                )
            },

            logError: (client: Client) => {
                Logger.qChannel.sendToQueue(
                    logQueue,
                    Buffer.from(
                        JSON.stringify({
                            type: 'auth.register.error',
                            username: client.wrapped.name,
                            hwidHash: client.wrapped.hwidHash,
                            hwidExHash: client.wrapped.hwidExHash,
                            ip: client.wrapped.ip,
                            timestamp: Date.now(),
                        })
                    )
                )
            },
        },
    }

    static chat = {
        logMessage: (client: Client, message: string) => {
            Logger.qChannel.sendToQueue(
                logQueue,
                Buffer.from(
                    JSON.stringify({
                        type: 'chat.message',
                        username: client.wrapped.name,
                        hwidHash: client.wrapped.hwidHash,
                        hwidExHash: client.wrapped.hwidExHash,
                        message: message,
                        posX: client.wrapped.pos.x,
                        posY: client.wrapped.pos.y,
                        posZ: client.wrapped.pos.z,
                        timestamp: Date.now(),
                    })
                )
            )
        },
    }

    static sessions = {
        logRestoration: (client: Client) => {
            Logger.qChannel.sendToQueue(
                logQueue,
                Buffer.from(
                    JSON.stringify({
                        type: 'session.restoration',
                        username: client.wrapped.name,
                        hwidHash: client.wrapped.hwidHash,
                        hwidExHash: client.wrapped.hwidExHash,
                        timestamp: Date.now(),
                    })
                )
            )
        },
    }
}
