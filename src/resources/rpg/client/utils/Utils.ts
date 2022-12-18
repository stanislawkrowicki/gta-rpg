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
        const camPosition = natives.getCamCoord(cam)
        const camRotation = natives.getCamRot(cam, 2)

        const target = alt.screenToWorld(screenX, screenY)

        const directionDiff = target.sub(camPosition)

        const areaStart = camPosition.add(directionDiff.mul(0.05))
        const areaEnd = camPosition.add(directionDiff.mul(750))

        const ray = natives.startExpensiveSynchronousShapeTestLosProbe(
            areaStart.x,
            areaStart.y,
            areaStart.z,
            areaEnd.x,
            areaEnd.y,
            areaEnd.z,
            1,
            alt.Player.local,
            0b01001000
        )
        const result = natives.getShapeTestResult(ray, undefined, undefined, undefined, undefined)

        return result
    }
}
