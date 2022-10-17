import type { Client } from './Client'
import type AccountSchema from '../../../../../db/MainDB/schemas/accounts/Account.schema'
import type GroupMap from '../permissions/groups/GroupMap'
import Permissions from '../permissions/Permissions'
import Account from './Account'

export default class AccountManager {
    static async writeClientAccountMetaFromDB(client: Client, accountDocument: AccountSchema) {
        const account = new Account()

        account.id = accountDocument._id
        account.name = accountDocument.name
        account.groups = []

        // For some reason, Mongo returns this array as object? like {"0": "player"}
        if (accountDocument.groups)
            accountDocument.groups.forEach((group: keyof typeof GroupMap) => {
                if (!account.groups.includes(group)) account.groups.push(group)
            })

        account.individualPermissions = accountDocument.individualPermissions
        account.temporaryPermissions = await Permissions.getTemporaryPermissionsByAccountId(
            accountDocument._id
        )

        if (!account.groups.includes(Permissions.DEFAULT_GROUP_ID))
            account.groups.push(Permissions.DEFAULT_GROUP_ID)

        client.wrapped.setMeta('wrapper', Object.assign(client, { account: account }))
    }
}
