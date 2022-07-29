import alt, { WebView } from 'alt-client'

export enum MouseMode {
    CAMERA_CONTROL,
    SCREEN_POINTING
}

export type MouseListenerCallback = (x: number, y: number, button: number) => void

export default class Mouse {
    static LISTENING_INTERVAL = 15

    static eventProvider: WebView

    static mode: MouseMode = MouseMode.CAMERA_CONTROL

    static listeners: MouseListenerCallback[] = []

    static initialize() {
        Mouse.eventProvider = new WebView('')

        alt.setInterval(() => {
            // TODO: Receive mouse event from WebView
        }, Mouse.LISTENING_INTERVAL)
    }
    static setMode(mode: MouseMode) {
        if(mode === MouseMode.CAMERA_CONTROL) {
            alt.showCursor(false)
            alt.setCamFrozen(false)
        } else {
            alt.showCursor(true)
            alt.setCamFrozen(true)
        }

        Mouse.mode = mode
    }

    static addListener(listener: MouseListenerCallback) {
        Mouse.listeners.push(listener)
    }
    static removeListener(listener: MouseListenerCallback) {
        for (let i = 0; Mouse.listeners.length; i++) {
            Mouse.listeners.splice(i, 1)
        }
    }
}