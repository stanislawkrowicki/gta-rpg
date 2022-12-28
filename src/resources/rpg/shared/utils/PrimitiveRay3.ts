import Ray3 from './Ray3'
import type Vector3 from './Vector3'
import type PrimitiveObject from '../world/primitives/PrimitiveObject'
import Box from '../world/primitives/objects/Box'

export default class PrimitiveRay3 extends Ray3 {
    constructor(startPoint: Vector3, directionPoint: Vector3) {
        super(startPoint, directionPoint)
    }
    intersectBox(box: Box) {
        // TODO: Take the rotation into account
        let xMin = (box.position.x - this.startPoint.x) / this.directionPoint.x
        let xMax = (box.position.x + box.size.x - this.startPoint.x) / this.directionPoint.x

        const yMin = (box.position.y - this.startPoint.y) / this.directionPoint.y
        const yMax = (box.position.y + box.size.y - this.startPoint.y) / this.directionPoint.y

        if (xMin > xMax || yMin > yMax) return null

        const zMin = (box.position.z - this.startPoint.z) / this.directionPoint.z
        const zMax = (box.position.z + box.size.z - this.startPoint.z) / this.directionPoint.z

        if (xMin > zMax || zMin > xMax) return null

        xMin = Math.max(xMin, yMin, zMin)
        xMax = Math.min(xMax, yMax, zMax)

        if (xMin < 0 || xMin > xMax) return null

        return this.getPoint(xMin)
    }
    cast(objects: PrimitiveObject[]) {
        let nearestIntersection = null
        let nearestDistance = Infinity

        for (let i = 0; i < objects.length; ++i) {
            const object = objects[i]

            switch (object.constructor) {
                case Box: {
                    const intersection = this.intersectBox(<Box>(<unknown>object))

                    if (!intersection) continue

                    const distance = intersection.distanceToVector(this.startPoint)

                    if (distance < nearestDistance) {
                        nearestIntersection = intersection
                        nearestDistance = distance
                    }

                    break
                }

                default: {
                    throw 'Unsupported object type'
                }
            }
        }

        return nearestIntersection
    }
}
