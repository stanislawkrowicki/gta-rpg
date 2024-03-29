import alt from 'alt-client'
import Mouse, { MouseMode } from '../input/Mouse'
import { ClientKeyBinds, ClientSettings, type IBindChange } from './ClientSettings'

export default class ClientSettingsPanel {
    static webview: alt.WebView = undefined

    static initialize() {
        ClientKeyBinds.registerListener('clientSettingsPanel', ClientSettingsPanel.togglePanel)
    }

    static togglePanel() {
        if (ClientSettingsPanel.webview) ClientSettingsPanel.closePanel()
        else ClientSettingsPanel.openPanel()
    }

    static openPanel() {
        ClientSettingsPanel.webview = new alt.WebView(
            '/resource/client/webviews/settings/index.html'
        )

        ClientSettingsPanel.webview.emit('availableBinds', ClientKeyBinds.getAllWithDefinitions())

        ClientSettingsPanel.webview.on('disableAllBinds', ClientSettingsPanel.disableAllBinds)
        ClientSettingsPanel.webview.on('enableBinds', ClientSettingsPanel.enableBinds)
        ClientSettingsPanel.webview.on('bindChange', ClientSettingsPanel.onBindChange)

        ClientSettingsPanel.webview.focus()

        Mouse.setMode(MouseMode.SCREEN_POINTING)
    }

    static closePanel() {
        ClientSettingsPanel.webview.destroy()
        ClientSettingsPanel.webview = undefined
        Mouse.setMode(MouseMode.CAMERA_CONTROL)
    }

    static onBindChange(changedBind: IBindChange) {
        ClientKeyBinds.set(changedBind.bindName, changedBind.keyCode, changedBind.modifierCode)
        ClientSettingsPanel.webview.emit('availableBinds', ClientKeyBinds.getAllWithDefinitions())
    }

    static disableAllBinds() {
        ClientKeyBinds.forceDisable = true
    }

    static enableBinds() {
        ClientKeyBinds.forceDisable = false
    }
}
