import { prop } from '@typegoose/typegoose'
import type { Ref } from '@typegoose/typegoose'

export default class GroupSchema {
    @prop() name: string

    @prop({ ref: () => GroupSchema }) parents: Ref<GroupSchema>[]
}