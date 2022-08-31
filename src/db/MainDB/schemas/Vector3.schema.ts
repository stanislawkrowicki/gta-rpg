import typegoose from '@typegoose/typegoose'

const { prop } = typegoose

export default class Vector3Schema {
    @prop() x: number
    @prop() y: number
    @prop() z: number
}
