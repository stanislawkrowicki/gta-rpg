import type Vehicle from './Vehicle'
import type { Client } from '../index'

export default class World {
    static vehicles: Vehicle[] = []
    static players: Client[] = []
}
