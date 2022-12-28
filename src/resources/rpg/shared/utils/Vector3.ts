import type altShared from 'alt-shared'
import type Matrix3 from './Matrix3'
import type Matrix4 from './Matrix4'

export default class Vector3 {
    x: number
    y: number
    z: number
    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    copy() {
        return new Vector3(this.x, this.y, this.z)
    }

    setXYZ(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    addXYZ(x: number, y: number, z: number) {
        this.x += x
        this.y += y
        this.z += z

        return this
    }
    subXYZ(x: number, y: number, z: number) {
        this.x -= x
        this.y -= y
        this.z -= z

        return this
    }
    divXYZ(x: number, y: number, z: number) {
        this.x /= x
        this.y /= y
        this.z /= z

        return this
    }
    mulXYZ(x: number, y: number, z: number) {
        this.x *= x
        this.y *= y
        this.z *= z

        return this
    }

    dotXYZ(x: number, y: number, z: number) {
        let product = 0

        product += this.x * x
        product += this.y * y
        product += this.z * z

        return product
    }
    crossXYZ(x: number, y: number, z: number) {
        const product = new Vector3()

        product.x = this.y * z - this.z * y
        product.y = this.z * x - this.x * z
        product.z = this.x * y - this.y * x

        return product
    }

    set(vector: Vector3 | altShared.Vector3) {
        this.x = vector.x
        this.y = vector.y
        this.z = vector.z
    }

    add(vector: Vector3 | altShared.Vector3) {
        this.x += vector.x
        this.y += vector.y
        this.z += vector.z

        return this
    }

    addTo(vector: Vector3 | altShared.Vector3, output: Vector3) {
        Vector3.addTo(this, vector, output)
    }

    static addTo(a: Vector3 | altShared.Vector3, b: Vector3 | altShared.Vector3, output: Vector3) {
        output.x = a.x + b.x
        output.y = a.y + b.y
        output.z = a.z + b.z

        return output
    }

    sub(vector: Vector3) {
        this.x -= vector.x
        this.y -= vector.y
        this.z -= vector.z

        return this
    }

    subTo(vector: Vector3 | altShared.Vector3, output: Vector3) {
        Vector3.subTo(this, vector, output)
    }

    static subTo(a: Vector3 | altShared.Vector3, b: Vector3 | altShared.Vector3, output: Vector3) {
        output.x = a.x - b.x
        output.y = a.y - b.y
        output.z = a.z - b.z

        return output
    }

    div(vector: Vector3) {
        this.x /= vector.x
        this.y /= vector.y
        this.z /= vector.z

        return this
    }

    divTo(vector: Vector3 | altShared.Vector3, output: Vector3) {
        Vector3.divTo(this, vector, output)
    }

    static divTo(a: Vector3 | altShared.Vector3, b: Vector3 | altShared.Vector3, output: Vector3) {
        output.x = a.x / b.x
        output.y = a.y / b.y
        output.z = a.z / b.z

        return output
    }

    mul(vector: Vector3) {
        this.x *= vector.x
        this.y *= vector.y
        this.z *= vector.z

        return this
    }

    mulTo(vector: Vector3 | altShared.Vector3, output: Vector3) {
        Vector3.mulTo(this, vector, output)
    }

    static mulTo(a: Vector3 | altShared.Vector3, b: Vector3 | altShared.Vector3, output: Vector3) {
        output.x = a.x * b.x
        output.y = a.y * b.y
        output.z = a.z * b.z

        return output
    }

    mulByScalar(scalar: number) {
        this.mulByScalarTo(scalar, this)

        return this
    }

    mulByScalarTo(scalar: number, output: Vector3) {
        Vector3.mulByScalarTo(this, scalar, output)
    }

    static mulByScalarTo(vector: Vector3 | altShared.Vector3, scalar: number, output: Vector3) {
        output.x = vector.x * scalar
        output.y = vector.y * scalar
        output.z = vector.z * scalar
    }

    normalize() {
        this.normalizeTo(this)

        return this
    }

    normalizeTo(output: Vector3) {
        Vector3.normalizeTo(this, output)
    }

    static normalizeTo(vector: Vector3 | altShared.Vector3, output: Vector3) {
        const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z)

        output.x = vector.x / length
        output.y = vector.y / length
        output.z = vector.z / length
    }

    dot(vector: Vector3 | altShared.Vector3) {
        return Vector3.dot(this, vector)
    }

    static dot(a: Vector3 | altShared.Vector3, b: Vector3 | altShared.Vector3) {
        let product = 0

        product += a.x * b.x
        product += a.y * b.y
        product += a.z * b.z

        return product
    }

    dotFromMatrix3(matrix: Matrix3) {
        const product = new Vector3()

        this.dotFromMatrix3To(matrix, product)

        return product
    }

    dotFromMatrix3To(matrix: Matrix3, productOutput: Vector3) {
        Vector3.dotFromMatrix3To(this, matrix, productOutput)
    }

    static dotFromMatrix3To(
        vector: Vector3 | altShared.Vector3,
        matrix: Matrix3,
        productOutput: Vector3
    ) {
        productOutput.x = matrix.a1 * vector.x + matrix.a2 * vector.y + matrix.a3 * vector.z
        productOutput.y = matrix.b1 * vector.x + matrix.b2 * vector.y + matrix.b3 * vector.z
        productOutput.z = matrix.c1 * vector.x + matrix.c2 * vector.y + matrix.c3 * vector.z
    }

    cross(vector: Vector3 | altShared.Vector3) {
        const product = new Vector3()

        this.crossTo(vector, product)

        return product
    }

    crossTo(vector: Vector3 | altShared.Vector3, productOutput: Vector3) {
        Vector3.crossTo(this, vector, productOutput)
    }

    static crossTo(
        a: Vector3 | altShared.Vector3,
        b: Vector3 | altShared.Vector3,
        productOutput: Vector3
    ) {
        productOutput.x = a.y * b.z - a.z * b.y
        productOutput.y = a.z * b.x - a.x * b.z
        productOutput.z = a.x * b.y - a.y * b.x
    }

    unprojectTo(matrix: Matrix4, outputVector: Vector3) {
        Vector3.unprojectTo(this, matrix, outputVector)
    }

    static unprojectTo(
        vector: Vector3 | altShared.Vector3,
        matrix: Matrix4,
        outputVector: Vector3
    ) {
        const invertedProjectionMatrix = matrix.getInverse()

        outputVector.applyMatrix4(invertedProjectionMatrix)
    }

    applyMatrix4(matrix: Matrix4) {
        this.applyMatrix4To(matrix, this)
    }

    applyMatrix4To(matrix: Matrix4, outputVector: Vector3) {
        outputVector.x = matrix.a1 * this.x + matrix.b1 * this.y + matrix.c1 * this.z + matrix.d1
        outputVector.y = matrix.a2 * this.x + matrix.b2 * this.y + matrix.c2 * this.z + matrix.d2
        outputVector.z = matrix.a3 * this.x + matrix.b3 * this.y + matrix.c3 * this.z + matrix.d3
    }

    distanceToVector(vector: Vector3) {
        return Vector3.getDistanceBetweenTwoVectors(this, vector)
    }

    length(vector: Vector3) {
        const squareLength = vector.x * vector.x + vector.y * vector.y + vector.z * vector.z

        return Math.sqrt(squareLength)
    }

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

        return Math.sqrt(dx * dx + dy * dy + dz * dz)
    }

    static getDistanceBetweenTwoVectors(
        a: Vector3 | altShared.Vector3,
        b: Vector3 | altShared.Vector3
    ): number {
        return Vector3.getDistanceBetweenTwoXYZPoints(a.x, a.y, a.z, b.x, b.y, b.z)
    }
}
