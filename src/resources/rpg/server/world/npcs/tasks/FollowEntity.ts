import NPCTask from '../NPCTask'
import NPCTaskType from '../NPCTaskType'

export default class FollowEntity extends NPCTask {
    type = NPCTaskType.FOLLOW_ENTITY
    entityId: number
    constructor(howLong: number, entityId: number) {
        super(howLong)
        this.entityId = entityId
    }
}
