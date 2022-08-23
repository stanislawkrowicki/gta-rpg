import alt from 'alt-server'

import Utils from "../../../shared/utils/Utils"

import Logger from "../../logger/logger"

import QuickDB from "../../db/QuickDB"
import MainDB from "../../db/MainDB"

import VehicleSchema, {VehicleOwnerType} from "../../../../../db/MainDB/schemas/vehicles/Vehicle.schema"

import World from '../World'
import Vehicle from "../Vehicle"

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

    static spawnWorldVehicleFromDB(id: string, pos: alt.Vector3, rot: alt.Vector3) {
        /* spawnWorldVehicleFromDB spawns a vehicle at the position you specify.
        This position will be saved on the next vehicle saver worker iteration.
        This will also push the vehicle to Redis, so remember of the case when it was pushed to Redis but
        position was not updated yet. */

        MainDB.collections.vehicles.findById(id)
            .then((vehicle) => {
                if (!vehicle) {
                    Logger.logCaughtError('vehicles', 0, 'spawnWorldVehicleFromDB find returned void').then()
                    return
                }

                new Vehicle(new alt.Vehicle(vehicle.model, pos, rot), vehicle.id)

                QuickDB.client.execute(['SET', `${Vehicles.REDIS_VEHICLE_KEY}:${vehicle.id}`, 0])
                    .catch((err) => Logger.logCaughtError('vehicles',
                        0,
                        err,
                        'spawnWorldVehicleFromDB failed to push vehicle to Redis'))
            })
            .catch((err) => Logger.logCaughtError('vehicles',
                1,
                err,
                'spawnWorldVehicleFromDB find caught'))
    }

    static despawnWorldVehicle(wrapper: Vehicle) {
        MainDB.collections.vehicles.updateOne({ _id: wrapper.id }, { $unset: { position: true } }, { omitUndefined: false })
            .then(() => {
                wrapper.wrapped.destroy()

                QuickDB.client.execute(['DEL', `${Vehicles.REDIS_VEHICLE_KEY}:${wrapper.id}`])
                    .catch(err => Logger.logCaughtError('vehicles', 2, err, 'Failed to delete vehicle from Redis'))
            })
            .catch(err => Logger.logCaughtError('vehicles', 3, err, 'Error while despawning world vehicle'))
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

                    if (vehicle.position === undefined) {
                        QuickDB.client.execute(['DEL', `${Vehicles.REDIS_VEHICLE_KEY}:${vehicle.id}`])
                            .catch((err) => Logger.logCaughtError('vehicles',
                                2,
                                err,
                                'Error while deleting vehicle from Redis cause position undefined'))
                        continue VEHICLES_FROM_DB_LOOP
                    }

                    const vehiclesAlreadySpawned = alt.Vehicle.all

                    for (let alreadySpawnedIndex = 0; alreadySpawnedIndex < vehiclesAlreadySpawned.length; alreadySpawnedIndex++) {
                        if (!vehiclesAlreadySpawned[alreadySpawnedIndex].getMeta('wrapper'))
                            continue VEHICLES_FROM_DB_LOOP

                        if ((vehiclesAlreadySpawned[alreadySpawnedIndex].getMeta('wrapper') as Vehicle).id === vehicle.id)
                            continue VEHICLES_FROM_DB_LOOP
                    }

                    new Vehicle(new alt.Vehicle(vehicle.model,
                        vehicle.position.x,
                        vehicle.position.y,
                        vehicle.position.z,
                        0,
                        vehicle.position.ry,
                        vehicle.position.rz),
                    vehicle.id)

                }
            }).catch((err) => {
                Logger.logCaughtError('vehicles', 0, err, 'Error while finding and spawning vehicles')
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