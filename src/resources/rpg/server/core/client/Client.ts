import type alt from 'alt-server'
import type Account from './Account'
import Clients from './Clients'

export class Client {
    wrapped: alt.Player

    isLoggedIn = false
    account: Account

    sessionStartAt: number

    pedCamViewMode = 1 // TODO: this is not being watched
    vehicleCamViewMode = 1

    constructor(player: alt.Player) {
        this.sessionStartAt = Date.now()
        this.wrapped = player
        this.wrapped.setMeta('wrapper', this)
        Clients.push(this)
    }
}
//test
