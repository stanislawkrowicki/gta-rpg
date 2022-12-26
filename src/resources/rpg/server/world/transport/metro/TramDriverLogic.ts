import NPCLogic from '../../npcs/NPCLogic'
import type NPC from '../../npcs/NPCTask'
import type RailCar from '../../vehicles/RailCar'
import TimetableEntry from './TimetableEntry'
import Vector3 from '../../../../shared/utils/Vector3'

export default class TramDriverLogic extends NPCLogic {
    static debugTimetable: TimetableEntry[] = [
        new TimetableEntry('1', new Vector3(100, 100, 100), 0),
        new TimetableEntry('2', new Vector3(200, 100, 100), 1000),
    ]

    static DECELERATION_POINT = 150

    npc: NPC
    tram: RailCar

    currentlyExecutedTimetable: TimetableEntry[] = []

    constructor(npc: NPC) {
        super()

        this.npc = npc
    }
    update() {
        const headingCarPosition = this.tram.wrapped.pos

        const timetableEntry = this.currentlyExecutedTimetable[0]

        const distance = Vector3.getDistanceBetweenTwoVectors(
            headingCarPosition,
            timetableEntry.position
        )

        if (distance < TramDriverLogic.DECELERATION_POINT) {
            this.tram.wrapped.trainCruiseSpeed -= 0.1
        }
    }
}
