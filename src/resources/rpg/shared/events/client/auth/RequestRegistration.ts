/// #if SERVER
import type altServer from 'alt-server'
import Logger from '../../../../server/logger/logger'
/// #endif

import ClientEvent from '../../../events/ClientEvent'
import { emitEvent } from '../../../events/ServerEvent'
import type { Client } from '../../../../server'

export default class RequestRegistration extends ClientEvent {
    static MAX_NAME_LENGTH = 20

    name: string
    passwordHash: string

    constructor(name: string, passwordHash: string) {
        super()
        this.name = name
        this.passwordHash = passwordHash
    }

    /// #if SERVER
    static onHandle(client: Client, object: RequestRegistration) {
        if(typeof object.name !== 'string' || object.passwordHash !== 'string' ||
            object.name.length === 0 || object.name.length > RequestRegistration.MAX_NAME_LENGTH ||
            object.passwordHash.length !== 32 ||
            object.passwordHash
        ) {
            return Logger.suspiciousEvent(client, this, object)
        }


    }
    /// #endif
}