/// #if SERVER
import type altServer from 'alt-server'
import Logger from '../../../../server/logger/logger'
import type { Client } from '../../../../server'
/// #endif

import ClientEvent from '../../../events/ClientEvent'

export default class RequestLogin extends ClientEvent {
    static MAX_NAME_LENGTH = 20

    name: string
    passwordHash: string

    constructor(name: string, passwordHash: string) {
        super()
        this.name = name
        this.passwordHash = passwordHash
    }

    /// #if SERVER
    static onHandle(client: Client, object: RequestLogin) {
        if(typeof object.name !== 'string' || object.passwordHash !== 'string' ||
            object.name.length === 0 || object.name.length > RequestLogin.MAX_NAME_LENGTH ||
            object.passwordHash.length !== 32 ||
            object.passwordHash
        ) {
            return this.logAsSuspicious(client, object)
        }


    }
    /// #endif
}