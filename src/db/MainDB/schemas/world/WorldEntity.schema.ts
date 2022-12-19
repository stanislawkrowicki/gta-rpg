import typegoose, { Ref } from '@typegoose/typegoose'
import { modelOptions, Severity } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import Vector3Schema from '../Vector3.schema'
import WorldEntityType from '../../../../resources/rpg/shared/world/WorldEntityType'
import WorldObjectSchema from './WorldObject.schema'
import WorldMarkerSchema from './WorldMarker.schema'
import WorldVehicleSchema from './WorldVehicle.schema'
import WorldEntityGroupSchema from './WorldEntityGroup.schema'

const { prop } = typegoose

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export default class WorldEntitySchema {
    _id: mongoose.Types.ObjectId

    @prop() type: WorldEntityType
    @prop() description: string
    @prop({ ref: () => WorldEntityGroupSchema }) group: Ref<WorldEntityGroupSchema>
    @prop({ ref: () => WorldEntitySchema }) parent?: Ref<WorldEntitySchema>
}
