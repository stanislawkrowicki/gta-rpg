import NPCTask from '../NPCTask'
import NPCTaskType from '../NPCTaskType'

export default class PlayAnimation extends NPCTask {
    type = NPCTaskType.PLAY_ANIMATION

    animationId: number

    constructor(priority: number, howLong: number, animationId: number) {
        super(howLong)

        this.animationId = animationId
    }
}
