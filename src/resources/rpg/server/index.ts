import dotenv from 'dotenv'

import alt from 'alt-server'

import MainDB from './db/MainDB'
import HotReload from './HotReload'
import { Vector3 } from 'alt-shared'
import Logger from "./logger/logger"
import QuickDB from "./db/QuickDB"

import type GameDeviceSchema from '../../../db/MainDB/schemas/gameDevices/GameDevice.schema'
import Events from "../shared/events/Events"
import Utils from "../shared/utils/Utils"
import Sessions from "./sessions/sessions"

{
    console.log = alt.log
    console.info = alt.log
    console.error = alt.logError
    console.warn = alt.logWarning
}

dotenv.config({
    path: '../.env',
})

const DefaultSpawns = [
    { x: -695.195617675781, y: 283.94725036621094, z: 83.85205078125 },
    { x: -527.6835327148438, y: -678.7252807617188, z: 33.6607666015625 },
    { x: 200.6637420654297, y: -935.287902832031, z: 30.6783447265625 },
    { x: 897.7318725585938, y: -1054.6944580078125, z: 32.818359375 },
    { x: 363.1516418457031, y: -2123.156005859375, z: 16.052734375 },
    { x: -265.3582458496094, y: -1898.0703125, z: 27.7464599609375 },
]

const spawn = DefaultSpawns[0]

enum GameStage {
    LOGIN,
    GAME,
}

const HubCameraWaypoints = [new Vector3(0, 0, 0), new Vector3(0, 100, 0)]

class HubCamera {
    static currentGoalWaypoint: Vector3 = null
    static transitionDelta = 0
    static update() {
        // TODO: linear interpolation(with sin, cos), transition between waypoints, goal detection
    }
}

class ClientHandles {
    map: any
    list: any[]
}

export class Client {
    wrapped: alt.Player

    handles = new ClientHandles()

    pedCamViewMode = 1
    vehicleCamViewMode = 1

    constructor(wrapped: alt.Player) {
        this.wrapped = wrapped
    }
}

// class Clients {
//     static map: Record<string, Client>
// }

alt.on('connectionQueueAdd', (connectionQueueInfo: alt.IConnectionQueueInfo) => {
    if (MainDB.isConnected) {
        MainDB.collections.gameDevices
            .findOne({
                $or: [
                    { hwidHash: connectionQueueInfo.hwidHash },
                    { hwidExHash: connectionQueueInfo.hwidExHash },
                ],
            })
            .then((device) => {
                if (device) {
                    if (device.isBanned) {
                        connectionQueueInfo.decline('')
                    } else {
                        connectionQueueInfo.accept()
                    }
                } else {
                    MainDB.collections.gameDevices
                        .create(
                            Utils.typeCheck<GameDeviceSchema>({
                                hwidHash: connectionQueueInfo.hwidHash,
                                hwidExHash: connectionQueueInfo.hwidExHash,
                            })
                        )
                        .catch((err) => {
                            Logger.caughtError('server-index', 0, err).then()
                        })
                        .then(() => {
                            connectionQueueInfo.accept()
                        })
                }
            })
    } else {
        connectionQueueInfo.decline(
            "The server hasn't started yet... Try to connect later..."
        )
    }
})

alt.on('playerConnect', async (player) => {
    const wrapper = new Client(player)
    player.setMeta('wrapper', wrapper)

    // alt.emitClient(player, "GAME:LOGIN_PANEL:SHOW")

    player.spawn(spawn.x, spawn.y, spawn.z, 0)
    //
    alt.emitClient(player,'GAME:SPAWN')
    //
    // try {
    //     const veh = new alt.Vehicle("PARIAH", spawn.x, spawn.y, spawn.z, 0, 0, 0)
    // } catch (e) {
    //     alt.log(e)
    // }
    Logger.auth.login.success(player)

    await Sessions.restoreSession(wrapper)
    // try {
    //     const veh = new alt.Vehicle(
    //         'PARIAH',
    //         spawn.x,
    //         spawn.y,
    //         spawn.z,
    //         0,
    //         0,
    //         0
    //     )
    // } catch (e) {
    //     alt.log(e)
    // }
})

alt.on('playerDisconnect', async (player) => {
    await Sessions.saveSessionForPlayer(player.getMeta('wrapper') as Client)
    player.deleteMeta('wrapper')
})

alt.onClient(
    'GAME:LOGIN_PANEL:LOGIN_ACTION',
    (player: alt.Player, login: string, password: string) => {
        alt.log(login, password)
    }
)

HotReload.startWatching()

MainDB.connect()

await QuickDB.connect()

await Logger.initialize()

Events.initialize().then(() => {
    alt.log('~lb~' + 'Initialized events')
})

Sessions.initialize()
