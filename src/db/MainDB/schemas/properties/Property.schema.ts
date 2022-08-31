import typegoose from '@typegoose/typegoose'
import type { Ref } from '@typegoose/typegoose'
import AccountSchema from '../accounts/Account.schema'
import Vector3Schema from '../Vector3.schema'

const { prop } = typegoose

enum LockType {
    ELECTRONIC,
    MECHANICAL,
}

class EntranceLockSchema {
    @prop() position: Vector3Schema

    @prop({ enum: LockType }) lockType: LockType
}

class BuildingEntranceSchema {
    @prop() lock: EntranceLockSchema
}

class BuildingSchema {
    @prop({ ref: () => AccountSchema }) owners: Ref<AccountSchema>[]

    @prop({ type: () => Vector3Schema }) floorArea: Vector3Schema[]

    @prop({ type: () => BuildingEntranceSchema }) entrances: BuildingEntranceSchema[]
}

export default class PropertySchema {
    @prop({ ref: () => AccountSchema }) owners: Ref<AccountSchema>[]

    @prop({ type: () => Vector3Schema }) lotArea: Vector3Schema[]

    @prop({ type: () => BuildingSchema }) buildings: BuildingSchema[]
}
