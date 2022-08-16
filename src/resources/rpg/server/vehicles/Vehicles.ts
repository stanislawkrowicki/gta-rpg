import alt from 'alt-server'
import QuickDB from "../db/QuickDB"
import MainDB from "../db/MainDB"
import Logger from "../logger/logger"
import VehicleStorehouse from "./VehicleStorehouse"
import VehicleSchema, {VehicleOwnerType} from "../../../../db/MainDB/schemas/vehicles/Vehicle.schema"
import Utils from "../../shared/utils/Utils"

export default class Vehicles {
    private static REDIS_VEHICLE_KEY = 'WorldVehicle'

    static async initialize() {
        await Vehicles.spawnVehiclesInWorld()

        VehicleStorehouse.initialize()
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