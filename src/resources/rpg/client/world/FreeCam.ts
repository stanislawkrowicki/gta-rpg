import alt from 'alt-client'
import natives from 'natives'
import Utils from 'rpg/shared/utils/Utils'
import Camera from '../Camera'
import View from '../View'
import InputGroup from '../../shared/input/InputGroup'
import Input from '../../shared/input/Input'

export default class FreeCam {
    static isEnabled = false
    static everyTick?: number = undefined
    static cam?: Camera

    static readonly blockedInputs = [
        Input.MOVE_LR,
        Input.MOVE_UD,
        Input.SPRINT,
        Input.DUCK,
        Input.MULTIPLAYER_INFO,
        Input.COVER,
        Input.PICKUP,
        Input.VEH_ACCELERATE,
        Input.VEH_BRAKE,
        Input.VEH_MOVE_LR,
        Input.VEH_MOVE_UD,
        Input.SNIPER_ZOOM_IN_SECONDARY,
        Input.SNIPER_ZOOM_OUT_SECONDARY,
        Input.MELEE_ATTACK_ALTERNATE,
    ]

    static speed = 1

    static enable() {
        if (FreeCam.isEnabled) return

        const player = alt.Player.local

        FreeCam.cam = new Camera()

        FreeCam.cam.setFov(50)
        FreeCam.cam.setPosition(player.pos.x, player.pos.y, player.pos.z + 1)
        FreeCam.cam.setRotation(
            (player.rot.x * 180) / Math.PI,
            (player.rot.y * 180) / Math.PI,
            (player.rot.y * 180) / Math.PI
        )

        View.setCamera(FreeCam.cam)

        FreeCam.everyTick = alt.everyTick(FreeCam.handleFreeCam)
        FreeCam.isEnabled = true
    }

    static disable() {
        if (!FreeCam.isEnabled) return

        if (FreeCam.everyTick) {
            alt.clearEveryTick(FreeCam.everyTick)
            FreeCam.everyTick = undefined
        }

        if (FreeCam.cam) {
            natives.renderScriptCams(false, false, 0, true, false, 0)
            natives.setCamActive(FreeCam.cam.wrapped, false)
            natives.destroyCam(FreeCam.cam.wrapped, false)
            FreeCam.cam = null
        }

        FreeCam.isEnabled = false
    }

    static calculateNewPosition(pos: alt.IVector3) {
        for (const input of FreeCam.blockedInputs) {
            natives.disableControlAction(InputGroup.MOVE, input, true)
        }

        let verticalSpeed = 0
        let speed = FreeCam.speed

        // Those are normals that are bound to left stick on a controller
        // 218 for left-right, 219 for up-down
        const posMovementX = natives.getDisabledControlNormal(
            InputGroup.MOVE,
            Input.SCRIPT_LEFT_AXIS_X
        )
        const posMovementY = natives.getDisabledControlNormal(
            InputGroup.MOVE,
            Input.SCRIPT_LEFT_AXIS_Y
        )

        // TODO: add isPressed to KeyBinds
        // 38 - E
        if (natives.isDisabledControlPressed(InputGroup.MOVE, 38)) {
            verticalSpeed = FreeCam.speed
        }

        // 44 - Q
        if (natives.isDisabledControlPressed(InputGroup.MOVE, 44)) {
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
        if (!FreeCam.isEnabled || !FreeCam.cam) return

        const [rot, newPos] = FreeCam.calculateNewPosition(FreeCam.cam.getPosition())

        FreeCam.cam.setRotation(rot.x, rot.y, rot.z)
        FreeCam.cam.setPosition(newPos.x, newPos.y, newPos.z)
    }

    static getCurrentCam() {
        return FreeCam.cam
    }
}
