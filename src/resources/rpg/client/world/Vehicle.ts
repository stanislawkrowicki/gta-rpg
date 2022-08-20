import type alt from 'alt-client'

export default class Vehicle {
    wrapped: alt.Vehicle

    entranceState: {
        canEnterAsDriver?: boolean,
        canEnterAsPassenger?: boolean
    }
}