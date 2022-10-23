/// #if CLIENT
import Hub from '../../../../client/Hub'
/// #endif

import ServerEvent from '../../ServerEvent'

export default class InitializeHub extends ServerEvent {
    constructor() {
        super()
    }

    /// #if CLIENT
    static onHandle(object: InitializeHub) {
        Hub.initialize()
    }
    /// #endif
}
