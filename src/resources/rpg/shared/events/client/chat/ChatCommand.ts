/// #if SERVER
import Commands from 'rpg/server/core/commands/Commands'
import CommandManager from 'rpg/server/core/commands/CommandManager'
import Logger from 'rpg/server/core/logger/Logger'
/// #endif

import type { Client } from 'rpg/server/core/client/Client'
import ClientEvent from '../../ClientEvent'

export default class ChatCommand extends ClientEvent {
    commandName: string
    commandArgs: string[]

    constructor(commandName: string, commandArgs: string[]) {
        super()
        this.commandName = commandName
        this.commandArgs = commandArgs
    }

    /// #if SERVER
    static onHandle(client: Client, object: ChatCommand): void {
        if (typeof object.commandName !== 'string' || typeof object.commandArgs !== 'object')
            return this.logAsSuspicious(client, object)

        Logger.commands.logChatCommand(client, object.commandName, object.commandArgs)

        if (!Object.hasOwn(CommandManager.commandsMap, object.commandName)) return

        if (!Commands.canUseCommandByName(client, object.commandName)) return

        const cb = CommandManager.commandsMap[object.commandName].callback
        if (typeof cb === 'function') cb(client, ...object.commandArgs)
    }
    /// #endif
}
