import type { Client } from './Client'
import type AccountSchema from '../../../../../db/MainDB/schemas/accounts/Account.schema'
import type GroupMap from '../permissions/groups/GroupMap'
import Permissions from '../permissions/Permissions'
import Account from './Account'

export default class AccountManager {
    static async writeClientAccountMetaFromDB(client: Client, accountDocument: AccountSchema) {
        const account = await AccountManager.generateClientAccountMetaFromDB(accountDocument)
        client.wrapped.setMeta('wrapper', Object.assign(client, { account: account }))
    }

    static async generateClientAccountMetaFromDB(accountDocument: AccountSchema): Promise<Account> {
        const account = new Account()

        account.id = accountDocument._id.toString()
        account.name = accountDocument.name

        // Mongoose returns a pseudo-array, so we need to convert it to an array
        account.groups = Array.from(accountDocument.groups) as (keyof typeof GroupMap)[]
        account.individualPermissions = accountDocument.individualPermissions
        account.temporaryPermissions = await Permissions.getTemporaryPermissionsByAccountId(
            accountDocument._id.toString()
        )

        if (!account.groups.includes(Permissions.DEFAULT_GROUP_ID))
            account.groups.push(Permissions.DEFAULT_GROUP_ID)

        return account
    }
}
