import game from 'natives'
import type Camera from './Camera'

export default class View {
    static wrappedCamera = game.getRenderingCam()
    static setCamera(camera: Camera) {
        game.setCamActive(View.wrappedCamera, false)
        game.destroyCam(View.wrappedCamera, false)

        game.setCamActive(camera.wrapped, true)
        game.renderScriptCams(true, false, 0, true, false, 0)

        View.wrappedCamera = camera.wrapped
    }
    static restoreDefault() {
        game.renderScriptCams(false, false, 0, true, false, 0)
        game.setCamActive(View.wrappedCamera, false)
        game.destroyCam(View.wrappedCamera, false)

        View.wrappedCamera = game.getRenderingCam()
    }
}