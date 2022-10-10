import type Message from '../../shared/events/server/chat/Message'
import type { Client } from '../core/client/Client'

export default class Chat {
    constructor() {}
    sendMessageToClient(client: Client, message: Message) {}
    sendMessageToAll(message: Message) {}
}
