export default class Matrix3 {
    a1: number
    b1: number
    c1: number

    a2: number
    b2: number
    c2: number

    a3: number
    b3: number
    c3: number
    constructor(a1 = 0, b1 = 0, c1 = 0, a2 = 0, b2 = 0, c2 = 0, a3 = 0, b3 = 0, c3 = 0) {
        this.a1 = a1
        this.b1 = b1
        this.c1 = c1
        this.a2 = a2
        this.b2 = b2
        this.c2 = c2
        this.a3 = a3
        this.b3 = b3
        this.c3 = c3
    }

    dot(a: Matrix3, b: Matrix3) {
        const product = new Matrix3(
            a.a1 * b.a1 + a.b1 * b.a2 + a.c1 * b.a3,
            a.a1 * b.b1 + a.b1 * b.b2 + a.c1 * b.b3,
            a.a1 * b.c1 + a.b1 * b.c2 + a.c1 * b.c3,

            a.a2 * b.a1 + a.b2 * b.a2 + a.c2 * b.a3,
            a.a2 * b.b1 + a.b2 * b.b2 + a.c2 * b.b3,
            a.a2 * b.c1 + a.b2 * b.c2 + a.c2 * b.c3,

            a.a3 * b.a1 + a.b3 * b.a2 + a.c3 * b.a3,
            a.a3 * b.b1 + a.b3 * b.b2 + a.c3 * b.b3,
            a.a3 * b.c1 + a.b3 * b.c2 + a.c3 * b.c3
        )

        return product
    }

    rotate(degreesX: number, degreesY: number, degreesZ: number) {
        const radiansX = degreesX * (Math.PI / 180)
        const radiansY = degreesY * (Math.PI / 180)
        const radiansZ = degreesZ * (Math.PI / 180)

        const rMatrixX = new Matrix3(
            1,
            0,
            0,
            0,
            Math.cos(radiansX),
            -Math.sin(radiansX),
            0,
            Math.sin(radiansX),
            Math.cos(radiansX)
        )
        const rMatrixY = new Matrix3(
            Math.cos(radiansY),
            0,
            Math.sin(radiansY),
            0,
            1,
            0,
            -Math.sin(radiansY),
            0,
            Math.cos(radiansY)
        )
        const rMatrixZ = new Matrix3(
            Math.cos(radiansZ),
            -Math.sin(radiansZ),
            0,
            Math.sin(radiansZ),
            Math.cos(radiansZ),
            0,
            0,
            0,
            1
        )

        const result = new Matrix3(
            rMatrixX.a1 * rMatrixY.a1 * rMatrixZ.a1 +
                rMatrixX.a2 * rMatrixY.b1 * rMatrixZ.a2 +
                rMatrixX.a3 * rMatrixY.c1 * rMatrixZ.a3,
            rMatrixX.a1 * rMatrixY.a2 * rMatrixZ.b1 +
                rMatrixX.a2 * rMatrixY.b2 * rMatrixZ.b2 +
                rMatrixX.a3 * rMatrixY.c2 * rMatrixZ.b3,
            rMatrixX.a1 * rMatrixY.a3 * rMatrixZ.c1 +
                rMatrixX.a2 * rMatrixY.b3 * rMatrixZ.c2 +
                rMatrixX.a3 * rMatrixY.c3 * rMatrixZ.c3,

            rMatrixX.b1 * rMatrixY.a1 * rMatrixZ.a1 +
                rMatrixX.b2 * rMatrixY.b1 * rMatrixZ.a2 +
                rMatrixX.b3 * rMatrixY.c1 * rMatrixZ.a3,
            rMatrixX.b1 * rMatrixY.a2 * rMatrixZ.b1 +
                rMatrixX.b2 * rMatrixY.b2 * rMatrixZ.b2 +
                rMatrixX.b3 * rMatrixY.c2 * rMatrixZ.b3,
            rMatrixX.b1 * rMatrixY.a3 * rMatrixZ.c1 +
                rMatrixX.b2 * rMatrixY.b3 * rMatrixZ.c2 +
                rMatrixX.b3 * rMatrixY.c3 * rMatrixZ.c3,

            rMatrixX.c1 * rMatrixY.a1 * rMatrixZ.a1 +
                rMatrixX.c2 * rMatrixY.b1 * rMatrixZ.a2 +
                rMatrixX.c3 * rMatrixY.c1 * rMatrixZ.a3,
            rMatrixX.c1 * rMatrixY.a2 * rMatrixZ.b1 +
                rMatrixX.c2 * rMatrixY.b2 * rMatrixZ.b2 +
                rMatrixX.c3 * rMatrixY.c2 * rMatrixZ.b3,
            rMatrixX.c1 * rMatrixY.a3 * rMatrixZ.c1 +
                rMatrixX.c2 * rMatrixY.b3 * rMatrixZ.c2 +
                rMatrixX.c3 * rMatrixY.c3 * rMatrixZ.c3
        )

        {
            this.a1 = result.a1
            this.b1 = result.b1
            this.c1 = result.c1
            this.a2 = result.a2
            this.b2 = result.b2
            this.c2 = result.c2
            this.a3 = result.a3
            this.b3 = result.b3
            this.c3 = result.c3
        }

        return result
    }
}
