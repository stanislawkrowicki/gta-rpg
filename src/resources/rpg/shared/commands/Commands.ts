import type { Client } from 'rpg/server/core/client/Client'
import type { RequiredPermission } from 'rpg/server/core/permissions/Permissions'

export type CommandCallback = (client: Client, ...args: any) => void

export interface ICommand {
    name: string
    isUsableFromChat: boolean
    isUsableFromConsole: boolean
    callback: CommandCallback
    description?: string
    requiredPermission?: RequiredPermission
}

export interface ICommandDefinition {
    name: string
    description?: string
    requiredPermission?: RequiredPermission
}
