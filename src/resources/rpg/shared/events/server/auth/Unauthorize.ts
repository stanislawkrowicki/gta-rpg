/// #if CLIENT
import Markers from '../../../../client/world/markers/Markers'
/// #endif

import ServerEvent from '../../ServerEvent'

export default class Unauthorize extends ServerEvent {
    constructor() {
        super()
    }

    /// #if CLIENT
    static onHandle(object: Unauthorize) {}
    /// #endif
}
