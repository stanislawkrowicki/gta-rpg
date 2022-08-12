import alt from 'alt-client'
import native from 'natives'
import Message from "../../shared/chat/events/client/Message"
import {emitEvent} from "../../shared/events/ClientEvent"

export default class Chat {
    static webview: alt.WebView
    static controlAction: number

    static initialize() {
        this.webview = new alt.WebView('/resource/client/webviews/chat/index.html')

        alt.on('keydown', (key) => {
            if (key !== 84) return

            if (!this.webview.focused) {
                this.webview.focus()
                this.controlAction = alt.everyTick(() => {
                    native.disableAllControlActions(0)
                })
            }
        })

        this.webview.on('UNFOCUS', () => {
            if (this.webview.focused) {
                this.webview.unfocus()
                alt.clearEveryTick(this.controlAction)
            }
        })

        this.webview.on('MESSAGE', (message: string) => {
            emitEvent(new Message(message))
        })
    }
}