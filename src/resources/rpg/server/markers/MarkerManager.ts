import alt from 'alt-server'

import ClientEnterAcknowledgeColshape from '../../shared/events/server/markers/ClientEnterAcknowledgeColshape'
import ClientLeaveAcknowledgeColshape from '../../shared/events/server/markers/ClientLeaveAcknowledgeColshape'

import type { Marker } from '../../shared/markers/Markers'

import { Clients } from '../index'
import { emitEvent } from '../../shared/events/ServerEvent'

export default class MarkerManager {
    static markers: Marker[] = []

    static initialize() {
        alt.on('entityEnterColshape', MarkerManager.colshapeEnterListener)
        alt.on('entityLeaveColshape', MarkerManager.colshapeLeaveListener)
    }

    static add(marker: Marker) {
        MarkerManager.markers.push(marker)
    }

    private static colshapeEnterListener(colshape: alt.Colshape, entity: alt.Entity) {
        for (let i = 0; i < MarkerManager.markers.length; i++) {
            if (colshape === MarkerManager.markers[i].interactionColshape)
                MarkerManager.markers[i].onEnter(entity)
            else if (colshape === MarkerManager.markers[i].clientAcknowledgeColshape) {
                const client = Clients.find((client) => client.wrapped.id === entity.id)
                emitEvent(client, new ClientEnterAcknowledgeColshape(MarkerManager.markers[i]))
            }
        }
    }

    private static colshapeLeaveListener(colshape: alt.Colshape, entity: alt.Entity) {
        for (let i = 0; i < MarkerManager.markers.length; i++) {
            if (colshape === MarkerManager.markers[i].interactionColshape)
                MarkerManager.markers[i].onLeave(entity)
            else if (colshape === MarkerManager.markers[i].clientAcknowledgeColshape) {
                const client = Clients.find((client) => client.wrapped.id === entity.id)
                emitEvent(client, new ClientLeaveAcknowledgeColshape(MarkerManager.markers[i]))
            }
        }
    }
}