import type Vector3 from './Vector3'

export default abstract class PrimitiveObject {
    position: Vector3
    rotation: Vector3
    protected constructor(position: Vector3, rotation: Vector3) {
        this.position = position
        this.rotation = rotation
    }
}
