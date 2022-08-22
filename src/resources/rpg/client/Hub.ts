import alt from 'alt-client'
import ClientEvent from '../shared/events/ClientEvent'
import RequestLogin from '../shared/events/client/auth/RequestLogin'
import RequestRegistration from '../shared/events/client/auth/RequestRegistration'

export enum Stage {
    WAITING_FOR_AUTHORIZATION,
    CHOOSING_LOCATION
}

export default class Hub {
    static webview: alt.WebView

    static stage: Stage

    static initialize() {
        this.webview = new alt.WebView('/resource/client/webviews/hub/index.html')

        alt.setCamFrozen(true)
        alt.showCursor(true)

        this.webview.focus()

        this.webview.on('AUTH:LOGIN', (username, passwordHash) => {
            ClientEvent.emit(new RequestLogin(username, passwordHash))
        })

        this.webview.on('AUTH:REGISTRATION', (username, passwordHash) => {
            ClientEvent.emit(new RequestRegistration(username, passwordHash))
        })
    }
}