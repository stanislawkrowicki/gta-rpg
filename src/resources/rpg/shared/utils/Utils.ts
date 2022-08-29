import altShared from "alt-shared"

export default class {
    static typeCheck<T>(value: T): T {
        return value
    }

    static calculateRotationToLookAtElement(elementToRotatePos: altShared.Vector3,
        elementToLookAtPos: altShared.Vector3): altShared.Vector3 {
        /* Calculates rotation (in degrees) needed for an object (e.g. a camera) to look at another object
           (face it both by pitch and yaw). */
        const src = elementToRotatePos
        const target = elementToLookAtPos

        const dx = src.x - target.x
        const dy = src.y - target.y
        const dz = src.z - target.z

        const pitch = -Math.atan2(dz, Math.sqrt(dx * dx + dy * dy))
        let yaw

        if (dy === 0) {
            if (dx > 0) yaw = Math.PI/2
            if (dx < 0) yaw = -Math.PI/2
        }
        else if (dy >= 0) {
            yaw = Math.atan2(dy, dx)
            if (yaw > 0) yaw += Math.PI/2
            else if (yaw < 0) yaw -= Math.PI/2
        } else if (dy < 0) {
            yaw = Math.atan2(dy, dx)
            if (yaw > 0) yaw -= Math.PI/2
            else if (yaw < 0) yaw += Math.PI/2
        }

        const pitchDeg = pitch * (180 / Math.PI)
        const yawDeg = yaw * (180 / Math.PI)

        return new altShared.Vector3(pitchDeg, 0, yawDeg)
    }
}