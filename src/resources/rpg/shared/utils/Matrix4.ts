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
        a1 = 0, b1 = 0, c1 = 0, d1 = 0,
        a2 = 0, b2 = 0, c2 = 0, d2 = 0,
        a3 = 0, b3 = 0, c3 = 0, d3 = 0,
        a4 = 0, b4 = 0, c4 = 0, d4 = 0
    ) {
        this.a1 = a1, this.b1 = b1, this.c1 = c1, this.d1 = d1
        this.a2 = a2, this.b2 = b2, this.c2 = c2, this.d2 = d2
        this.a3 = a3, this.b3 = b3, this.c3 = c3, this.d3 = d3
        this.a4 = a4, this.b4 = b4, this.c4 = c4, this.d4 = d4
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
            this.a1 * matrix.a1 + this.b1 * matrix.a2 + this.c1 * matrix.a3 + this.d1 * matrix.a4,
            this.a1 * matrix.b1 + this.b1 * matrix.b2 + this.c1 * matrix.b3 + this.d1 * matrix.b4,
            this.a1 * matrix.c1 + this.b1 * matrix.c2 + this.c1 * matrix.c3 + this.d1 * matrix.c4,
            this.a1 * matrix.d1 + this.b1 * matrix.d2 + this.c1 * matrix.d3 + this.d1 * matrix.d4,

            this.a2 * matrix.a1 + this.b2 * matrix.a2 + this.c2 * matrix.a3 + this.d2 * matrix.a4,
            this.a2 * matrix.b1 + this.b2 * matrix.b2 + this.c2 * matrix.b3 + this.d2 * matrix.b4,
            this.a2 * matrix.c1 + this.b2 * matrix.c2 + this.c2 * matrix.c3 + this.d2 * matrix.c4,
            this.a2 * matrix.d1 + this.b2 * matrix.d2 + this.c2 * matrix.d3 + this.d2 * matrix.d4,

            this.a3 * matrix.a1 + this.b3 * matrix.a2 + this.c3 * matrix.a3 + this.d3 * matrix.a4,
            this.a3 * matrix.b1 + this.b3 * matrix.b2 + this.c3 * matrix.b3 + this.d3 * matrix.b4,
            this.a3 * matrix.c1 + this.b3 * matrix.c2 + this.c3 * matrix.c3 + this.d3 * matrix.c4,
            this.a3 * matrix.d1 + this.b3 * matrix.d2 + this.c3 * matrix.d3 + this.d3 * matrix.d4,

            this.a4 * matrix.a1 + this.b4 * matrix.a2 + this.c4 * matrix.a3 + this.d4 * matrix.a4,
            this.a4 * matrix.b1 + this.b4 * matrix.b2 + this.c4 * matrix.b3 + this.d4 * matrix.b4,
            this.a4 * matrix.c1 + this.b4 * matrix.c2 + this.c4 * matrix.c3 + this.d4 * matrix.c4,
            this.a4 * matrix.d1 + this.b4 * matrix.d2 + this.c4 * matrix.d3 + this.d4 * matrix.d4,
        )

        return product
    }

    getInverse() {
        const inverse = new Matrix4()

        const n11 = this.a1, n21 = this.b1, n31 = this.c1, n41 = this.d1
        const n12 = this.a2, n22 = this.b2, n32 = this.c2, n42 = this.d2
        const n13 = this.a3, n23 = this.b3, n33 = this.c3, n43 = this.d3
        const n14 = this.a4, n24 = this.b4, n34 = this.c4, n44 = this.d4

        const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44
        const t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44
        const t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44
        const t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34

        const d = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14

        if (d === 0) {
            throw("Matrix is not invertible")
        }

        const detInv = 1 / d

        inverse.a1 = t11 * detInv
        inverse.b1 = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv
        inverse.c1 = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv
        inverse.d1 = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv
        inverse.a2 = t12 * detInv
        inverse.b2 = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv
        inverse.c2 = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv
        inverse.d2 = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv
        inverse.a3 = t13 * detInv
        inverse.b3 = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv
        inverse.c3 = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv
        inverse.d3 = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv
        inverse.a4 = t14 * detInv
        inverse.b4 = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv
        inverse.c4 = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv
        inverse.d4 = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv

        return inverse
    }
}
