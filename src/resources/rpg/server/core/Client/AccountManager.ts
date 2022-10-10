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
        account.groups = accountDocument.groups as (keyof typeof GroupMap)[]
        account.individualPermissions = accountDocument.individualPermissions
        account.temporaryPermissions = await Permissions.getTemporaryPermissionsByAccountId(
            accountDocument._id
        )

        client.account = account
    }
}
