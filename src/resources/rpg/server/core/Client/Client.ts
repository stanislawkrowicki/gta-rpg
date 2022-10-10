import type alt from 'alt-server'
import type Account from './Account'
import { Clients } from '../../index'

export class Client {
    wrapped: alt.Player

    isLoggedIn = true
    account: Account

    pedCamViewMode = 1 // TODO: this is not being watched
    vehicleCamViewMode = 1

    constructor(player: alt.Player) {
        this.wrapped = player
        this.wrapped.setMeta('wrapper', this)
        Clients.push(this)
    }
}
