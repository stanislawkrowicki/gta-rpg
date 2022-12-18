import type { Client } from './Client'
import type AccountSchema from '../../../../../db/MainDB/schemas/accounts/Account.schema'
import type GroupMap from '../permissions/groups/GroupMap'
import Permissions, { RequiredPermission } from '../permissions/Permissions'
import Account from './Account'
import CommandManager from '../commands/CommandManager'
import ServerEvent from 'rpg/shared/events/ServerEvent'
import UnauthorizeDev from 'rpg/shared/events/server/auth/UnauthorizeDev'

export default class AccountManager {
    static async initialize() {
        CommandManager.registerCommand({
            name: 'logout',
            isUsableFromChat: true,
            isUsableFromConsole: false,
            callback: (client: Client, ...args: any) => {
                AccountManager.logoutClient(client)
            },
            description: 'Wylogowuje cię z konta (dev only)',
            requiredPermission: new RequiredPermission(
                'dev',
                Permissions.queryCheck<typeof GroupMap.dev.permissionsTree>(['auth', 'logout'])
            ),
        })
    }

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

    static async logoutClient(client: Client) {
        Object.assign(client, { account: undefined })
        client.wrapped.despawn()
        client.wrapped.setMeta('wrapper', client)
        ServerEvent.emit(client, new UnauthorizeDev())
    }
}
