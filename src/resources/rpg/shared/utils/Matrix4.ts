export default class Matrix4 {
    a1: number
    b1: number
    c1: number
    d1: number

    a2: number
    b2: number
    c2: number
    d2: number

    a3: number
    b3: number
    c3: number
    d3: number

    a4: number
    b4: number
    c4: number
    d4: number
    constructor(
        a1 = 0,
        b1 = 0,
        c1 = 0,
        d1 = 0,
        a2 = 0,
        b2 = 0,
        c2 = 0,
        d2 = 0,
        a3 = 0,
        b3 = 0,
        c3 = 0,
        d3 = 0,
        a4 = 0,
        b4 = 0,
        c4 = 0,
        d4 = 0
    ) {
        this.a1 = a1
        this.b1 = b1
        this.c1 = c1
        this.d1 = d1
        this.a2 = a2
        this.b2 = b2
        this.c2 = c2
        this.d2 = d2
        this.a3 = a3
        this.b3 = b3
        this.c3 = c3
        this.d3 = d3
        this.a4 = a4
        this.b4 = b4
        this.c4 = c4
        this.d4 = d4
    }

    getX() {
        return this.d1
    }

    getY() {
        return this.d2
    }

    getZ() {
        return this.d3
    }

    getRotationX() {
        return Math.atan2(this.b3, this.c3)
    }

    getRotationY() {
        return Math.atan2(-this.c1, this.a1)
    }

    getRotationZ() {
        return Math.atan2(this.b1, this.a1)
    }

    getScaleX() {
        return Math.sqrt(this.a1 * this.a1 + this.b1 * this.b1 + this.c1 * this.c1)
    }

    getScaleY() {
        return Math.sqrt(this.b1 * this.b1 + this.b2 * this.b2 + this.b3 * this.b3)
    }

    getScaleZ() {
        return Math.sqrt(this.c1 * this.c1 + this.c2 * this.c2 + this.c3 * this.c3)
    }

    dot(matrix: Matrix4) {
        const product = new Matrix4(
            this.a1 * matrix.a1 + this.b1 * matrix.a2 + this.c1 * matrix.a3,
            this.a1 * matrix.b1 + this.b1 * matrix.b2 + this.c1 * matrix.b3,
            this.a1 * matrix.c1 + this.b1 * matrix.c2 + this.c1 * matrix.c3,

            this.a2 * matrix.a1 + this.b2 * matrix.a2 + this.c2 * matrix.a3,
            this.a2 * matrix.b1 + this.b2 * matrix.b2 + this.c2 * matrix.b3,
            this.a2 * matrix.c1 + this.b2 * matrix.c2 + this.c2 * matrix.c3,

            this.a3 * matrix.a1 + this.b3 * matrix.a2 + this.c3 * matrix.a3,
            this.a3 * matrix.b1 + this.b3 * matrix.b2 + this.c3 * matrix.b3,
            this.a3 * matrix.c1 + this.b3 * matrix.c2 + this.c3 * matrix.c3
        )

        return product
    }
}
