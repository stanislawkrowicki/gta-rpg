import type Vehicle from './Vehicle'
import type { Client } from '../core/client/Client'

export default class World {
    static vehicles: Vehicle[] = []
    static players: Client[] = []
}
