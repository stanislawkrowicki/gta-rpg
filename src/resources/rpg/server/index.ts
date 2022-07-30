import dotenv from 'dotenv'

import alt from 'alt-server'

import MainDB from './db/MainDB'
import HotReload from './HotReload'
import { Vector3 } from 'alt-shared'

{
    console.log = alt.log
    console.info = alt.log
    console.error = alt.logError
    console.warn = alt.logWarning
}

dotenv.config({
    path: '../.env'
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
    GAME
}

const HubCameraWaypoints = [
    new Vector3(0, 0, 0),
    new Vector3(0, 100, 0)
]

class HubCamera {
    static currentGoalWaypoint: Vector3 = null
    static transitionDelta = 0
    static update() {
        // TODO: linear interpolation(with sin, cos), transition between waypoints, goal detection
    }
}

alt.on('playerConnect', (player) => {
    // alt.emitClient(player, "GAME:LOGIN_PANEL:SHOW")

    player.spawn(spawn.x, spawn.y, spawn.z, 0)

    alt.emitClient(player,'GAME:SPAWN')

    try {
        const veh = new alt.Vehicle("PARIAH", spawn.x, spawn.y, spawn.z, 0, 0, 0)
    } catch (e) {
        alt.log(e)
    }
})


alt.onClient("GAME:LOGIN_PANEL:LOGIN_ACTION", (player: alt.Player, login: string, password: string) => {
    alt.log(login, password)
})

HotReload.startWatching()

MainDB.connect()