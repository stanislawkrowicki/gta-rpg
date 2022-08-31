import typegoose from '@typegoose/typegoose'
import Vector3Schema from '../Vector3.schema'

const { prop } = typegoose

type Code = string

export default class NPCSchema {
    @prop() name: string

    @prop() position: Vector3Schema

    @prop() logic: Code
}
