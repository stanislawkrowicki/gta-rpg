import alt from "alt-client"
import type {IStorehousePersonalVehicleData} from "../../shared/world/vehicles/VehicleStorehouse"
import Mouse, {MouseMode} from "../input/Mouse"
import native from "natives"
import ClientEvent from "../../shared/events/ClientEvent"
import TakeVehicleOut from "../../shared/events/client/world/vehicles/vehicle_storehouse/TakeVehicleOut"

export default class VehicleStorehouse {
    static webview: alt.WebView

    static controlAction: number

    static initialize() {}

    static openPanel(playerVehicles: IStorehousePersonalVehicleData[]) {
        VehicleStorehouse.webview = new alt.WebView('resource/client/webviews/vehicle_storehouse_panel/index.html')

        VehicleStorehouse.webview.focus()
        Mouse.setMode(MouseMode.SCREEN_POINTING)

        const playerVehiclesFormatted: { id: string; model: string; }[] = []

        playerVehicles.forEach((veh) => {
            playerVehiclesFormatted.push({
                id: veh.id,
                model: native.getLabelText(native.getDisplayNameFromVehicleModel(veh.model))
            })
        })

        VehicleStorehouse.webview.once('load', () => {
            VehicleStorehouse.webview.emit('PLAYER_VEHICLES', playerVehiclesFormatted)
        })

        VehicleStorehouse.webview.on('CLOSE', VehicleStorehouse.closePanel)

        VehicleStorehouse.webview.on('TAKE_VEHICLE_OUT', VehicleStorehouse.takeVehicleOut)
    }

    static closePanel() {
        if (VehicleStorehouse.webview) {
            VehicleStorehouse.webview.destroy()
            Mouse.setMode(MouseMode.CAMERA_CONTROL)
        }
    }

    static takeVehicleOut(id: string) {
        ClientEvent.emitEvent(new TakeVehicleOut(id))
    }
}