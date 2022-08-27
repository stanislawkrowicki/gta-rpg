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
import Utils from "../shared/utils/Utils"

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
            {
                name: 'spawn 3',
                sx: 363,
                sy: -2123,
                sz: 16,
                cx: 330,
                cy: -2200,
                cz: 40
            },
            {
                name: 'spawn 4',
                sx: 200,
                sy: -935,
                sz: 30,
                cx: 180,
                cy: -970,
                cz: 100
            },
            {
                name: 'spawn 5',
                sx: 897,
                sy: -1054,
                sz: 32,
                cx: 910,
                cy: -1040,
                cz: 50
            },
            {
                name: 'spawn 6',
                sx: -527,
                sy: -678,
                sz: 33,
                cx: -560,
                cy: -690,
                cz: 50
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

        const cameraPosVector = new alt.Vector3(location.cx, location.cy, location.cz)
        const spawnPosVector = new alt.Vector3(location.sx, location.sy, location.sz)

        ClientEvent.emit(new SetPlayerCameraPos(spawnPosVector))

        const cameraRotation = Utils.calculateRotationToLookAtElement(cameraPosVector, spawnPosVector)

        Hub.camera.setPosition(location.cx, location.cy, location.cz)
        Hub.camera.setRotation(cameraRotation.x, cameraRotation.y, cameraRotation.z)
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