import type Vector3 from './Vector3'
import type Box from './Box'

export default class Ray3 {
    startPoint: Vector3
    directionPoint: Vector3

    constructor(startPoint: Vector3, directionPoint: Vector3) {
        this.startPoint = startPoint
        this.directionPoint = directionPoint.copy().normalize()
    }
    getPoint(distance: number) {
        return this.startPoint.copy().add(this.directionPoint.copy().mulByScalar(distance))
    }
}
