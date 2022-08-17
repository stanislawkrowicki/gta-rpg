import alt from 'alt-client'
import type {Marker} from "../../shared/markers/Markers"
import {CylinderMarker, CylinderMarkerData, MarkerData, MarkerType} from "../../shared/markers/Markers"
import native from "natives"

export default class Markers {
    static markersToRender: MarkerData[] = []

    static initialize() {
        alt.everyTick(() => {
            for (let i = 0; i < Markers.markersToRender.length; i++) {
                const markerData = Markers.markersToRender[i]

                switch (markerData.markerType) {
                case MarkerType.Cylinder:
                    const data = markerData as CylinderMarkerData

                    native.drawMarker(data.nativeMarkerType,
                        data.pos.x,
                        data.pos.y,
                        data.pos.z,
                        0,
                        0,
                        0,
                        data.rot.x,
                        data.rot.y,
                        data.rot.z,
                        data.radius * 2,
                        data.radius * 2,
                        data.height * 2,
                        data.color.r,
                        data.color.g,
                        data.color.b,
                        data.color.a,
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

    static startRenderingMarker(markerData: MarkerData) {
        Markers.markersToRender.push(markerData)
    }

    static stopRenderingMarker(markerData: MarkerData) {
        const index = Markers.markersToRender.findIndex(m => m.ID === markerData.ID)
        if (index > -1)
            Markers.markersToRender.splice(index, 1)
    }
}