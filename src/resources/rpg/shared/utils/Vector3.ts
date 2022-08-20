import type altShared from 'alt-shared'

export default class Vector3 {
    static getDistanceBetweenTwoXYZPoints(
        x1: number,
        y1: number,
        z1: number,

        x2: number,
        y2: number,
        z2: number
    ): number {
        const dx = x2 - x1
        const dy = y2 - y1
        const dz = z2 - z1

        return Math.sqrt((dx * dx) + (dy * dy) + (dz * dz))
    }

    static getDistanceBetweenTwoVectors(
        a: altShared.Vector3,
        b: altShared.Vector3,
    ): number {
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dz = b.z - a.z

        return Math.sqrt((dx * dx) + (dy * dy) + (dz * dz))
    }
}