import type Vector3 from '../../../../shared/utils/Vector3'

export default class TimetableEntry {
    name: string
    position: Vector3
    approximateTimeOfArrival: number
    constructor(name: string, position: Vector3, time: number) {
        this.name = name
        this.position = position
        this.approximateTimeOfArrival = time
    }
}
