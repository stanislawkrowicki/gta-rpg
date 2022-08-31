import game from 'natives'
import Mouse, { MouseMode } from './input/Mouse'
import MapEditor from './world/MapEditor'

import alt from 'alt-client'
import type { Player } from 'alt-client'
import Camera from './Camera'
import View from './View'
import Chat from './chat/Chat'
import Events from '../shared/events/Events'
import Markers from './world/markers/Markers'
import Hub from './Hub'

const LocalPlayer: Player = null

class GameDefaultsInitiator {
    static initiate() {
        alt.everyTick(() => {
            // https://altv.stuyk.com/docs/articles/snippets/flickering-webview.html
            // When using things such as markers, you will notice your webview flicker when the marker is being rendered.
            // This is a well known GTA V bug and can be easily fixed.
            // @ts-ignore
            game.drawRect(0, 0, 0, 0, 0, 0, 0, 0, 0)

            game.setPauseMenuActive(false)
            game.hudWeaponWheelIgnoreControlInput(true)
            game.blockWeaponWheelThisFrame()
        })

        GameDefaultsInitiator.initiateAudio()

        game.displayRadar(false)
        game.triggerScreenblurFadeOut(0)

        View.restoreDefault()
    }

    static initiateAudio() {
        game.startAudioScene('FBI_HEIST_H5_MUTE_AMBIENCE_SCENE')
        game.cancelCurrentPoliceReport()
        game.clearAmbientZoneState('AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_GENERAL', true)
        game.clearAmbientZoneState('AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_WARNING', true)
        game.clearAmbientZoneState('AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_ALARM', true)
        // @ts-ignore
        game.setAmbientZoneState(0, 0, 0)
        game.clearAmbientZoneState('AZ_DISTANT_SASQUATCH', false)
        game.setAudioFlag('LoadMPData', true)
        game.setAudioFlag('DisableFlightMusic', true)
        game.setWind(0)
        game.setWeatherTypeNow('CLEAR')
    }
}

GameDefaultsInitiator.initiate()

class Interactivity {}

class Interactivities {
    static map: Record<number, Interactivity>
    static list: Interactivity[]

    static initialize() {
        alt.on('GAME:NEW_INTERACTIVITIES', (interactivities) => {
            const interactivitiesToRemove = []

            NEW_INTERACTIVITIES_LOOP: for (let i = 0; i < interactivities.list.length; ++i) {
                const newInteractivity = interactivities[i]

                LOCAL_INTERACTIVITIES_LOOP: for (let j = 0; j < Interactivities.list.length; ++j) {
                    const localInteractivity = Interactivities.list[j]
                }
            }
        })
    }
}

alt.on('spawned', () => {
    game.setPedDefaultComponentVariation(alt.Player.local.scriptID)

    Chat.initialize()
})

// alt.onServer('GAME:LOGIN_PANEL:SHOW', async () => {
//     const loginView = new alt.WebView('resource/client/webviews/login/index.html')
//
//     alt.setCamFrozen(true)
//     alt.showCursor(true)
//     loginView.focus()
//
//     loginView.on('LOGIN:ATTEMPT', (login: string, password: string) => {
//         alt.emitServer('GAME:LOGIN_PANEL:LOGIN_ACTION', login, password)
//     })
// })

Mouse.initialize()

alt.on('keydown', (key) => {
    // if(key === 113) {
    //     if(Mouse.mode === MouseMode.CAMERA_CONTROL) {
    //         Mouse.setMode(MouseMode.SCREEN_POINTING)
    //     } else {
    //         Mouse.setMode(MouseMode.CAMERA_CONTROL)
    //     }
    // }
})

// alt.setTimeout(() => {
// const camera = new Camera()
//
// camera.setPosition(100, 1000, 1000)
//
// View.setCamera(camera)
// game.destroyAllCams(true)
//
// const coords = { ...alt.Player.local.pos }
// const cam = game.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', coords.x, coords.y, coords.z, 0, 0, 358, 18, true, 2)
// game.setCamActive(cam, true)
// game.renderScriptCams(true, false, 0, true, false, 0)
// game.setCamAffectsAiming(cam, false)
// MapEditor.initialize()
// }, 1000)
// WebView2DPool.initialize()

Events.initialize().then(() => {
    alt.log('Initialized events')
})

Markers.initialize()

Hub.initialize()
