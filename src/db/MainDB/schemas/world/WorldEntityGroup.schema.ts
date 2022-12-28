import { prop, Ref } from '@typegoose/typegoose'
import mongoose from 'mongoose'

export default class WorldEntityGroupSchema {
    _id: mongoose.Types.ObjectId

    @prop() name: string
    @prop() description?: string
    @prop({ ref: () => WorldEntityGroupSchema }) parent?: Ref<WorldEntityGroupSchema>
}
