import mongoose from 'mongoose'
import alt from 'alt-server'

import GroupSchema from '../../../../db/MainDB/schemas/groups/Group.schema'
import AccountSchema from '../../../../db/MainDB/schemas/accounts/Account.schema'
import SessionSchema from '../../../../db/MainDB/schemas/sessions/Session.schema'
import PropertySchema from '../../../../db/MainDB/schemas/properties/Property.schema'
import VehicleSchema from '../../../../db/MainDB/schemas/vehicles/Vehicle.schema'
import VehicleEquipmentSchema from '../../../../db/MainDB/schemas/equipments/VehicleEquipment.schema'
import NPCSchema from '../../../../db/MainDB/schemas/npcs/NPC.schema'


export default class MainDB {
    static NAME = 'rpg'

    static connection: mongoose.Connection

    static collections: {
        [key: string]: any,

        groups?: mongoose.Model<any>,
        accounts?: mongoose.Model<any>,

        sessions?: mongoose.Model<any>,

        properties?: mongoose.Model<any>,
        vehicles?: mongoose.Model<any>,

        vehicleEquipments?: mongoose.Model<any>
    } = {}

    static connect() {
        return MainDB.connection = mongoose.createConnection(`mongodb://${process.env['MONGODB_HOST']}:${process.env['MONGODB_PORT']}/${MainDB.NAME}`)
            .on('error', (error: unknown) => {
                alt.logError('~r~' + `Failed to connect to the database ${MainDB.NAME}`)
            }).on('connected', (event: unknown) => {
                alt.log('~lg~' + `Successfully connected to the database ~lb~${MainDB.NAME}`)

                MainDB.initializeCollections()
            }).on('disconnect', (error: unknown) => {
                alt.logError('~lr~' + 'Disconnected from the database')
            })
    }
    static addCollection<T>(modelName: string, schema: mongoose.Schema, collectionName: string) {
        MainDB.collections[collectionName] = MainDB.connection.model<T>(modelName, schema, collectionName)
    }
    static initializeCollections() {
        MainDB.addCollection('Group', GroupSchema, 'groups')
        MainDB.addCollection('Account', AccountSchema, 'accounts')

        MainDB.addCollection('Session', SessionSchema, 'sessions')

        MainDB.addCollection('Property', PropertySchema, 'properties')
        MainDB.addCollection('Vehicle', VehicleSchema, 'vehicles')

        MainDB.addCollection('VehicleEquipment', VehicleEquipmentSchema, 'vehicleEquipments')

        MainDB.addCollection('NPC', NPCSchema, 'npcs')
    }
}