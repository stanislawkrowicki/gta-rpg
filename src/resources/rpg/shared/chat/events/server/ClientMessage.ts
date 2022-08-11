import {ServerEvent} from "../../../events/ServerEvent"

export default class ClientMessage extends ServerEvent {
    author: string
    message: string

    /// #if CLIENT
    onHandle(): void {}
    /// #endif
}