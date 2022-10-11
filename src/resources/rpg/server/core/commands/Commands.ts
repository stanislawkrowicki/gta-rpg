import type { Client } from '../client/Client'
import Logger from '../logger/Logger'
import Permissions from '../permissions/Permissions'
import CommandManager from './CommandManager'
import type { ICommandDefinition, ICommand } from 'rpg/shared/commands/Commands'

export default class Commands {
    static getClientPermittedCommandsDefinitions(client: Client) {
        const res: ICommandDefinition[] = []

        CommandManager.commandsDefinitionsArr.forEach((definition) => {
            if (typeof definition.requiredPermission === 'undefined') {
                res.push(definition)
                return
            }

            if (Permissions.hasRequiredPermission(client, definition.requiredPermission))
                res.push(definition)
        })

        return res
    }

    static canUseCommand(client: Client, command: ICommand) {
        return Permissions.hasRequiredPermission(client, command.requiredPermission)
    }

    static canUseCommandByDefinition(client: Client, definition: ICommandDefinition) {
        return Permissions.hasRequiredPermission(client, definition.requiredPermission)
    }

    static canUseCommandByName(client: Client, commandName: string) {
        if (!Object.hasOwn(CommandManager.commandsMap, commandName)) {
            Logger.logError(
                'commands',
                `Tried to check permission for command that is not registered. ${commandName}`
            )
            return
        }

        return Permissions.hasRequiredPermission(
            client,
            CommandManager.commandsMap[commandName].requiredPermission
        )
    }
}
