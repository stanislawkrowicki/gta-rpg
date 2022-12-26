import type Vector3 from './Vector3'
import PrimitiveObject from './PrimitiveObject'

export default class Box extends PrimitiveObject {
    size: Vector3
    constructor(position: Vector3, rotation: Vector3) {
        super(position, rotation)
    }
}
