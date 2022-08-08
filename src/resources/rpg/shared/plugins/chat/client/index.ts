import { ClientPluginPart } from '../../Plugin'
import alt from 'alt-client'

export default class Chat extends ClientPluginPart {
    webview: alt.WebView

    constructor() {
        super()

        this.webview = new alt.WebView('')

        this.webview.on('MESSAGE', (message: string) => {
            // emitEvent(new Message(message))
        })
    }
}