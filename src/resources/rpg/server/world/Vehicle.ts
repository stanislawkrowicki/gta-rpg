import type alt from 'alt-server'
import World from "./World"

export default class Vehicle {
    id?: string

    wrapped: alt.Vehicle

    constructor(wrapped: alt.Vehicle, id?: string) {
        this.wrapped = wrapped
        if (id) this.id = id
        this.wrapped.setMeta('wrapper', this)
        World.vehicles.push(this)
    }
}