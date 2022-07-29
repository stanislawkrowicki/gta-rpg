import dotenv from 'dotenv'

import alt from 'alt-server'

import MainDB from './db/MainDB'
import HotReload from './HotReload'

{
    console.log = alt.log
    console.info = alt.log
    console.error = alt.logError
    console.warn = alt.logWarning
}

dotenv.config({
    path: '../.env'
})

alt.on('playerConnect', (player: alt.Player) => {
    alt.emitClient(player, "GAME:LOGIN_PANEL:SHOW")
})

alt.onClient("GAME:LOGIN_PANEL:LOGIN_ACTION", (player: alt.Player, login: string, password: string) => {
    alt.log(login, password)
})

HotReload.startWatching()

MainDB.connect()