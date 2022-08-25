/// #if SERVER
import type { Client } from '../../../../server'
import MainDB from '../../../../server/core/db/MainDB'
import ServerEvent from '../../ServerEvent'
import Authorize from '../../server/auth/Authorize'
import OkDialog from '../../server/gui/OkDialog'
import Utils from '../../../utils/Utils'
import type AccountSchema from '../../../../../../db/MainDB/schemas/accounts/Account.schema'
import Password from '../../../../server/core/auth/Password'
/// #endif

import ClientEvent from '../../../events/ClientEvent'

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
        if(typeof object.name !== 'string' || typeof object.passwordHash !== 'string' ||
            object.name.length === 0 || object.name.length > RequestRegistration.MAX_NAME_LENGTH ||
            object.passwordHash.length !== 64 ||
            !object.passwordHash
        ) {
            return this.logAsSuspicious(client, object)
        }

        const hwidHash = client.wrapped.hwidHash

        MainDB.collections.accounts
            .findOne({ name: object.name })
            .then((account) => {
                if(!account) {
                    Password.hashClientHashedPassword(object.passwordHash, hwidHash, (finalHash) => {
                        MainDB.collections.accounts.create(Utils.typeCheck<AccountSchema>({
                            name: object.name,
                            passwordHash: finalHash
                        })).then(() => {
                            ServerEvent.emit(client, new Authorize())
                        })
                    })
                } else {
                    ServerEvent.emit(client, new OkDialog("This name is already in use"))
                }
            })
    }
    /// #endif
}