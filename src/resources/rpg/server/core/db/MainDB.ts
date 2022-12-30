import mongoose from 'mongoose'
import alt from 'alt-server'

import AccountSchema from '../../../../../db/MainDB/schemas/accounts/Account.schema'
import PropertySchema from '../../../../../db/MainDB/schemas/properties/Property.schema'
import VehicleSchema from '../../../../../db/MainDB/schemas/vehicles/Vehicle.schema'
import VehicleEquipmentSchema from '../../../../../db/MainDB/schemas/equipments/VehicleEquipment.schema'
import NPCSchema from '../../../../../db/MainDB/schemas/npcs/NPC.schema'
import GameDeviceSchema from '../../../../../db/MainDB/schemas/gameDevices/GameDevice.schema'
import { getDiscriminatorModelForClass, getModelForClass } from '@typegoose/typegoose'
import SuspiciousEventSchema from '../../../../../db/MainDB/schemas/suspiciousEvents/SuspiciousEvent.schema'
import TemporaryPermissionSchema from '../../../../../db/MainDB/schemas/temporaryPermissions/TemporaryPermission.schema'
import WorldEntitySchema from '../../../../../db/MainDB/schemas/world/WorldEntity.schema'
import WorldObjectSchema from '../../../../../db/MainDB/schemas/world/WorldObject.schema'
import WorldVehicleSchema from '../../../../../db/MainDB/schemas/world/WorldVehicle.schema'
import WorldMarkerSchema from '../../../../../db/MainDB/schemas/world/WorldMarker.schema'
import WorldNPCSchema from '../../../../../db/MainDB/schemas/world/WorldNPCSchema'
import WorldEntityGroupSchema from '../../../../../db/MainDB/schemas/world/WorldEntityGroup.schema'

interface IWorldEntityModels {
    objects: mongoose.Model<WorldObjectSchema>
    markers: mongoose.Model<WorldMarkerSchema>
    vehicles: mongoose.Model<WorldVehicleSchema>
    npcs: mongoose.Model<WorldNPCSchema>
}

export default class MainDB {
    static NAME = 'rpg'

    static connection: mongoose.Connection

    static isConnected = false

    static collections: {
        [key: string]: any

        gameDevices?: mongoose.Model<GameDeviceSchema>

        suspiciousEvents?: mongoose.Model<SuspiciousEventSchema>
        accounts?: mongoose.Model<AccountSchema>

        // sessions?: mongoose.Model<any>,

        // properties?: mongoose.Model<any>,
        vehicles?: mongoose.Model<VehicleSchema>
        //
        // vehicleEquipments?: mongoose.Model<any>
        temporaryPermissions?: mongoose.Model<TemporaryPermissionSchema>

        worldEntityGroups?: mongoose.Model<WorldEntityGroupSchema>
        worldEntities?: IWorldEntityModels
    } = {}

    static connect() {
        /// #if process.env['ENVIRONMENT'] !== 'prod'
        mongoose.set('debug', true)
        /// #endif

        return (MainDB.connection = mongoose
            .createConnection(
                `mongodb://${process.env['MONGODB_USER']}:${process.env['MONGODB_PASSWORD']}@${process.env['MONGODB_HOST']}:${process.env['MONGODB_PORT']}/${MainDB.NAME}`
            )
            .on('error', (error: unknown) => {
                alt.logError('~r~' + `Failed to connect to the database ${MainDB.NAME}`)
            })
            .on('connected', (event: unknown) => {
                alt.log('~lg~' + `Successfully connected to the database ~lb~${MainDB.NAME}`)

                MainDB.initializeCollections()

                MainDB.isConnected = true
            })
            .on('disconnect', (error: unknown) => {
                alt.logError('~lr~' + 'Disconnected from the database')

                const players = alt.Player.all

                for (let i = 0; i < players.length; ++i) {
                    players[i].kick('Problem with the server... Try to connect again later...')
                }

                MainDB.isConnected = false
            }))
    }
    static addCollection<T>(schema: any, collectionName: string) {
        MainDB.collections[collectionName] = getModelForClass(schema, {
            existingConnection: MainDB.connection,
            schemaOptions: {
                versionKey: false,
            },
            options: {
                customName: collectionName,
            },
        })
    }
    static initializeCollections() {
        MainDB.addCollection(GameDeviceSchema, 'gameDevices')

        MainDB.addCollection(SuspiciousEventSchema, 'suspiciousEvents')

        MainDB.addCollection(VehicleSchema, 'vehicles')
        MainDB.addCollection(AccountSchema, 'accounts')

        // MainDB.addCollection('Session', SessionSchema, 'sessions')

        // MainDB.addCollection('Property', PropertySchema, 'properties')

        // MainDB.addCollection('VehicleEquipment', VehicleEquipmentSchema, 'vehicleEquipments')

        // MainDB.addCollection('NPC', NPCSchema, 'npcs')

        MainDB.collections['temporaryPermissions'] = getModelForClass(TemporaryPermissionSchema, {
            existingConnection: MainDB.connection,
            schemaOptions: {
                versionKey: false,
                expireAfterSeconds: 0,
            },
            options: {
                customName: 'temporaryPermissions',
            },
        })

        MainDB.addCollection(WorldEntityGroupSchema, 'worldEntityGroups')

        const worldEntityModel = getModelForClass(WorldEntitySchema, {
            existingConnection: MainDB.connection,
            schemaOptions: {
                versionKey: false,
            },
            options: {
                customName: 'worldEntities',
            },
        })

        MainDB.collections['worldEntities'] = {
            objects: getDiscriminatorModelForClass(worldEntityModel, WorldObjectSchema, {
                existingConnection: MainDB.connection,
                schemaOptions: {
                    versionKey: false,
                },
                options: {
                    customName: 'worldEntities',
                },
            }),
            markers: getDiscriminatorModelForClass(worldEntityModel, WorldMarkerSchema, {
                existingConnection: MainDB.connection,
                schemaOptions: {
                    versionKey: false,
                },
                options: {
                    customName: 'worldEntities',
                },
            }),
            vehicles: getDiscriminatorModelForClass(worldEntityModel, WorldVehicleSchema, {
                existingConnection: MainDB.connection,
                schemaOptions: {
                    versionKey: false,
                },
                options: {
                    customName: 'worldEntities',
                },
            }),
            npcs: getDiscriminatorModelForClass(worldEntityModel, WorldNPCSchema, {
                existingConnection: MainDB.connection,
                schemaOptions: {
                    versionKey: false,
                },
                options: {
                    customName: 'worldEntities',
                },
            }),
        }
    }
}
