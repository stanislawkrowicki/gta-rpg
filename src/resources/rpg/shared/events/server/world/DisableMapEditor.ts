/// #if CLIENT
import MapEditor from 'rpg/client/world/MapEditor'
/// #endif

import ServerEvent from '../../ServerEvent'

export default class DisableMapEditor extends ServerEvent {
    constructor() {
        super()
    }

    /// #if CLIENT
    static onHandle(object: DisableMapEditor): void {
        MapEditor.deinitialize()
    }
    /// #endif
}
