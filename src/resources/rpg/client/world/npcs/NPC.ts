import natives from 'natives'
import type Vector3 from '../../../shared/utils/Vector3'
import PedType from '../../native/PedType'

export default class NPC {
    wrapped: number

    hash: number

    constructor(hash: number) {
        this.hash = hash
    }
    getPosition() {
        return natives.getWorldPositionOfEntityBone(this.wrapped, 0)
    }
    getHeading() {
        return natives.getEntityHeading(this.wrapped)
    }
    setPosition(position: Vector3) {
        natives.removePedElegantly(this.wrapped)

        this.spawn(position)
    }
    setHeading(value: number) {
        natives.setPedDesiredHeading(this.wrapped, value)
    }
    getBonePosition(boneIndex: number) {
        return natives.getWorldPositionOfEntityBone(this.wrapped, boneIndex)
    }
    spawn(position: Vector3) {
        this.wrapped = natives.createPed(
            PedType.CIV_MALE,
            this.hash,
            position.x,
            position.y,
            position.z,
            3374176,
            false,
            true
        )

        natives.setBlockingOfNonTemporaryEvents(this.wrapped, true)
    }
    walkTo(position: Vector3) {
        natives.taskGoStraightToCoord(
            this.wrapped,
            position.x,
            position.y,
            position.z,
            10,
            100,
            0,
            0
        )
    }
    walkToEntity(entityId: number) {
        natives.taskGoToEntity(this.wrapped, entityId, -1, 1.0, 10.0, 1073741824.0, 0)
    }
}
