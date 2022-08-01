import { prop } from '@typegoose/typegoose'
import Vector3Schema from '../Vector3'

type Code = string

export default class NPCSchema {
    @prop() name: string

    @prop() position: Vector3Schema

    @prop() logic: Code
}