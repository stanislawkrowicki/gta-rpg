import type { Client } from '../client/Client'
import Logger from '../logger/Logger'
import type { ICommandDefinition, ICommand } from 'rpg/shared/commands/Commands'
import Permissions, { RequiredPermission } from '../permissions/Permissions'
import type GroupMap from '../permissions/groups/GroupMap'

export default class CommandManager {
    static commandsMap: Record<string, ICommand> = {}

    // Only commands that are usable from chat
    static commandsDefinitionsArr: ICommandDefinition[] = []

    static registerCommand(command: ICommand) {
        if (Object.hasOwn(this.commandsMap, command.name)) {
            Logger.logError('command-manager', `Command already registered: ${command.name}`)
            return
        }

        this.commandsMap[command.name] = command

        if (command.isUsableFromChat)
            this.commandsDefinitionsArr.push({
                name: command.name,
                description: command.description,
                requiredPermission: command.requiredPermission,
            })
    }
}

CommandManager.registerCommand({
    name: 'echo',
    isUsableFromChat: true,
    isUsableFromConsole: true,
    callback: (client: Client, ...args: any) => {
        console.log('cb', ...args)
    },
    description: 'Odpowiada tym samym',
})

CommandManager.registerCommand({
    name: 'echo2',
    isUsableFromChat: true,
    isUsableFromConsole: false,
    callback: (client: Client, ...args: any) => {
        console.log('echo2', ...args)
    },
    description: 'Również odpowiada tym samym, ale wymaga permisji',
    requiredPermission: new RequiredPermission(
        'player',
        Permissions.queryCheck<typeof GroupMap.player.permissionsTree>(['chat', 'message'])
    ),
})
