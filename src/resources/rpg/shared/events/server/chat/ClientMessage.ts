/// #if CLIENT
import Chat from "../../../../client/chat/Chat"
/// #endif

import ServerEvent from "../../ServerEvent"

export default class ClientMessage extends ServerEvent {
    author: string
    message: string

    constructor(author: string, message: string) {
        super()
        this.author = author
        this.message = message
    }

    /// #if CLIENT
    static onHandle(object: ClientMessage): void {
        Chat.webview.emit('CLIENT_MESSAGE', {
            author: object.author,
            message: object.message,
        })
    }
    /// #endif
}