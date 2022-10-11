import alt from 'alt-client'
import native from 'natives'
import Message from '../../shared/events/client/chat/Message'
import ClientEvent from '../../shared/events/ClientEvent'

export default class Chat {
    static webview: alt.WebView
    static controlAction: number
    static isInitialized = false

    static initialize() {
        this.webview = new alt.WebView('/resource/client/webviews/chat/index.html')

        alt.on('keydown', (key) => {
            if (key !== 84) return

            if (!this.webview.focused) {
                this.webview.focus()
                this.webview.emit('FOCUS')
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
            ClientEvent.emit(new Message(message))
        })

        this.isInitialized = true
    }
}
