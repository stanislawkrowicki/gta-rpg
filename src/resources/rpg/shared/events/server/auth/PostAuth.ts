/// #if CLIENT
import postAuth from 'rpg/client/auth/PostAuth'
/// #endif

import ServerEvent from '../../ServerEvent'

export default class PostAuth extends ServerEvent {
    constructor() {
        super()
    }

    /// #if CLIENT
    static onHandle(object: PostAuth) {
        postAuth()
    }
    /// #endif
}
