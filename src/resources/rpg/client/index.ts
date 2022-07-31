import game from 'natives'
import Mouse, { MouseMode } from './input/Mouse'
import MapEditor from './MapEditor'

import alt from 'alt-client'
import type { Player } from 'alt-client'
import Camera from './Camera'
import View from './View'

const LocalPlayer: Player = null

class GameDefaultsInitiator {
    static initiate() {
        alt.everyTick(() => {
            game.setPauseMenuActive(false)
            game.hudWeaponWheelIgnoreControlInput(true)
        })

        GameDefaultsInitiator.initiateAudio()
    }

    static initiateAudio() {
        game.startAudioScene("FBI_HEIST_H5_MUTE_AMBIENCE_SCENE")
        game.cancelCurrentPoliceReport()
        game.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_GENERAL", true)
        game.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_WARNING", true)
        game.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_ALARM", true)
        // @ts-ignore
        game.setAmbientZoneState(0, 0, 0)
        game.clearAmbientZoneState("AZ_DISTANT_SASQUATCH", false)
        game.setAudioFlag("LoadMPData", true)
        game.setAudioFlag("DisableFlightMusic", true)
        game.setWind(0)
        game.setWeatherTypeNow("CLEAR")
    }
}

GameDefaultsInitiator.initiate()

type GameScreenProviderCallback = (buffer: string) => void

class GameScreenProvider {
    static listeners: GameScreenProviderCallback[] = []

    static initialize() {
        alt.setInterval(() => {
            if(GameScreenProvider.listeners.length > 0) {
                alt.takeScreenshotGameOnly().then((buffer) => {
                    for(let i = 0; i < GameScreenProvider.listeners.length; i++) {
                        GameScreenProvider.listeners[i](buffer)
                    }
                })
            }
        }, 10000)
    }
    static addBufferListener(listener: GameScreenProviderCallback) {
        GameScreenProvider.listeners.push(listener)
    }
    static removeBufferListener(listener: GameScreenProviderCallback) {
        for(let i = 0; GameScreenProvider.listeners.length; i++) {
            GameScreenProvider.listeners.splice(i, 1)
        }
    }
}

class Interactivity {

}

class Interactivities {
    static map: Record<number, Interactivity>
    static list: Interactivity[]

    static initialize() {
        alt.on('GAME:NEW_INTERACTIVITIES', (interactivities) => {
            const interactivitiesToRemove = []

            NEW_INTERACTIVITIES_LOOP:
            for(let i = 0; i < interactivities.list.length; ++i) {
                const newInteractivity = interactivities[i]

                LOCAL_INTERACTIVITIES_LOOP:
                for(let j = 0; j < Interactivities.list.length; ++j) {
                    const localInteractivity = Interactivities.list[j]


                }
            }
        })
    }
}

alt.on('GAME:USER_SHOULD_LOGIN', () => {})
alt.on('beforePlayerConnect', (connectionInfo) => {})

alt.onServer('GAME:SPAWN', () => {
    game.setPedDefaultComponentVariation(alt.Player.local.scriptID)
})

alt.onServer('GAME:LOGIN_PANEL:SHOW', async () => {
    const loginView = new alt.WebView('resource/client/webviews/login/index.html')

    alt.setCamFrozen(true)
    alt.showCursor(true)
    loginView.focus()

    GameScreenProvider.addBufferListener((buffer) => {
        loginView.emit('GAME:SCREEN', buffer)
    })

    loginView.on('LOGIN:ATTEMPT', (login: string, password: string) => {
        alt.emitServer('GAME:LOGIN_PANEL:LOGIN_ACTION', login, password)
    })

})

// GameScreenProvider.initialize()
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

alt.setTimeout(() => {
    const camera = new Camera()

    camera.setPosition(100, 1000, 1000)

    View.setCamera(camera)
    // MapEditor.initialize()
}, 100)
// WebView2DPool.initialize()