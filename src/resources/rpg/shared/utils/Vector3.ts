import type altShared from 'alt-shared'

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

    set(vec: Vector3) {
        this.x = vec.x
        this.y = vec.y
        this.z = vec.z
    }

    add(vec: Vector3) {
        this.x += vec.x
        this.y += vec.y
        this.z += vec.z

        return this
    }
    sub(vec: Vector3) {
        this.x -= vec.x
        this.y -= vec.y
        this.z -= vec.z

        return this
    }
    div(vec: Vector3) {
        this.x /= vec.x
        this.y /= vec.y
        this.z /= vec.z

        return this
    }
    mul(vec: Vector3) {
        this.x *= vec.x
        this.y *= vec.y
        this.z *= vec.z

        return this
    }

    dot(vec: Vector3) {
        let product = 0

        product += this.x * vec.x
        product += this.y * vec.y
        product += this.z * vec.z

        return product
    }
    cross(vec: Vector3) {
        const product = new Vector3()

        product.x = this.y * vec.z - this.z * vec.y
        product.y = this.z * vec.x - this.x * vec.z
        product.z = this.x * vec.y - this.y * vec.x

        return product
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

    static getDistanceBetweenTwoVectors(a: altShared.Vector3, b: altShared.Vector3): number {
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dz = b.z - a.z

        return Math.sqrt(dx * dx + dy * dy + dz * dz)
    }
}
