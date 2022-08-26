import alt from 'alt-client'
import ClientEvent from '../shared/events/ClientEvent'
import RequestLogin from '../shared/events/client/auth/RequestLogin'
import RequestRegistration from '../shared/events/client/auth/RequestRegistration'
import Password from './auth/Password'
import Camera from "./Camera"
import View from "./View"
import SetPlayerCameraPos from "../shared/events/client/hub/SetPlayerCameraPos"
import LocationConfirm from "../shared/events/client/hub/LocationConfirm"
import Mouse, {MouseMode} from "./input/Mouse"

export enum Stage {
    WAITING_FOR_AUTHORIZATION,
    CHOOSING_LOCATION
}

export interface IAvailableLocation {
    name: string
    sx: number // spawn Vector
    sy: number
    sz: number
    cx: number // camera Vector
    cy: number
    cz: number
}

export default class Hub {
    static webview: alt.WebView

    static stage: Stage

    static camera: Camera

    static locations: IAvailableLocation[]

    static initialize() {
        this.camera = new Camera()

        this.camera.setPosition(100, 1000, 1000)

        View.setCamera(this.camera)

        this.webview = new alt.WebView('/resource/client/webviews/hub/index.html')

        Mouse.setMode(MouseMode.SCREEN_POINTING)

        this.webview.focus()

        this.authorizationStage()
    }

    static authorizationStage() {
        this.stage = Stage.WAITING_FOR_AUTHORIZATION

        this.webview.on('AUTH:LOGIN', (username, password) => {
            Password.hashPassword(password, (passwordHash) => {
                ClientEvent.emit(
                    new RequestLogin(
                        username,
                        passwordHash
                    )
                )
            })
        })

        this.webview.on('AUTH:REGISTRATION', (username, password) => {
            Password.hashPassword(password, (passwordHash) => {
                ClientEvent.emit(
                    new RequestRegistration(
                        username,
                        passwordHash
                    )
                )
            })
        })
    }

    static locationSelectStage() {
        this.stage = Stage.CHOOSING_LOCATION

        this.locations = [
            {
                name: 'spawn 1',
                sx: 200,
                sy: -935,
                sz: 30,
                cx: 220,
                cy: -850,
                cz: 100
            },
            {
                name: 'spawn 2',
                sx: 363,
                sy: -2123,
                sz: 16,
                cx: 330,
                cy: -2070,
                cz: 40
            },
        ]

        this.changeCameraView(0)

        this.webview.emit('STAGE:LOCATION_SELECT', this.locations)

        this.webview.on('LOCATION_SELECTOR:CHANGE', this.changeCameraView)
        this.webview.on('LOCATION_SELECTOR:CONFIRM', this.spawnPlayer)
    }

    static changeCameraView(locationId: number) {
        if (!Hub.locations || Hub.locations.length <= locationId) return

        const location = Hub.locations[locationId]

        const spawnPosVector = new alt.Vector3(location.sx, location.sy, location.sz)
        ClientEvent.emit(new SetPlayerCameraPos(spawnPosVector))

        const pitch = -Math.abs(Math.atan2(location.cy - location.sy, location.cx - location.sx) * (180 / Math.PI))

        Hub.camera.setPosition(location.cx, location.cy, location.cz)
        Hub.camera.setRotation(pitch, 0, 0)
    }

    static spawnPlayer(locationId: number) {
        const location = Hub.locations[locationId]
        const spawnPosVector = new alt.Vector3(location.sx, location.sy, location.sz)

        ClientEvent.emit(new LocationConfirm(spawnPosVector))
        Hub.webview.destroy()
        Mouse.setMode(MouseMode.CAMERA_CONTROL)
        View.restoreDefault()
    }
}