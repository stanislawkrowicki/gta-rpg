import alt from "alt-client"
import type {IPersonalVehicle} from "../../shared/vehicles/VehicleStorehouse"

export default class VehicleStorehouse {
    static webview: alt.WebView

    static initialize() {}

    static openPanel(playerVehicles: IPersonalVehicle[]) {
        VehicleStorehouse.webview = new alt.WebView('resource/client/webviews/vehicle_storehouse_panel/index.html')

        VehicleStorehouse.webview.once('load', () => {
            VehicleStorehouse.webview.emit('PLAYER_VEHICLES', playerVehicles)
        })
    }
}