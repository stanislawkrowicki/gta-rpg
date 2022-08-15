import typegoose from '@typegoose/typegoose'
import type { Ref } from '@typegoose/typegoose'
import AccountSchema from '../accounts/Account.schema'
import VehicleEquipmentSchema from '../equipments/VehicleEquipment.schema'
import GroupSchema from "../groups/Group.schema"

const { prop } = typegoose

export enum VehicleOwnerType {
    INDIVIDUAL,
    GROUP
}

export class VehicleConditionSchema {

}

export class VehiclePositionSchema {
    @prop() x: number
    @prop() y: number
    @prop() z: number

    @prop() ry: number
    @prop() rz: number
}

export default class VehicleSchema {
    @prop() model: number

    @prop() ownerType: VehicleOwnerType

    // @prop({ ref: AccountSchema }) owners?: Ref<AccountSchema>[] | GroupSchema

    // @prop({ ref: VehicleEquipmentSchema }) equipment: Ref<VehicleEquipmentSchema>[]

    @prop() position: VehiclePositionSchema
}