import NPCTask from '../NPCTask'
import NPCTaskType from '../NPCTaskType'

class LookAtEntity extends NPCTask {
    type = NPCTaskType.LOOK_AT_ENTITY
    entityId: number
    constructor(howLong: number, entityId: number) {
        super(howLong)

        this.entityId = entityId
    }
}
