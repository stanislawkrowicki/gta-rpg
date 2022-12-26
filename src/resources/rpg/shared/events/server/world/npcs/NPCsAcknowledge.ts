/// #if CLIENT

/// #endif

import ServerEvent from '../../../ServerEvent'
import type NPCData from '../../../../world/npcs/NPCData'

export default class NPCsAcknowledge extends ServerEvent {
    npcsData: NPCData[]

    constructor(npcsData: NPCData[]) {
        super()
        this.npcsData = npcsData
    }

    /// #if CLIENT
    static onHandle(object: NPCsAcknowledge) {}
    /// #endif
}
