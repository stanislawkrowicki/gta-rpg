import alt from 'alt-server'
import {CylinderMarker} from "../../shared/markers/Markers"
import MarkerManager from "../markers/MarkerManager"
import type {Client} from "../index"
import MainDB from "../db/MainDB"
import type {IPersonalVehicle} from "../../shared/vehicles/VehicleStorehouse"
import {emitEvent} from "../../shared/events/ServerEvent"
import ClientEnterStorehouseMarker from "../../shared/events/server/vehicle_storehouse/ClientEnterStorehouseMarker"

export default class VehicleStorehouse {
    static initialize() {
        const marker = new CylinderMarker(
            new alt.Vector3(-650, 260, 77),
            new alt.Vector3(0, 0, 0),
            5,
            5,
            new alt.RGBA(115, 125, 254, 255),
            VehicleStorehouse.onPlayerMarkerEnter,
            VehicleStorehouse.onPlayerMarkerLeave,
            true,
            true,
            50
        )

        MarkerManager.add(marker)
    }

    static onPlayerMarkerEnter(entity: alt.Entity) {
        const player = alt.Player.all.find(p => p.id === entity.id)
        const wrapper = player.getMeta('wrapper') as Client

        MainDB.collections.vehicles.find().then((vehicles) => {
            const playerVehicles: IPersonalVehicle[] = vehicles.map(veh => ({id: veh.id, model: veh.model} as IPersonalVehicle))
            alt.log(wrapper.wrapped.name)
            emitEvent(wrapper, new ClientEnterStorehouseMarker(playerVehicles))
        })
    }

    static onPlayerMarkerLeave() {}
}