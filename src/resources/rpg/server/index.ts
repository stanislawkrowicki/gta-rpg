import dotenv from 'dotenv'
import MainDB from './db/MainDB'
import * as alt from 'alt-server'

dotenv.config({
    path: '../.env'
})

alt.on('playerConnect', (player: alt.Player) => {
    alt.emitClient(player, "GAME:LOGIN_PANEL:SHOW")
})

MainDB.connect()