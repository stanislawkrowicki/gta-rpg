/// #if CLIENT
import Hub from '../../../../client/Hub'
/// #endif

import ServerEvent from '../../ServerEvent'

export default class LocationSelectStage extends ServerEvent {
    constructor() {
        super()
    }

    /// #if CLIENT
    static onHandle(object: LocationSelectStage) {
        Hub.locationSelectStage()
    }
    /// #endif
}
