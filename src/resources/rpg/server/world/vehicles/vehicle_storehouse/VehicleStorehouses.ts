import alt from 'alt-server'
import VehicleStorehouse from "./VehicleStorehouse"
import {CylinderMarker} from "../../../../shared/world/markers/Markers"

export default [
    new VehicleStorehouse(
        'Testowa przechowalnia pojazdów',
        new CylinderMarker(
            new alt.Vector3(-650, 260, 77),
            new alt.Vector3(0, 0, 0),
            2.5,
            5,
            new alt.RGBA(115, 125, 254, 255),
            () => {},
            () => {}, // TODO: set Marker enter/leave functions optional
            true,
            true,
            50
        ),
        [
            {x: -650, y: 250, z: 80}
        ],
        [
            new CylinderMarker(
                new alt.Vector3(-650, 275, 77),
                new alt.Vector3(0, 0, 0),
                5,
                5,
                new alt.RGBA(255, 100, 100, 255),
                () => {},
                () => {},
                false,
                true,
                50
            )
        ])
]