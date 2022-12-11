import alt from 'alt-client'
import natives from 'natives'

import SharedUtils from 'rpg/shared/utils/Utils'

export default class ClientUtils {
    static getScreenPosFromNormal(x: number, y: number): [number, number] {
        const res = natives.getActualScreenResolution(0, 0)
        const screenX = res[1]
        const screenY = res[2]

        let relativeX = 1 - (x / screenX) * 2
        let relativeY = 1 - (y / screenY) * 2

        if (relativeX > 0.0) {
            relativeX = -relativeX
        } else {
            relativeX = Math.abs(relativeX)
        }

        if (relativeY > 0.0) {
            relativeY = -relativeY
        } else {
            relativeY = Math.abs(relativeY)
        }

        return [relativeX, relativeY]
    }

    static worldToScreen(position: alt.Vector3) {
        const result = natives.getScreenCoordFromWorldCoord(
            position.x,
            position.y,
            position.z,
            undefined,
            undefined
        )

        if (!result[0]) return undefined

        return new alt.Vector2((result[1] - 0.5) * 2, (result[2] - 0.5) * 2)
    }

    static screenToWorld(cam: number, screenX: number, screenY: number) {
        const camPos = natives.getCamCoord(cam)
        const camRot = natives.getCamRot(cam, 2)

        // console.log(camPos, camRot)

        function s2w() {
            const camForward = SharedUtils.rotationToForward(camRot)

            const rotUp = camRot.add({ x: 10, y: 0, z: 0 })
            const rotDown = camRot.add({ x: -10, y: 0, z: 0 })
            const rotLeft = camRot.add({ x: 0, y: 0, z: -10 })
            const rotRight = camRot.add({ x: 0, y: 0, z: 10 })

            const camRight = SharedUtils.rotationToForward(rotRight).sub(
                SharedUtils.rotationToForward(rotLeft)
            )
            const camUp = SharedUtils.rotationToForward(rotUp).sub(
                SharedUtils.rotationToForward(rotDown)
            )

            const rollRad = -SharedUtils.degToRad(camRot.y)

            const camRightRoll = camRight.mul(Math.cos(rollRad)).sub(camUp.mul(Math.sin(rollRad)))
            const camUpRoll = camRight.mul(Math.sin(rollRad)).add(camUp.mul(Math.cos(rollRad)))

            const point3D = camPos.add(camForward.mul(10.0)).add(camRightRoll).add(camUpRoll)

            const point2D = ClientUtils.worldToScreen(point3D)

            if (point2D === undefined) {
                return camPos.add(camForward.mul(10.0))
            }

            const point3DZero = camPos.add(camForward.mul(10.0))
            const point2DZero = ClientUtils.worldToScreen(point3DZero)

            if (point2DZero === undefined) {
                return camPos.add(camForward.mul(10.0))
            }

            const eps = 0.001

            if (
                Math.abs(point2D.x - point2DZero.x) < eps ||
                Math.abs(point2D.y - point2DZero.y) < eps
            ) {
                return camPos.add(camForward.mul(10.0))
            }

            const scaleX = (screenX - point2DZero.x) / (point2D.x - point2DZero.x)
            const scaleY = (screenY - point2DZero.y) / (point2D.y - point2DZero.y)
            return camPos
                .add(camForward.mul(10.0))
                .add(camRightRoll.mul(scaleX))
                .add(camUpRoll.mul(scaleY))
        }

        const target = s2w()

        const dir = target.sub(camPos)
        const from = camPos.add(dir.mul(0.05))
        const to = camPos.add(dir.mul(300))

        const ray = natives.startExpensiveSynchronousShapeTestLosProbe(
            from.x,
            from.y,
            from.z,
            to.x,
            to.y,
            to.z,
            1,
            alt.Player.local,
            0
        )
        const result = natives.getShapeTestResult(ray, undefined, undefined, undefined, undefined)

        return result
    }
}
