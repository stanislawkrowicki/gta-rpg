import type { Client } from 'rpg/server'
import Logger from '../logger/Logger'
import GroupMap from './groups/GroupMap'

export type PermissionsTree = Record<string, boolean | any>

export type TPermissionQuery<T, A extends Array<PropertyKey> = []> = T extends object
    ? { [K in keyof T]: [...A, K] | TPermissionQuery<T[K], [...A, K]> }[keyof T]
    : A

export default class Permissions {
    static DEFAULT_GROUP_ID: keyof typeof GroupMap = 'player'
    static DEFAULT_GROUP = GroupMap[Permissions.DEFAULT_GROUP_ID]

    private static _isFullyTrue(node: PermissionsTree) {
        if (typeof node === 'boolean') return node

        const children = Object.getOwnPropertyNames(node)

        for (const child of children) if (!Permissions._isFullyTrue(node[child])) return false

        return true
    }

    private static _hasTemporaryPermission(
        temporaryPermissions: Record<string, boolean>,
        key: string
    ) {
        if (typeof temporaryPermissions === 'undefined') return false

        return Object.hasOwn(temporaryPermissions, key)
    }

    private static _checkPermission(
        permissionsTree: PermissionsTree,
        query: string[],
        allowUndefined = false,
        currentQueryIndex = 0
    ): boolean | undefined {
        if (typeof permissionsTree === 'undefined') {
            if (allowUndefined) return undefined
            else {
                Logger.logError('permissions', `Permissions tree is undefined. Query: ${query}`)
                return false
            }
        }

        const queried = query[currentQueryIndex]

        if (typeof queried === 'undefined') return false

        const currentEntry = permissionsTree[queried]

        if (typeof currentEntry === 'undefined') {
            if (allowUndefined) return undefined
            else {
                Logger.logWarn(
                    'permissions',
                    `Nonexistent index in query. query: ${query}, current tree: ${JSON.stringify(
                        permissionsTree
                    )}`
                )
                return false
            }
        } else if (typeof currentEntry === 'boolean') {
            return currentEntry
        } else if (currentQueryIndex < query.length - 1) {
            return Permissions._checkPermission(
                currentEntry,
                query,
                allowUndefined,
                currentQueryIndex + 1
            )
        } else if (currentQueryIndex === query.length - 1) {
            if (allowUndefined) return undefined
            else return Permissions._isFullyTrue(currentEntry)
        }
    }

    static hasDefaultPermission(
        client: Client,
        query: TPermissionQuery<typeof Permissions.DEFAULT_GROUP.permissionsTree>
    ) {
        const temporaryPermissionKey = Permissions.DEFAULT_GROUP_ID + '.' + query.join('.')

        if (
            Permissions._hasTemporaryPermission(
                client.account.temporaryPermissions,
                temporaryPermissionKey
            )
        )
            return client.account.temporaryPermissions[temporaryPermissionKey]

        const hasIndividual = Permissions._checkPermission(
            client.account.individualPermissions[Permissions.DEFAULT_GROUP_ID],
            query,
            true
        )

        if (typeof hasIndividual === 'boolean') return hasIndividual

        return Permissions._checkPermission(Permissions.DEFAULT_GROUP.permissionsTree, query)
    }

    static queryCheck<T>(tree: TPermissionQuery<T>) {
        return tree
    }

    static hasPermissionInGroup(client: Client, group: keyof typeof GroupMap, query: string[]) {
        if (!(client.isLoggedIn && client.account)) return false

        if (!Permissions.belongsToGroup(client, group)) return false

        const temporaryPermissionKey = group + '.' + query.join('.')

        if (
            Permissions._hasTemporaryPermission(
                client.account.temporaryPermissions,
                temporaryPermissionKey
            )
        )
            return client.account.temporaryPermissions[temporaryPermissionKey]

        if (client.account.individualPermissions[group]) {
            const hasIndividual = Permissions._checkPermission(
                client.account.individualPermissions[group],
                query,
                true
            )

            if (typeof hasIndividual === 'boolean') return hasIndividual

            return Permissions._checkPermission(GroupMap[group].permissionsTree, query)
        }

        return Permissions._checkPermission(GroupMap[group].permissionsTree, query)
    }

    static belongsToGroup(client: Client, group: keyof typeof GroupMap) {
        if (typeof client.account === 'undefined' || typeof client.account.groups === 'undefined')
            return false

        return client.account.groups.includes(group)
    }
}
