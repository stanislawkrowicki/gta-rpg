import type NPCTaskType from './NPCTaskType'

export default abstract class NPCTask {
    priority: number
    timeout: number

    type: NPCTaskType
    protected constructor(timeout: number) {
        this.timeout = timeout
    }
}
