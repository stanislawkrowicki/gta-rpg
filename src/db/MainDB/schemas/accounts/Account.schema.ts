import typegoose from '@typegoose/typegoose'
const { modelOptions, Severity } = typegoose
import type { Ref } from '@typegoose/typegoose'
import VehicleSchema from '../vehicles/Vehicle.schema'
import PropertySchema from '../properties/Property.schema'
import mongoose from 'mongoose'

const { prop } = typegoose

export class DiscordAccount {
    @prop() discordId: string
    @prop() token: string
}

class OwnedLandVehicles {
    @prop({ ref: () => VehicleSchema }) cars: Ref<VehicleSchema>[]
    @prop({ ref: () => VehicleSchema }) bikes: Ref<VehicleSchema>[]
}

class OwnedAircraftVehicles {
    @prop({ ref: () => VehicleSchema }) planes: Ref<VehicleSchema>[]
    @prop({ ref: () => VehicleSchema }) helicopters: Ref<VehicleSchema>[]
}

class OwnedWatercraftVehicles {
    @prop({ ref: () => VehicleSchema }) personal: Ref<VehicleSchema>[]
    @prop({ ref: () => VehicleSchema }) boats: Ref<VehicleSchema>[]
    @prop({ ref: () => VehicleSchema }) submarines: Ref<VehicleSchema>[]
}

class OwnedVehicles {
    @prop() land: OwnedLandVehicles
    @prop() aircraft: OwnedAircraftVehicles
    @prop() watercraft: OwnedWatercraftVehicles
}

class Owned {
    @prop() vehicles: OwnedVehicles
    @prop({ ref: () => PropertySchema }) properties: PropertySchema[]
    // @prop({ ref: BuildingSchema }) buildings: BuildingSchema[]
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export default class AccountSchema {
    @prop() _id: mongoose.Types.ObjectId
    @prop() name: string
    @prop({ maxlength: 319 }) email?: string
    @prop() passwordHash: string

    @prop() timePlayedTotal: number

    @prop() groups?: string[]

    @prop() individualPermissions: Record<string, any | boolean>

    @prop() owned?: Owned
}
