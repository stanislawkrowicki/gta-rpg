import alt from 'alt-server'
import {CylinderMarker} from "../../../shared/world/markers/Markers"
import MarkerManager from "../markers/MarkerManager"
import type {Client} from "../../index"
import MainDB from "../../db/MainDB"
import type {IStorehousePersonalVehicleData} from "../../../shared/world/vehicles/VehicleStorehouse"
import ClientEnterStorehouseMarker from "../../../shared/events/server/world/vehicles/vehicle_storehouse/ClientEnterStorehouseMarker"
import ServerEvent from "../../../shared/events/ServerEvent"
import Vehicles from "./Vehicles"
import type Vehicle from "../Vehicle"

export default class VehicleStorehouse { // TODO: This should not be static - there will be many storehouses on map
    // TODO: this should be rewritten to use cuboid colshapes, then check if they are empty
    static vehicleSpawnColshapes: { x: number; y: number; z: number }[] = [
        {x: -650, y: 250, z: 80}
    ]

    static initialize() {
        const panelMarker = new CylinderMarker(
            new alt.Vector3(-650, 260, 77),
            new alt.Vector3(0, 0, 0),
            5,
            5,
            new alt.RGBA(115, 125, 254, 255),
            VehicleStorehouse.onPlayerPanelMarkerEnter,
            () => {}, // TODO: set Marker enter/leave functions optional
            true,
            true,
            50
        )

        const vehicleLeaveZoneMarker = new CylinderMarker(
            new alt.Vector3(-650, 275, 77),
            new alt.Vector3(0, 0, 0),
            5,
            5,
            new alt.RGBA(255, 100, 100, 255),
            VehicleStorehouse.onVehicleLeaveZoneMarkerEnter,
            () => {},
            false,
            true,
            50
        )

        MarkerManager.add(panelMarker)
        MarkerManager.add(vehicleLeaveZoneMarker)
    }

    static onPlayerPanelMarkerEnter(entity: alt.Entity) {
        const player = alt.Player.all.find(p => p.id === entity.id) // TODO: this should be taken from World.Clients when its stable
        const wrapper = player.getMeta('wrapper') as Client

        if (player.vehicle) return

        MainDB.collections.vehicles.find().then((vehicles) => {
            const playerVehicles: IStorehousePersonalVehicleData[] = vehicles.map(veh => ({id: veh.id, model: veh.model} as IStorehousePersonalVehicleData))
            ServerEvent.emit(wrapper, new ClientEnterStorehouseMarker(playerVehicles))
        })
    }

    static onVehicleLeaveZoneMarkerEnter(entity: alt.Entity) {
        if (entity.type !== 1) return // if not vehicle

        if (!entity.getMeta('wrapper')) return

        const wrapper = entity.getMeta('wrapper') as Vehicle

        if (!wrapper.id) return // if is a temporary vehicle

        Vehicles.despawnWorldVehicle(wrapper)
    }

    static takeVehicleOut(vehicleId: string) {
        const spawn = VehicleStorehouse.vehicleSpawnColshapes[0]
        Vehicles.spawnWorldVehicleFromDB(vehicleId, new alt.Vector3(spawn.x, spawn.y, spawn.z), new alt.Vector3(0, 0 ,0))
    }
}