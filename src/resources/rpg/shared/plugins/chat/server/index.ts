import { ServerPluginPart } from '../../Plugin'
import type Message from '../shared/events/server/Message'
import type { Client } from '../../../../server'

export default class Chat extends ServerPluginPart {
    constructor() {
        super()
    }
    sendMessageToClient(client: Client, message: Message) {}
    sendMessageToAll(message: Message) {}
}