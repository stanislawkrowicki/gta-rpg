import dotenv from 'dotenv'
import MainDB from './db/MainDB'
import alt from 'alt-server'

dotenv.config({
    path: '../.env'
})

alt.on('playerConnect', (player: alt.Player) => {
    alt.emitClient(player, "GAME:LOGIN_PANEL:SHOW")
})

alt.onClient("GAME:LOGIN_PANEL:LOGIN_ACTION", (player: alt.Player, login: string, password: string) => {
    alt.log(login, password)
})

MainDB.connect()