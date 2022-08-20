import alt from 'alt-server'

import Utils from "../../../shared/utils/Utils"

import Logger from "../../logger/logger"

import QuickDB from "../../db/QuickDB"
import MainDB from "../../db/MainDB"

import VehicleSchema, {VehicleOwnerType} from "../../../../../db/MainDB/schemas/vehicles/Vehicle.schema"

import World from '../World'
import Vector3 from '../../../shared/utils/Vector3'
import ServerEvent from '../../../shared/events/ServerEvent'
import VehicleEntranceStates from '../../../shared/events/server/world/vehicles/VehicleEntranceStates'

export default class Vehicles {
    private static REDIS_VEHICLE_KEY = 'WorldVehicle'

    static async initialize() {
        await Vehicles.spawnVehiclesInWorld()

        const entranceAcknowledgeStateNotifier = alt.setInterval(() => {
            for(let i = 0; i < World.players.length; ++i) {
                const player = World.players[i]

                const vehiclesInAcknowledgeRange: VehicleEntranceStates['states'] = []

                for(let j = 0; j < World.vehicles.length; ++j) {
                    const vehicle = World.vehicles[j]

                    if(Vector3.getDistanceBetweenTwoVectors(player.wrapped.pos, vehicle.wrapped.pos) < 10) {
                        vehiclesInAcknowledgeRange.push({
                            vehicleId: vehicle.wrapped.id,
                            canEnterAsDriver: true,
                            canEnterAsPassenger: true
                        })
                    }
                }

                ServerEvent.emit(player, new VehicleEntranceStates(vehiclesInAcknowledgeRange))
            }
        }, 1500)
    }

    static async spawnVehiclesInWorld() {
        const vehiclesInWorld = await QuickDB.client
            .execute(['KEYS', `${Vehicles.REDIS_VEHICLE_KEY}:*`]) as string[]

        const BATCH_SIZE = 100

        for (let batch = 0; batch < Math.ceil(vehiclesInWorld.length / BATCH_SIZE); batch++) {
            const keys = vehiclesInWorld.slice(batch * BATCH_SIZE, (batch + 1) * BATCH_SIZE)
            const ids = keys.map((key) => key.split(':')[1])

            MainDB.collections.vehicles.find({
                _id: { $in: ids }
            }).then((vehiclesFromDB) => {
                VEHICLES_FROM_DB_LOOP:
                for (let i = 0; i < vehiclesFromDB.length; i++) {
                    const vehicle = vehiclesFromDB[i]

                    const vehiclesAlreadySpawned = alt.Vehicle.all

                    for (let alreadySpawnedIndex = 0; alreadySpawnedIndex < vehiclesAlreadySpawned.length; alreadySpawnedIndex++) {
                        if (vehiclesAlreadySpawned[alreadySpawnedIndex].getMeta('id') === vehicle._id.toString()) // TODO: Vehicle wrappers meta
                            continue VEHICLES_FROM_DB_LOOP
                    }

                    const spawnedVehicle = new alt.Vehicle(vehicle.model,
                        vehicle.position.x,
                        vehicle.position.y,
                        vehicle.position.z,
                        0,
                        vehicle.position.ry,
                        vehicle.position.rz)

                    spawnedVehicle.setMeta('id', vehicle._id.toString())
                }
            }).catch((err) => {
                Logger.caughtError('vehicles', 0, err, 'Error while finding and spawning vehicles')
            })
        }
    }

    static async addVehicle() {
        await MainDB.collections.vehicles.create(
            Utils.typeCheck<VehicleSchema>({
                model: -344943009,
                ownerType: VehicleOwnerType.INDIVIDUAL,
                position: {x: -695.195617675781, y: 283.94725036621094, z: 83.85205078125, rz: 0, ry: 0}
            })
        )
    }
}