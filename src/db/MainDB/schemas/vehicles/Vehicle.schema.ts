import { prop } from '@typegoose/typegoose'
import type { Ref } from '@typegoose/typegoose'
import AccountSchema from '../accounts/Account.schema'
import VehicleEquipmentSchema from '../equipments/VehicleEquipment.schema'

export default class VehicleSchema {
    @prop({ ref: AccountSchema }) owners: Ref<AccountSchema>[]

    @prop({ ref: VehicleEquipmentSchema }) equipment: Ref<VehicleEquipmentSchema>[]
}