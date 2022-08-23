import ServerEvent from "../../ServerEvent"

export default class Message extends ServerEvent {
    message: string

    /// #if CLIENT
    onHandle(): void {}
    /// #endif
}