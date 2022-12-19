import { prop } from '@typegoose/typegoose'
import { MarkerType } from '../../../../resources/rpg/shared/world/markers/Markers'
import Vector3Schema from '../Vector3.schema'
import WorldEntitySchema from './WorldEntity.schema'

export default class WorldMarkerSchema extends WorldEntitySchema {
    @prop() markerType: MarkerType
    @prop() position: Vector3Schema
    @prop() scale: number
    @prop() vertices?: any
}
