import alt from 'alt-server'
import type { Repository } from 'redis-om'
import type { Session } from '../../../../../db/QuickAccessDB/schemas/sessions/Session.schema'
import QuickDB from '../db/QuickDB'
import { SessionSchema } from '../../../../../db/QuickAccessDB/schemas/sessions/Session.schema'
import type { Client } from '../client/Client'
import Logger from '../logger/Logger'
import MainDB from '../db/MainDB'
import AccountManager from '../client/AccountManager'

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

    static async saveSessionForPlayer(client: Client) {
        if (!client.account) return

        const altPlayer = client.wrapped

        const hwidHash = altPlayer.hwidHash
        const posX = altPlayer.pos.x
        const posY = altPlayer.pos.y
        const posZ = altPlayer.pos.z

        const rotY = altPlayer.rot.y
        const rotZ = altPlayer.rot.z

        Sessions.sessionRepository
            .search()
            .where('clientHwidHash')
            .equals(hwidHash)
            .return.first()
            .then((session) => {
                if (!client.account) return

                if (session === null) session = Sessions.sessionRepository.createEntity()

                session.clientHwidHash = hwidHash

                session.accountId = client.account.id

                session.x = posX
                session.y = posY
                session.z = posZ

                session.ry = rotY
                session.rz = rotZ

                session.pedCamViewMode = client.pedCamViewMode
                session.vehicleCamViewMode = client.vehicleCamViewMode

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

    static async restoreSessionIfPossible(client: Client) {
        return Sessions.sessionRepository
            .search()
            .where('clientHwidHash')
            .equals(client.wrapped.hwidHash)
            .return.first()
            .then(async (session) => {
                if (session === null) return false

                const accountDocument = await MainDB.collections.accounts.findById(
                    session.accountId
                )

                if (!accountDocument) return false

                client.isLoggedIn = true
                client.account = await AccountManager.generateClientAccountMetaFromDB(
                    accountDocument
                )

                client.wrapped.pos = new alt.Vector3(session.x, session.y, session.z)
                client.wrapped.rot = new alt.Vector3(0, session.ry, session.rz)

                client.pedCamViewMode = session.pedCamViewMode
                client.vehicleCamViewMode = session.vehicleCamViewMode

                client.wrapped.setMeta('wrapper', client)

                client.wrapped.model = 'u_m_m_jesus_01'
                client.wrapped.spawn(session.x, session.y, session.z)

                Logger.sessions.logRestoration(client)

                return true
            })
    }

    static async checkIfSessionExistsForHwidHash(hwidHash: string) {
        return Sessions.sessionRepository
            .search()
            .where('clientHwidHash')
            .equals(hwidHash)
            .return.first()
            .then((session) => session !== null)
    }

    static async updateClientPlayedTimeTotal(client: Client) {
        const timeDelta = Date.now() - client.sessionStartAt

        if (!client.account.id) return

        if (timeDelta <= 0) return

        await MainDB.collections.accounts.updateOne(
            { _id: client.account.id },
            { $inc: { timePlayedTotal: timeDelta } }
        )
    }
}
