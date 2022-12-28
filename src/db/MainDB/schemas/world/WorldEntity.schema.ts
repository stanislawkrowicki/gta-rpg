import typegoose, { Ref } from '@typegoose/typegoose'
import { modelOptions, Severity } from '@typegoose/typegoose'
import type mongoose from 'mongoose'
import WorldEntityType from '../../../../resources/rpg/shared/world/WorldEntityType'
import WorldEntityGroupSchema from './WorldEntityGroup.schema'

const { prop } = typegoose

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export default class WorldEntitySchema {
    _id: mongoose.Types.ObjectId

    @prop() type: WorldEntityType
    @prop() name: string
    @prop() description?: string
    @prop({ ref: () => WorldEntityGroupSchema }) group: Ref<WorldEntityGroupSchema>
}
