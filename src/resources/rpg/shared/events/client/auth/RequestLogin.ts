/// #if SERVER
import type { Client } from '../../../../server'
import MainDB from '../../../../server/core/db/MainDB'
import ServerEvent from '../../ServerEvent'
import Authorize from '../../server/auth/Authorize'
import OkDialog from '../../server/gui/OkDialog'
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
        if (
            typeof object.name !== 'string' ||
            typeof object.passwordHash !== 'string' ||
            object.name.length === 0 ||
            object.name.length > RequestLogin.MAX_NAME_LENGTH ||
            object.passwordHash.length !== 64
        ) {
            return this.logAsSuspicious(client, object)
        }

        const finalHash = object.passwordHash

        MainDB.collections.accounts.findOne({ name: object.name }).then((account) => {
            // if(account && account.passwordHash === finalHash) {
            if (account) {
                ServerEvent.emit(client, new Authorize())
            } else {
                ServerEvent.emit(
                    client,
                    new OkDialog('You have entered an invalid username or password')
                )
            }
        })
    }
    /// #endif
}
