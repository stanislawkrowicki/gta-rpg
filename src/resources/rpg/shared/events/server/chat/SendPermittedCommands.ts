/// #if CLIENT
import Chat from 'rpg/client/chat/Chat'
import type { ICommandDefinition } from 'rpg/shared/commands/Commands'
import alt from 'alt-client'
/// #endif

import ServerEvent from '../../ServerEvent'

export default class SendPermittedCommands extends ServerEvent {
    permittedCommands: ICommandDefinition[]

    constructor(permittedCommands: ICommandDefinition[]) {
        super()
        this.permittedCommands = permittedCommands
    }

    /// #if CLIENT
    static onHandle(object: SendPermittedCommands): void {
        Chat.passPermittedCommandsToWebView(object.permittedCommands)
    }
    /// #endif
}
