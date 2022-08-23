import type VehicleStorehouse from "./VehicleStorehouse"
import VehicleStorehouses from "./VehicleStorehouses"
import type {Client} from "../../../index"
import Logger from "../../../logger/logger"
import Vehicles from "../Vehicles"
import alt from "alt-server"
import ServerEvent from "../../../../shared/events/ServerEvent"
import ClosePanel from "../../../../shared/events/server/world/vehicles/vehicle_storehouse/ClosePanel"

export default class VehicleStorehouseManager {
    static storehouses: VehicleStorehouse[] = []

    static lastInsertedID = 0

    static initialize() {
        VehicleStorehouses.forEach((storehouse) => {
            storehouse.ID = VehicleStorehouseManager.lastInsertedID++
            VehicleStorehouseManager.storehouses.push(storehouse)
        })
    }

    static takeVehicleOut(vehicleId: string, storehouseID: number, sourceClient: Client) {
        const storehouse = VehicleStorehouseManager.storehouses.find(sh => sh.ID === storehouseID)

        if (!storehouse) {
            Logger.error('vehicle_storehouse_manager', 0, 'Storehouse to take vehicle out of was not found')
                .then()
            return
        }

        const spawn = storehouse.vehicleSpawnColshapes[0]
        Vehicles.spawnWorldVehicleFromDB(vehicleId, new alt.Vector3(spawn.x, spawn.y, spawn.z), new alt.Vector3(0, 0 ,0))

        ServerEvent.emit(sourceClient, new ClosePanel())
    }
}