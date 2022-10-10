/// #if SERVER
import type { Client } from 'rpg/server/core/client/Client'
import altServer from 'alt-server'
/// #endif

import ClientEvent from '../../../events/ClientEvent'
import type altShared from 'alt-shared'

export default class LocationConfirm extends ClientEvent {
    spawnPosition: altShared.Vector3

    constructor(spawnPosition: altShared.Vector3) {
        super()
        this.spawnPosition = spawnPosition
    }

    /// #if SERVER
    static onHandle(client: Client, object: LocationConfirm) {
        if (
            !object.spawnPosition ||
            typeof object.spawnPosition.x !== 'number' ||
            typeof object.spawnPosition.y !== 'number' ||
            typeof object.spawnPosition.z !== 'number'
        ) {
            return this.logAsSuspicious(client, object)
        }

        const pos = object.spawnPosition
        client.wrapped.spawn(new altServer.Vector3(pos.x, pos.y, pos.z))
        client.wrapped.model = 'u_m_m_jesus_01'
    }
    /// #endif
}
