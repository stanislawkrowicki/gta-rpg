import ServerEvent from "../../ServerEvent"

/// #if CLIENT
import altClient from 'alt-client'
/// #endif

export default class OkDialog extends ServerEvent {
    message: string

    constructor(message: string) {
        super()
        this.message = message
    }

    /// #if CLIENT
    static onHandle(object: OkDialog): void {
        const webview = new altClient.WebView('/resource/client/webviews/OkDialog.html')

        webview.once('CLOSE', () => {
            webview.destroy()
        })
        webview.emit('MESSAGE', object.message)
        webview.focus()
    }
    /// #endif
}