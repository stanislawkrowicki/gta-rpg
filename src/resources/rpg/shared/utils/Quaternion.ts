import Vector3 from './Vector3'
import Vector4 from './Vector4'

export default class Quaternion extends Vector4 {
    constructor(w: number, x: number, y: number, z: number) {
        super(x, y, z, w)
    }

    static rotationVec3ToQuaternion(rotation: Vector3) {
        const quaternion = new Vector4()

        Quaternion.rotationVec3ToQuaternionTo(rotation, quaternion)

        return quaternion
    }

    static rotationVec3ToQuaternionTo(rotation: Vector3, outputVector: Vector4) {
        let x = (rotation.x * Math.PI) / 180
        let y = (rotation.y * Math.PI) / 180
        let z = (rotation.z * Math.PI) / 180

        const w =
            Math.cos(x / 2) * Math.cos(y / 2) * Math.cos(z / 2) +
            Math.sin(x / 2) * Math.sin(y / 2) * Math.sin(z / 2)
        x =
            Math.sin(x / 2) * Math.cos(y / 2) * Math.cos(z / 2) -
            Math.cos(x / 2) * Math.sin(y / 2) * Math.sin(z / 2)
        y =
            Math.cos(x / 2) * Math.sin(y / 2) * Math.cos(z / 2) +
            Math.sin(x / 2) * Math.cos(y / 2) * Math.sin(z / 2)
        z =
            Math.cos(x / 2) * Math.cos(y / 2) * Math.sin(z / 2) -
            Math.sin(x / 2) * Math.sin(y / 2) * Math.cos(z / 2)

        outputVector.w = w
        outputVector.x = x
        outputVector.y = y
        outputVector.z = z
    }

    toVec3Rotation() {
        const vector = new Vector3()

        this.toVec3RotationTo(vector)

        return vector
    }

    toVec3RotationTo(outputVector: Vector3) {
        Quaternion.rotationQuaternionToVec3To(this, outputVector)
    }

    static rotationQuaternionToVec3(rotation: Vector4) {
        const vector = new Vector3()

        Quaternion.rotationQuaternionToVec3(rotation)

        return vector
    }

    static rotationQuaternionToVec3To(rotation: Vector4, outputVector: Vector3) {
        const r = rotation

        outputVector.x =
            (Math.atan2(2 * (r.w * r.x + r.y * r.z), 1 - 2 * (r.x * r.x + r.y * r.y)) * 180) /
            Math.PI
        outputVector.y = (Math.asin(2 * (r.w * r.y - r.z * r.x)) * 180) / Math.PI
        outputVector.z =
            (Math.atan2(2 * (r.w * r.z + r.x * r.y), 1 - 2 * (r.y * r.y + r.z * r.z)) * 180) /
            Math.PI
    }
}
