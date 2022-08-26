/// #if CLIENT
import Hub from "../../../../client/Hub"
/// #endif

import ServerEvent from "../../ServerEvent"

export default class Authorize extends ServerEvent {
    constructor() {
        super()
    }

    /// #if CLIENT
    static onHandle(object: Authorize) {
        Hub.locationSelectStage()
    }
    /// #endif
}