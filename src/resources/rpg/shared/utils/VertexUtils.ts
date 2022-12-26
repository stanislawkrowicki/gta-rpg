import type Vector3 from './Vector3'
import Quaternion from './Quaternion'

export default class VertexUtils {
    static rotateVerticesAroundOrigin(vertices: Vector3[], rotation: Vector3, origin: Vector3) {
        const halfAngleX = rotation.x / 2
        const sinHalfAngleX = Math.sin(halfAngleX)
        const quaternionX = new Quaternion(
            Math.cos(halfAngleX),
            1 * sinHalfAngleX,
            0 * sinHalfAngleX,
            0 * sinHalfAngleX
        )

        const halfAngleY = rotation.y / 2
        const sinHalfAngleY = Math.sin(halfAngleY)
        const quaternionY = new Quaternion(
            Math.cos(halfAngleY),
            0 * sinHalfAngleY,
            1 * sinHalfAngleY,
            0 * sinHalfAngleY
        )

        const halfAngleZ = rotation.z / 2
        const sinHalfAngleZ = Math.sin(halfAngleZ)
        const quaternionZ = new Quaternion(
            Math.cos(halfAngleZ),
            0 * sinHalfAngleZ,
            0 * sinHalfAngleZ,
            1 * sinHalfAngleZ
        )

        const quaternion = new Quaternion(
            quaternionX.w * quaternionY.w * quaternionZ.w -
                quaternionX.x * quaternionY.x * quaternionZ.x -
                quaternionX.y * quaternionY.y * quaternionZ.y -
                quaternionX.z * quaternionY.z * quaternionZ.z,
            quaternionX.w * quaternionY.x * quaternionZ.w +
                quaternionX.x * quaternionY.w * quaternionZ.w +
                quaternionX.y * quaternionY.z * quaternionZ.x -
                quaternionX.z * quaternionY.y * quaternionZ.x,
            quaternionX.w * quaternionY.y * quaternionZ.w +
                quaternionX.y * quaternionY.w * quaternionZ.w +
                quaternionX.z * quaternionY.x * quaternionZ.y -
                quaternionX.x * quaternionY.z * quaternionZ.y,
            quaternionX.w * quaternionY.z * quaternionZ.w +
                quaternionX.z * quaternionY.w * quaternionZ.w +
                quaternionX.x * quaternionY.y * quaternionZ.z -
                quaternionX.y * quaternionY.x * quaternionZ.z
        )

        for (let i = 0; i < vertices.length; ++i) {
            const vertex = vertices[i]

            vertex.setXYZ(
                origin.x + 2 * (quaternion.w * (vertex.x - origin.x) + quaternion.y * (vertex.z - origin.z) - quaternion.z * (vertex.y - origin.y)),
                origin.y + 2 * (quaternion.w * (vertex.y - origin.y) + quaternion.z * (vertex.x - origin.x) - quaternion.x * (vertex.z - origin.z)),
                origin.z + 2 * (quaternion.w * (vertex.z - origin.z) + quaternion.x * (vertex.y - origin.y) - quaternion.y * (vertex.x - origin.x))
            )
        }
    }
}
