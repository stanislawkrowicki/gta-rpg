import Vector3 from '../../../shared/utils/Vector3'
import natives from 'natives'
import PedType from '../../native/PedType'
import NPC from './NPC'

export default class NPCManager {
    static addNPC(hash: number) {
        natives.requestModel(hash)

        const npc = new NPC(hash)

        return npc
    }
}
