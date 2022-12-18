import game from 'natives'

type CameraId = number

export default class Camera {
    wrapped: CameraId
    constructor(type = 'DEFAULT_SCRIPTED_CAMERA') {
        this.wrapped = game.createCam(type, false)
    }
    getPosition() {
        return game.getCamCoord(this.wrapped)
    }
    getRotation() {
        return game.getCamRot(this.wrapped, 2)
    }
    setPosition(x: number, y: number, z: number) {
        game.setCamCoord(this.wrapped, x, y, z)
    }
    setRotation(x: number, y: number, z: number) {
        game.setCamRot(this.wrapped, x, y, z, 2)
    }
    setFov(fieldOfView: number) {
        game.setCamFov(this.wrapped, fieldOfView)
    }
}
