import type Message from "../../shared/events/server/chat/Message"
import type {Client} from "../index"


export default class Chat  {
    constructor() {
    }
    sendMessageToClient(client: Client, message: Message) {}
    sendMessageToAll(message: Message) {}
}