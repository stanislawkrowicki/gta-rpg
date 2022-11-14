import type alt from 'alt-server'
import type { Marker } from '../../../../shared/world/markers/Markers'
import MarkerManager from '../../markers/MarkerManager'
import MainDB from '../../../core/db/MainDB'
import type { IStorehousePersonalVehicleData } from '../../../../shared/world/vehicles/VehicleStorehouse'
import ClientEnterStorehouseMarker from '../../../../shared/events/server/world/vehicles/vehicle_storehouse/ClientEnterStorehouseMarker'
import ServerEvent from '../../../../shared/events/ServerEvent'
import Vehicles from '../Vehicles'
import type Vehicle from '../../Vehicle'
import Clients from 'rpg/server/core/client/Clients'

export default class VehicleStorehouse {
    ID: number

    description: string

    // TODO: this should be rewritten to use cuboid colshapes, then check if they are empty
    vehicleSpawnColshapes: { x: number; y: number; z: number }[]

    panelMarker: Marker
    vehicleLeaveZoneMarkers: Marker[]

    constructor(
        description: string,
        panelMarker: Marker,
        vehicleSpawnColshapes: { x: number; y: number; z: number }[],
        vehicleLeaveZoneMarkers: Marker[]
    ) {
        /* All markers passed should not be yet added to MarkerManager, and their onEnter functions will be overwritten. */
        this.description = description
        this.panelMarker = panelMarker
        this.vehicleSpawnColshapes = vehicleSpawnColshapes
        this.vehicleLeaveZoneMarkers = vehicleLeaveZoneMarkers

        this.panelMarker.onEnter = this.onPlayerPanelMarkerEnter.bind(this)
        MarkerManager.add(this.panelMarker)

        this.vehicleLeaveZoneMarkers.forEach((leaveZone) => {
            leaveZone.onEnter = this.onVehicleLeaveZoneMarkerEnter.bind(this)
            MarkerManager.add(leaveZone)
        })
    }

    onPlayerPanelMarkerEnter(entity: alt.Entity) {
        const client = Clients.find((p) => p.wrapped.id === entity.id)

        if (client.wrapped.vehicle) return

        MainDB.collections.vehicles.find().then((vehicles) => {
            const playerVehicles: IStorehousePersonalVehicleData[] = vehicles.map(
                (veh) => ({ id: veh.id, model: veh.model } as IStorehousePersonalVehicleData)
            )
            ServerEvent.emit(
                client,
                new ClientEnterStorehouseMarker(this.ID, this.description, playerVehicles)
            )
        })
    }

    onVehicleLeaveZoneMarkerEnter(entity: alt.Entity) {
        if (entity.type !== 1) return // if not vehicle

        if (!entity.getMeta('wrapper')) return

        const wrapper = entity.getMeta('wrapper') as Vehicle

        if (!wrapper.id) return // if is a temporary vehicle

        Vehicles.despawnWorldVehicle(wrapper)
    }
}
