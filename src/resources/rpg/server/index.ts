import dotenv from 'dotenv'

import alt from 'alt-server'

import MainDB from './core/db/MainDB'
import HotReload from './HotReload'
import { Vector3 } from 'alt-shared'
import Logger from './core/logger/Logger'
import QuickDB from './core/db/QuickDB'

import type GameDeviceSchema from '../../../db/MainDB/schemas/gameDevices/GameDevice.schema'
import Events from '../shared/events/Events'
import Utils from '../shared/utils/Utils'
import Sessions from './core/sessions/Sessions'
import Vehicles from './world/vehicles/Vehicles'
import MarkerManager from './world/markers/MarkerManager'
import { CylinderMarker, Marker } from '../shared/world/markers/Markers'
import VehicleStorehouse from './world/vehicles/vehicle_storehouse/VehicleStorehouse'
import VehicleStorehouseManager from './world/vehicles/vehicle_storehouse/VehicleStorehouseManager'
import ServerEvent from '../shared/events/ServerEvent'
import { Client } from './core/client/Client'
import Clients from './core/client/Clients'
import InitializeHub from 'rpg/shared/events/server/hub/InitializeHub'
import PostAuth from 'rpg/shared/events/server/auth/PostAuth'
import AccountManager from './core/client/AccountManager'

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
                            Logger.logCaughtError(
                                'server-index',
                                err,
                                'Failed to create game device'
                            ).then()
                        })
                        .then(() => {
                            connectionQueueInfo.accept()
                        })
                }
            })
    } else {
        connectionQueueInfo.decline("The server hasn't started yet... Try to connect later...")
    }
})

alt.on('playerConnect', async (player) => {
    const client = new Client(player)

    Sessions.restoreSessionIfPossible(client).then((didRestore) => {
        console.log('restore')
        if (!didRestore) {
            ServerEvent.emit(client, new InitializeHub())
            return
        }

        ServerEvent.emit(client, new PostAuth())
    })
})

alt.on('playerDisconnect', async (player) => {
    const wrapper = player.getMeta('wrapper') as Client

    for (let i = 0; i < Clients.length; i++) {
        const client = Clients[i]

        if (client.wrapped.id === wrapper.wrapped.id) {
            Clients.splice(i, 1)
        }
    }

    Logger.connection.logDisconnection(wrapper)
    await Sessions.saveSessionForPlayer(wrapper)
    Sessions.updateClientPlayedTimeTotal(wrapper)

    player.deleteMeta('wrapper')
    player.despawn()
})

HotReload.startWatching()

MainDB.connect()

await QuickDB.connect()

await Logger.initialize()

Events.initialize().then(() => {
    alt.log('~lb~' + 'Initialized events')
})

Sessions.initialize()

await Vehicles.initialize()

MarkerManager.initialize()

MarkerManager.add(
    new CylinderMarker(
        new alt.Vector3(-695, 283, 80),
        new alt.Vector3(0, 0, 0),
        10,
        5,
        new alt.RGBA(255, 0, 255, 255),
        true,
        undefined,
        undefined,
        true,
        30
    )
)

VehicleStorehouseManager.initialize()

AccountManager.initialize()
