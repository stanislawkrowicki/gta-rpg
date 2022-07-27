import * as alt from 'alt-client'
import * as game from 'natives'

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

function clearAmbientAudio() {
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

clearAmbientAudio()