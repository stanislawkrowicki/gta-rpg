import type alt from "alt-server"
import LogDB from "../db/LogDB"

const elasticIndex = 'logs'

export default class Logger {
    static auth = {
        login: {
            success: async (player: alt.Player) => {
                await LogDB.client.index({
                    index: elasticIndex,
                    document: {
                        type: 'auth.login.success',
                        username: player.name,
                        hwid: player.hwidHash,
                        hwidExtended: player.hwidExHash,
                        ip: player.ip,
                        timestamp: new Date().toISOString()
                    }
                })
            },

            restore: async(player: alt.Player) => {
                await LogDB.client.index({
                    index: elasticIndex,
                    document: {
                        type: 'auth.login.restore',
                        username: player.name,
                        hwid: player.hwidHash,
                        hwidExtended: player.hwidExHash,
                        ip: player.ip,
                        timestamp: new Date().toISOString()
                    }
                })
            },

            error: async (player: alt.Player, tryCount: number) => {
                await LogDB.client.index({
                    index: elasticIndex,
                    document: {
                        type: 'auth.login.error',
                        username: player.name,
                        hwid: player.hwidHash,
                        hwidExtended: player.hwidExHash,
                        ip: player.ip,
                        tryCount: tryCount,
                        timestamp: new Date().toISOString()
                    }
                })
            }
        },

        register: {
            success: async (player: alt.Player) => {
                await LogDB.client.index({
                    index: elasticIndex,
                    document: {
                        type: 'auth.register.success',
                        username: player.name,
                        hwid: player.hwidHash,
                        hwidExtended: player.hwidExHash,
                        ip: player.ip,
                        timestamp: new Date().toISOString()
                    }
                })
            },

            error: async (player: alt.Player) => {
                await LogDB.client.index({
                    index: elasticIndex,
                    document: {
                        type: 'auth.register.error',
                        username: player.name,
                        hwid: player.hwidHash,
                        hwidExtended: player.hwidExHash,
                        ip: player.ip,
                        timestamp: new Date().toISOString()
                    }
                })
            }
        }
    }
}