/// #if CLIENT
import MapEditor from 'rpg/client/world/MapEditor'
/// #endif

import ServerEvent from '../../ServerEvent'

export default class EnableMapEditor extends ServerEvent {
    /// #if CLIENT
    static onHandle(object: EnableMapEditor): void {
        MapEditor.initialize()
    }
    /// #endif
}
