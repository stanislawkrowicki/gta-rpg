import alt, { WebView } from 'alt-client'
import native from "natives"

export enum MouseMode {
    CAMERA_CONTROL,
    SCREEN_POINTING
}

export type MouseDownListenerCallback = (x: number, y: number, button: number) => void
export type MouseUpListenerCallback = (x: number, y: number, button: number) => void

export type MouseMoveListenerCallback = (x: number, y: number) => void

export type MouseWheelListenerCallback = (deltaX: number, deltaY: number) => void

export default class Mouse {
    static eventProvider: WebView

    static mode: MouseMode = MouseMode.CAMERA_CONTROL

    static mouseDownListeners: MouseDownListenerCallback[] = []
    static mouseUpListeners: MouseUpListenerCallback[] = []

    static mouseMoveListeners: MouseMoveListenerCallback[] = []

    static mouseWheelListeners: MouseWheelListenerCallback[] = []

    static isCursorShown = false

    static controlActionBlocker: number

    static initialize() {
        Mouse.eventProvider = new WebView('resource/client/webviews/MouseProvider.html')

        Mouse.eventProvider.focus()

        Mouse.eventProvider.on('MOUSE:DOWN', (x, y, button) => {
            for(let i = 0; i < Mouse.mouseDownListeners.length; i++) {
                Mouse.mouseDownListeners[i](x, y, button)
            }
        })

        Mouse.eventProvider.on('MOUSE:UP', (x, y, button) => {
            for(let i = 0; i < Mouse.mouseUpListeners.length; i++) {
                Mouse.mouseUpListeners[i](x, y, button)
            }
        })

        Mouse.eventProvider.on('MOUSE:MOVE', (x, y) => {
            for(let i = 0; i < Mouse.mouseMoveListeners.length; i++) {
                Mouse.mouseMoveListeners[i](x, y)
            }
        })

        Mouse.eventProvider.on('MOUSE:WHEEL', (deltaX, deltaY) => {
            for(let i = 0; i < Mouse.mouseMoveListeners.length; i++) {
                Mouse.mouseWheelListeners[i](deltaX, deltaY)
            }
        })
    }
    static setMode(mode: MouseMode) {
        if(mode === MouseMode.CAMERA_CONTROL) {
            Mouse.showCursor(false)
            if (Mouse.controlActionBlocker) alt.clearEveryTick(Mouse.controlActionBlocker)
        } else {
            Mouse.showCursor(true)
            Mouse.controlActionBlocker = alt.everyTick(() => {
                native.disableAllControlActions(0)
            })
        }

        const resolution = alt.getScreenResolution()
        alt.setCursorPos({
            x: resolution.x / 2,
            y: resolution.y / 2
        })

        Mouse.mode = mode
    }

    static showCursor(show: boolean) {
        if (show && !Mouse.isCursorShown) {
            alt.showCursor(true)
            Mouse.isCursorShown = true
        }
        else if (!show && Mouse.isCursorShown) {
            alt.showCursor(false)
            Mouse.isCursorShown = false
        }
    }

    static addMouseDownListener(listener: MouseDownListenerCallback) {
        Mouse.mouseDownListeners.push(listener)
    }
    static removeMouseDownListener(listener: MouseDownListenerCallback) {
        for (let i = 0; Mouse.mouseDownListeners.length; i++) {
            Mouse.mouseDownListeners.splice(i, 1)
        }
    }

    static addMouseUpListener(listener: MouseUpListenerCallback) {
        Mouse.mouseUpListeners.push(listener)
    }
    static removeMouseUpListener(listener: MouseUpListenerCallback) {
        for (let i = 0; Mouse.mouseUpListeners.length; i++) {
            Mouse.mouseUpListeners.splice(i, 1)
        }
    }

    static addMouseMoveListener(listener: MouseMoveListenerCallback) {
        Mouse.mouseMoveListeners.push(listener)
    }
    static removeMouseMoveListener(listener: MouseMoveListenerCallback) {
        for (let i = 0; Mouse.mouseMoveListeners.length; i++) {
            Mouse.mouseMoveListeners.splice(i, 1)
        }
    }

    static addMouseWheelListener(listener: MouseWheelListenerCallback) {
        Mouse.mouseWheelListeners.push(listener)
    }
    static removeMouseWheelListener(listener: MouseWheelListenerCallback) {
        for (let i = 0; Mouse.mouseWheelListeners.length; i++) {
            Mouse.mouseWheelListeners.splice(i, 1)
        }
    }
}