import type Vector3 from '../../../shared/utils/Vector3'
import type NPCLogic from './NPCLogic'
import type alt from 'alt-server'
import type NPCTask from './NPCTask'

export default class NPC {
    wrapped: alt.Entity

    name: string

    position: Vector3
    heading: number

    movementSpeed = 5

    isInvincible = false

    logic: NPCLogic

    tasks: NPCTask[] = []

    constructor(name: string) {
        this.name = name
    }

    addTask(task: NPCTask) {
        this.tasks.push(task)
    }
}
