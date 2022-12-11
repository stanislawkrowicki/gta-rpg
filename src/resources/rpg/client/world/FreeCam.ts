import alt from 'alt-client'
import natives from 'natives'
import Utils from 'rpg/shared/utils/Utils'

export default class FreeCam {
    private static _isEnabled = false
    private static _everyTick?: number = undefined
    private static _cam?: number = null

    private static readonly blockedKeys = [30, 31, 21, 36, 22, 44, 38, 71, 72, 59, 60, 42, 43]

    static speed = 1

    static enable() {
        if (FreeCam._isEnabled) return

        const player = alt.Player.local

        FreeCam._cam = natives.createCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            player.pos.x,
            player.pos.y,
            player.pos.z + 1,
            (player.rot.x * 180) / Math.PI,
            (player.rot.y * 180) / Math.PI,
            (player.rot.z * 180) / Math.PI,
            50,
            false,
            2
        )

        natives.setCamActive(FreeCam._cam, true)
        natives.renderScriptCams(true, false, 0, true, false, 0)

        FreeCam._everyTick = alt.everyTick(FreeCam.handleFreeCam)
        FreeCam._isEnabled = true
    }

    static disable() {
        if (!FreeCam._isEnabled) return

        if (FreeCam._everyTick) {
            alt.clearEveryTick(FreeCam._everyTick)
            FreeCam._everyTick = undefined
        }

        if (FreeCam._cam) {
            natives.renderScriptCams(false, false, 0, true, false, 0)
            natives.setCamActive(FreeCam._cam, false)
            natives.destroyCam(FreeCam._cam, false)
            FreeCam._cam = null
        }

        FreeCam._isEnabled = false
    }

    static calculateNewPosition(pos: alt.IVector3) {
        for (const blockedKey of FreeCam.blockedKeys) {
            natives.disableControlAction(0, blockedKey, true)
        }

        let verticalSpeed = 0
        let speed = FreeCam.speed

        // Those are normals that are bound to left stick on a controller
        // 218 for left-right, 219 for up-down
        const posMovementX = natives.getDisabledControlNormal(0, 218)
        const posMovementY = natives.getDisabledControlNormal(0, 219)

        // TODO: add isPressed to KeyBinds
        // 38 - E
        if (natives.isDisabledControlPressed(0, 38)) {
            verticalSpeed = FreeCam.speed
        }

        // 44 - Q
        if (natives.isDisabledControlPressed(0, 44)) {
            verticalSpeed = -FreeCam.speed
        }

        // 21 - shift
        if (natives.isDisabledControlPressed(0, 21)) {
            speed *= 2
            verticalSpeed *= 2
        }

        // 36 - ctrl
        if (natives.isDisabledControlPressed(0, 36)) {
            speed *= 0.5
            verticalSpeed *= 0.5
        }

        const upVector = { x: 0, y: 0, z: 1 }
        const rot = natives.getGameplayCamRot(2)
        const rr = Utils.radiansToDirection(new alt.Vector3(rot).toRadians())
        const preRightVector = new alt.Vector3(rr.normalize()).cross(upVector)

        const movementVector = {
            x: rr.x * posMovementY * speed,
            y: rr.y * posMovementY * speed,
            z: rr.z * posMovementY * speed,
        }

        const rightVector = {
            x: preRightVector.x * posMovementX * speed,
            y: preRightVector.y * posMovementX * speed,
            z: preRightVector.z * posMovementX * speed,
        }

        return [
            rot,
            new alt.Vector3(
                pos.x - movementVector.x + rightVector.x,
                pos.y - movementVector.y + rightVector.y,
                pos.z - movementVector.z + verticalSpeed
            ),
        ]
    }

    static handleFreeCam() {
        if (!FreeCam._isEnabled || !FreeCam._cam) return

        const [rot, newPos] = FreeCam.calculateNewPosition(natives.getCamCoord(FreeCam._cam))
        natives.setCamCoord(FreeCam._cam, newPos.x, newPos.y, newPos.z)
        natives.setCamRot(FreeCam._cam, rot.x, rot.y, rot.z, 2)
    }

    static getCurrentCam() {
        return FreeCam._cam
    }
}
