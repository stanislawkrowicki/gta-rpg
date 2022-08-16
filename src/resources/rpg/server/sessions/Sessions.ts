import alt from 'alt-server'
import type {Repository} from "redis-om"
import type {Session} from "../../../../db/QuickAccessDB/schemas/sessions/Session.schema"
import QuickDB from "../db/QuickDB"
import {SessionSchema} from "../../../../db/QuickAccessDB/schemas/sessions/Session.schema"
import type {Client} from "../index"
import Logger from "../logger/logger"

export default class Sessions {
    private static SESSION_SAVE_INTERVAL = 5 * 1000 // TODO: *60 after testing
    private static SESSION_TTL = 24 * 60 * 60 * 7

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

                Sessions.sessionRepository.save(session).then((id) => {
                    Sessions.sessionRepository.expire(id, Sessions.SESSION_TTL)
                })
            })
    }

    static saveSessions() {
        const players = alt.Player.all

        for (let i = 0; i < players.length; i++)
            Sessions.saveSessionForPlayer(players[i].getMeta('wrapper') as Client).then()
    }

    static async restoreSession(client: Client) {
        const session = await Sessions.sessionRepository.search()
            .where('playerHwidHash')
            .equals(client.wrapped.hwidHash)
            .return.first()

        if (session === null) return

        client.wrapped.pos = new alt.Vector3(session.x, session.y, session.z)
        client.wrapped.rot = new alt.Vector3(0, session.ry, session.rz)

        client.pedCamViewMode = session.pedCamViewMode
        client.vehicleCamViewMode = session.vehicleCamViewMode

        Logger.sessions.restoration(client)
    }
}