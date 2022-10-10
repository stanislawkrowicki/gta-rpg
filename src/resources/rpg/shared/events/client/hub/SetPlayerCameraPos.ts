/// #if SERVER
import type { Client } from 'rpg/server/core/client/Client'
/// #endif

import ClientEvent from '../../../events/ClientEvent'
import type altShared from 'alt-shared'

export default class SetPlayerCameraPos extends ClientEvent {
    pos: altShared.Vector3

    constructor(pos: altShared.Vector3) {
        super()
        this.pos = pos
    }

    /// #if SERVER
    static onHandle(client: Client, object: SetPlayerCameraPos) {
        if (!object.pos || !object.pos.x || !object.pos.y || !object.pos.z) {
            return this.logAsSuspicious(client, object)
        }

        client.wrapped.pos = object.pos
    }
    /// #endif
}
