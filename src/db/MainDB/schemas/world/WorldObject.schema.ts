import { prop } from '@typegoose/typegoose'
import Vector3Schema from '../Vector3.schema'
import WorldEntitySchema from './WorldEntity.schema'

export default class WorldObjectSchema extends WorldEntitySchema {
    @prop() hash: string | number
    @prop() position: Vector3Schema
    @prop() rotation: Vector3Schema
}
