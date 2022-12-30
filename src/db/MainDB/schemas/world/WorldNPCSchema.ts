import { prop } from '@typegoose/typegoose'
import Vector3Schema from '../Vector3.schema'
import WorldEntitySchema from './WorldEntity.schema'

export default class WorldNPCSchema extends WorldEntitySchema {
    @prop() model: string | number
    @prop() position: Vector3Schema
}
