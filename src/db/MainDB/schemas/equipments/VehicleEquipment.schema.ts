import { prop } from '@typegoose/typegoose'
import type { Ref } from '@typegoose/typegoose'
import AccountSchema from '../accounts/Account.schema'

export class ProductionInfo {
    @prop() date: Date
}

export default class VehicleEquipment {
    @prop({ ref: AccountSchema }) owners: Ref<AccountSchema>[]

    @prop() productionInfo = ProductionInfo
}