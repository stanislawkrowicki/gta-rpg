import alt from 'alt-client'
import type {Marker} from "../../shared/markers/Markers"
import {CylinderMarker, MarkerType} from "../../shared/markers/Markers"
import native from "natives"

export default class Markers {
    static markersToRender: Marker[] = []

    static initialize() {
        alt.everyTick(() => {
            for (let i = 0; i < Markers.markersToRender.length; i++) {
                const marker = Markers.markersToRender[i]

                switch (marker.markerType) {
                case MarkerType.Cylinder:
                    const typedMarker = marker as CylinderMarker

                    native.drawMarker(typedMarker.nativeMarkerType,
                        typedMarker.pos.x,
                        typedMarker.pos.y,
                        typedMarker.pos.z,
                        0,
                        0,
                        0,
                        typedMarker.rot.x,
                        typedMarker.rot.y,
                        typedMarker.rot.z,
                        typedMarker.radius,
                        typedMarker.radius,
                        typedMarker.radius,
                        typedMarker.color.r,
                        typedMarker.color.g,
                        typedMarker.color.b,
                        typedMarker.color.a,
                        false,
                        false,
                        2,
                        false,
                        undefined,
                        undefined,
                        false)
                    break
                }
            }
        })
    }

    static startRenderingMarker(marker: Marker) {
        Markers.markersToRender.push(marker)
    }

    static stopRenderingMarker(marker: Marker) {
        const index = Markers.markersToRender.indexOf(marker)
        if (index > -1)
            Markers.markersToRender.splice(index, 1)
    }
}