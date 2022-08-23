/// #if SERVER
import type altServer from 'alt-server'
import Logger from '../../../../server/core/logger/Logger'
import type { Client } from '../../../../server'
/// #endif

import ClientEvent from '../../../events/ClientEvent'

export default class RequestGuestLogin extends ClientEvent {
    static MAX_NAME_LENGTH = 20

    name: string

    constructor(name: string) {
        super()
        this.name = name
    }

    /// #if SERVER
    static onHandle(client: Client, object: RequestGuestLogin) {
        if(typeof object.name !== 'string' ||
            object.name.length === 0 || object.name.length > RequestGuestLogin.MAX_NAME_LENGTH
        ) {
            return this.logAsSuspicious(client, object)
        }


    }
    /// #endif
}