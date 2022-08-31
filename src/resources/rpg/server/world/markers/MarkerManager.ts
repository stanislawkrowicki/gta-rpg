import alt from 'alt-server'

import type { Marker } from '../../../shared/world/markers/Markers'

export default class MarkerManager {
    static markers: Marker[] = []

    static lastInsertedID = 0

    static initialize() {
        alt.on('entityEnterColshape', MarkerManager.colshapeEnterListener)
        alt.on('entityLeaveColshape', MarkerManager.colshapeLeaveListener)
    }

    static add(marker: Marker) {
        marker.markerData.id = MarkerManager.lastInsertedID++
        MarkerManager.markers.push(marker)
    }

    private static colshapeEnterListener(colshape: alt.Colshape, entity: alt.Entity) {
        for (let i = 0; i < MarkerManager.markers.length; i++) {
            if (colshape === MarkerManager.markers[i].clientInteractionZone)
                MarkerManager.markers[i].handleEnter(entity)
            else if (colshape === MarkerManager.markers[i].clientEnterAcknowledgeZone) {
                MarkerManager.markers[i].onAcknowledgeZoneEnter(entity)
            }
        }
    }

    private static colshapeLeaveListener(colshape: alt.Colshape, entity: alt.Entity) {
        for (let i = 0; i < MarkerManager.markers.length; i++) {
            if (colshape === MarkerManager.markers[i].clientInteractionZone)
                MarkerManager.markers[i].handleLeave(entity)
            else if (colshape === MarkerManager.markers[i].clientLeaveAcknowledgeZone) {
                MarkerManager.markers[i].onAcknowledgeZoneLeave(entity)
            }
        }
    }
}
