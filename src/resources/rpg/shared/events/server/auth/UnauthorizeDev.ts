/// #if CLIENT
import Chat from 'rpg/client/chat/Chat'
import Hub from 'rpg/client/Hub'
/// #endif

import ServerEvent from '../../ServerEvent'

export default class UnauthorizeDev extends ServerEvent {
    constructor() {
        super()
    }

    /// #if CLIENT
    static onHandle(object: UnauthorizeDev) {
        Chat.deinitialize()
        Hub.initialize()
    }
    /// #endif
}
