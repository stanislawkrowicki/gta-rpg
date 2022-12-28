export default class Vector2 {
    x: number
    y: number
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    setXY(x: number, y: number) {
        this.x = x
        this.y = y
    }

    addXY(x: number, y: number) {
        this.x += x
        this.y += y
    }
    subXY(x: number, y: number) {
        this.x -= x
        this.y -= y
    }
    divXY(x: number, y: number) {
        this.x /= x
        this.y /= y
    }
    mulXY(x: number, y: number) {
        this.x *= x
        this.y *= y
    }

    dotXY(x: number, y: number, z: number) {
        let product = 0

        product += this.x * x
        product += this.y * y

        return product
    }

    set(vec: Vector2) {
        this.x = vec.x
        this.y = vec.y
    }

    add(vec: Vector2) {
        this.x += vec.x
        this.y += vec.y

        return this
    }
    sub(vec: Vector2) {
        this.x -= vec.x
        this.y -= vec.y

        return this
    }
    div(vec: Vector2) {
        this.x /= vec.x
        this.y /= vec.y

        return this
    }
    mul(vec: Vector2) {
        this.x *= vec.x
        this.y *= vec.y

        return this
    }

    dot(vec: Vector2) {
        let product = 0

        product += this.x * vec.x
        product += this.y * vec.y

        return product
    }
}
