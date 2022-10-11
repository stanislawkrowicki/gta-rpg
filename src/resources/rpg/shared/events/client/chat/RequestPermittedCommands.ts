/// #if SERVER
import ServerEvent from '../../ServerEvent'
import type { Client } from 'rpg/server/core/client/Client'
import Commands from 'rpg/server/core/commands/Commands'
/// #endif

import ClientEvent from '../../ClientEvent'
import SendPermittedCommands from '../../server/chat/SendPermittedCommands'

export default class RequestPermittedCommands extends ClientEvent {
    /// #if SERVER
    static onHandle(client: Client, object: RequestPermittedCommands): void {
        const permittedCommandsDefinitions = Commands.getClientPermittedCommandsDefinitions(client)

        ServerEvent.emit(client, new SendPermittedCommands(permittedCommandsDefinitions))
    }
    /// #endif
}
