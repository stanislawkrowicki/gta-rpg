import { Account, type Client } from 'rpg/server'
import type AccountSchema from '../../../../../db/MainDB/schemas/accounts/Account.schema'
import type GroupMap from '../permissions/groups/GroupMap'
import Permissions from '../permissions/Permissions'

export default class AccountManager {
    static async writeClientAccountMetaFromDB(
        client: Client,
        accountId: string,
        accountDocument: AccountSchema
    ) {
        const account = new Account()

        account.id = accountId
        account.name = accountDocument.name
        account.groups = accountDocument.groups as (keyof typeof GroupMap)[]
        account.individualPermissions = accountDocument.individualPermissions
        account.temporaryPermissions = await Permissions.getClientTemporaryPermissions(client)

        client.account = account
    }
}
