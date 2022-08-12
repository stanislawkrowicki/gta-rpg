import alt from 'alt-client'
import Message from "../../shared/chat/events/client/Message"
import {emitEvent} from "../../shared/events/ClientEvent"

export default class Chat {
    static webview: alt.WebView

    static initialize() {
        this.webview = new alt.WebView('/resource/client/webviews/chat/index.html')

        alt.on('keydown', (key) => {
            if (key !== 84) return

            if (!this.webview.focused)
                this.webview.focus()
            else
                this.webview.unfocus()
        })

        this.webview.on('MESSAGE', (message: string) => {
            emitEvent(new Message(message))
        })
    }
}