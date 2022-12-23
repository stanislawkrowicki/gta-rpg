import { prop } from '@typegoose/typegoose'
import WorldEntitySchema from './WorldEntity.schema'

export default class WorldVehicleSchema extends WorldEntitySchema {
    @prop() hash: string | number
    // TBD
}
