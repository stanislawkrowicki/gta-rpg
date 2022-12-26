import type { Client } from '../../core/client/Client'

import type NPC from '../npcs/NPCTask'
import type alt from 'alt-server'

enum DriverType {
    PLAYER,
    NPC,
}

export default class RailCar {
    wrapped: alt.Vehicle

    driverType: DriverType
    driver: Client | NPC

    attachedCars: RailCar

    constructor(wrapped: alt.Vehicle) {}

    addCar() {}
}
