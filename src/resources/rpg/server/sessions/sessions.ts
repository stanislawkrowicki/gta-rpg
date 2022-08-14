import alt from 'alt-server'
import type {Repository} from "redis-om"
import type {Session} from "../../../../db/QuickAccessDB/schemas/sessions/Session.schema"
import QuickDB from "../db/QuickDB"
import {SessionSchema} from "../../../../db/QuickAccessDB/schemas/sessions/Session.schema"
import type {Client} from "../index"

export default class Sessions {
    private static SESSION_SAVE_INTERVAL = 5 * 1000 // TODO: *60 after testing

    private static sessionRepository: Repository<Session>

    static initialize() {
        Sessions.sessionRepository = QuickDB.client.fetchRepository(SessionSchema)

        Sessions.sessionRepository.createIndex().then(() => {
            alt.setInterval(Sessions.saveSessions, Sessions.SESSION_SAVE_INTERVAL)
        })
    }

    static async saveSessionForPlayer(player: Client) {
        const altPlayer = player.wrapped

        const hwidHash = altPlayer.hwidHash
        const posX = altPlayer.pos.x
        const posY = altPlayer.pos.y
        const posZ = altPlayer.pos.z

        const rotY = altPlayer.rot.y
        const rotZ = altPlayer.rot.z

        Sessions.sessionRepository.search()
            .where('playerHwidHash')
            .equals(hwidHash)
            .return.first()
            .then((session) => {
                if (session === null)
                    session = Sessions.sessionRepository.createEntity()

                session.playerHwidHash = hwidHash

                session.x = posX
                session.y = posY
                session.z = posZ

                session.ry = rotY
                session.rz = rotZ

                session.pedCamViewMode = player.pedCamViewMode
                session.vehicleCamViewMode = player.vehicleCamViewMode

                Sessions.sessionRepository.save(session).then()
            })
    }

    static saveSessions() {
        const players = alt.Player.all

        for (let i = 0; i < players.length; i++)
            Sessions.saveSessionForPlayer(players[i].getMeta('wrapper') as Client).then()
    }
}