import alt from 'alt-client'
import type { IStorehousePersonalVehicleData } from '../../../../shared/world/vehicles/VehicleStorehouse'
import Mouse, { MouseMode } from '../../../input/Mouse'
import native from 'natives'
import ClientEvent from '../../../../shared/events/ClientEvent'
import TakeVehicleOut from '../../../../shared/events/client/world/vehicles/vehicle_storehouse/TakeVehicleOut'

export default class VehicleStorehouseManager {
    static webview: alt.WebView

    static controlAction: number

    static openPanel(
        storehouseID: number,
        storehouseDescription: string,
        playerVehicles: IStorehousePersonalVehicleData[]
    ) {
        VehicleStorehouseManager.webview = new alt.WebView(
            'resource/client/webviews/vehicle_storehouse_panel/index.html'
        )

        VehicleStorehouseManager.webview.focus()
        Mouse.setMode(MouseMode.SCREEN_POINTING)

        const playerVehiclesFormatted: { id: string; model: string }[] = []

        playerVehicles.forEach((veh) => {
            playerVehiclesFormatted.push({
                id: veh.id,
                model: native.getLabelText(native.getDisplayNameFromVehicleModel(veh.model)),
            })
        })

        VehicleStorehouseManager.webview.once('load', () => {
            VehicleStorehouseManager.webview.emit('STOREHOUSE_DESCRIPTION', storehouseDescription)
            VehicleStorehouseManager.webview.emit('PLAYER_VEHICLES', playerVehiclesFormatted)
        })

        VehicleStorehouseManager.webview.on('CLOSE', VehicleStorehouseManager.closePanel)

        VehicleStorehouseManager.webview.on('TAKE_VEHICLE_OUT', (vehicleId) => {
            VehicleStorehouseManager.takeVehicleOut(vehicleId, storehouseID)
        })
    }

    static closePanel() {
        if (VehicleStorehouseManager.webview) {
            VehicleStorehouseManager.webview.destroy()
            Mouse.setMode(MouseMode.CAMERA_CONTROL)
        }
    }

    static takeVehicleOut(vehicleId: string, storehouseID: number) {
        ClientEvent.emit(new TakeVehicleOut(vehicleId, storehouseID))
    }
}
