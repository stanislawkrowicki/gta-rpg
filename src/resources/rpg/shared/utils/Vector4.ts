export default class Vector4 {
    x: number
    y: number
    z: number
    w: number
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    setXYZW(x: number, y: number, z: number, w: number) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    addXYZW(x: number, y: number, z: number, w: number) {
        this.x += x
        this.y += y
        this.z += z
        this.w += w

        return this
    }
    subXYZW(x: number, y: number, z: number, w: number) {
        this.x -= x
        this.y -= y
        this.z -= z
        this.w -= w

        return this
    }
    divXYZW(x: number, y: number, z: number, w: number) {
        this.x /= x
        this.y /= y
        this.z /= z
        this.w /= w

        return this
    }
    mulXYZW(x: number, y: number, z: number, w: number) {
        this.x *= x
        this.y *= y
        this.z *= z
        this.w *= w

        return this
    }

    dotXYZW(x: number, y: number, z: number, w: number) {
        let product = 0

        product += this.x * x
        product += this.y * y
        product += this.z * z
        product += this.w * w

        return product
    }

    set(vector: Vector4) {
        this.x = vector.x
        this.y = vector.y
        this.z = vector.z
        this.w = vector.w
    }

    add(vector: Vector4) {
        const output = new Vector4()

        this.addTo(vector, output)

        return this
    }

    addTo(vector: Vector4, output: Vector4) {
        output.x = this.x + vector.x
        output.y = this.y + vector.y
        output.z = this.z + vector.z
        output.w = this.w + vector.w
    }

    sub(vector: Vector4) {
        const output = new Vector4()

        this.subTo(vector, output)

        return this
    }

    subTo(vector: Vector4, output: Vector4) {
        output.x = this.x - vector.x
        output.y = this.y - vector.y
        output.z = this.z - vector.z
        output.w = this.w - vector.w
    }

    copy() {
        return new Vector4(this.x, this.y, this.z, this.w)
    }

    inverse() {
        const vector = new Vector4()

        this.inverseTo(vector)

        return vector
    }

    inverseTo(vector: Vector4) {
        vector.x = 1 / this.x
        vector.y = 1 / this.y
        vector.z = 1 / this.z
        vector.w = 1 / this.w
    }
}
