import alt from 'alt-client'
import native from 'natives'
import type { ICommandDefinition } from 'rpg/shared/commands/Commands'
import ChatCommand from 'rpg/shared/events/client/chat/ChatCommand'
import RequestPermittedCommands from 'rpg/shared/events/client/chat/RequestPermittedCommands'
import Message from '../../shared/events/client/chat/Message'
import ClientEvent from '../../shared/events/ClientEvent'
import Mouse from '../input/Mouse'

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

                Mouse.showCursor(true)

                this.controlAction = alt.everyTick(() => {
                    native.disableAllControlActions(0)
                })

                ClientEvent.emit(new RequestPermittedCommands())
            }
        })

        this.webview.on('UNFOCUS', () => {
            if (this.webview.focused) {
                this.webview.unfocus()
                alt.clearEveryTick(this.controlAction)
            }

            Mouse.showCursor(false)
        })

        this.webview.on('MESSAGE', (message: string) => {
            ClientEvent.emit(new Message(message))
        })

        this.webview.on('COMMAND', (commandName: string, commandArgs: string[]) => {
            ClientEvent.emit(new ChatCommand(commandName, commandArgs))
        })

        this.isInitialized = true
    }

    static passPermittedCommandsToWebView(permittedCommands: ICommandDefinition[]) {
        if (!this.webview) return

        this.webview.emit('PERMITTED_COMMANDS', permittedCommands)
    }
}
