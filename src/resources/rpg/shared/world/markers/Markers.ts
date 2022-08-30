/// #if SERVER
import altServer from 'alt-server'
import ServerEvent from "../../events/ServerEvent"
import ClientEnterAcknowledgeZone from "../../events/server/world/markers/ClientEnterAcknowledgeZone"
import ClientLeaveAcknowledgeZone from "../../events/server/world/markers/ClientLeaveAcknowledgeZone"
import type {Client} from "../../../server"
/// #endif

import type altShared from 'alt-shared'

export enum NativeMarkerType {
    UpsideDownCone = 0,
    VerticalCylinder = 1,
    ThickChevronUp = 2,
    ThinChevronUp = 3,
    CheckeredFlagRect = 4,
    CheckeredFlagCircle = 5,
    VerticalCircle = 6,
    PlaneModel = 7,
    LostMCDark = 8,
    LostMCLight = 9,
    Number0 = 10,
    Number1 = 11,
    Number2 = 12,
    Number3 = 13,
    Number4 = 14,
    Number5 = 15,
    Number6 = 16,
    Number7 = 17,
    Number8 = 18,
    Number9 = 19,
    ChevronUpx1 = 20,
    ChevronUpx2 = 21,
    ChevronUpx3 = 22,
    HorizontalCircleFat = 23,
    ReplayIcon = 24,
    HorizontalCircleSkinny = 25,
    HorizontalCircleSkinny_Arrow = 26,
    HorizontalSplitArrowCircle = 27,
    DebugSphere = 28,
    DollarSign = 29,
    HorizontalBars = 30,
    WolfHead = 31,
}

export enum MarkerType {
    Cylinder
}

export type OnEnterFunction = (entity: altServer.Entity) => void
export type OnLeaveFunction = (entity: altServer.Entity) => void

export abstract class MarkerData {
    id: number

    markerType: MarkerType
    nativeMarkerType: NativeMarkerType

    pos: altShared.Vector3
}

export abstract class Marker {
    markerData: MarkerData

    playersOnly: boolean
    /// #if SERVER
    clientInteractionZone: altServer.Colshape

    clientEnterAcknowledgeZone?: altServer.ColshapeSphere
    clientLeaveAcknowledgeZone?: altServer.ColshapeSphere

    onEnter: OnEnterFunction
    onLeave: OnLeaveFunction

    onAcknowledgeZoneEnter(entity: altServer.Entity) {
        if (entity.type !== 0) return // is not a player

        const client = (entity.getMeta('wrapper') as Client)
        if (client && client.wrapped)
            ServerEvent.emit(client, new ClientEnterAcknowledgeZone(this.markerData))
    }

    onAcknowledgeZoneLeave(entity: altServer.Entity) {
        if (entity.type !== 0) return // is not a player

        const client = (entity.getMeta('wrapper') as Client)
        if (client && client.wrapped)
            ServerEvent.emit(client, new ClientLeaveAcknowledgeZone(this.markerData))
    }

    handleEnter(entity: altServer.Entity) {
        if (this.playersOnly) {
            if (entity.type === 0) // is player
                this.onEnter(entity)
            return
        }

        this.onEnter(entity)
    }

    handleLeave(entity: altServer.Entity) {
        if (this.playersOnly) {
            if (entity.type === 0) // is player
                this.onLeave(entity)
            return
        }

        this.onLeave(entity)
    }
    /// #endif
}

export class CylinderMarkerData extends MarkerData {
    rot: altShared.Vector3
    radius: number
    height: number
    color: altShared.RGBA
}

export class CylinderMarker extends Marker {
    declare markerData: CylinderMarkerData

    shouldRender: boolean
    renderDistance?: number

    blip?: altServer.Blip

    /// #if SERVER
    constructor(pos: altServer.Vector3,
        rot: altServer.Vector3,
        radius: number,
        height: number,
        color: altServer.RGBA,
        onEnter: OnEnterFunction,
        onLeave: OnLeaveFunction,
        playersOnly: boolean,
        shouldRender?: boolean,
        renderDistance?: number,
        blip?: altServer.Blip) {
        super()

        this.markerData = new CylinderMarkerData()

        this.markerData.markerType = MarkerType.Cylinder
        this.markerData.nativeMarkerType = NativeMarkerType.VerticalCylinder
        this.markerData.pos = pos
        this.markerData.rot = rot
        this.markerData.radius = radius
        this.markerData.height = height
        this.markerData.color = color
        this.onEnter = onEnter
        this.onLeave = onLeave
        this.shouldRender = !!shouldRender
        if (renderDistance) this.renderDistance = renderDistance
        if (blip) this.blip = blip

        this.clientInteractionZone = new altServer.ColshapeCylinder(pos.x, pos.y, pos.z, radius, height)
        this.clientInteractionZone.playersOnly = playersOnly

        if (this.shouldRender) {
            this.clientEnterAcknowledgeZone = new altServer.ColshapeSphere(pos.x, pos.y, pos.z, this.renderDistance)
            this.clientEnterAcknowledgeZone.playersOnly = true

            this.clientLeaveAcknowledgeZone = new altServer.ColshapeSphere(pos.x, pos.y, pos.z, this.renderDistance * 1.3)
            this.clientLeaveAcknowledgeZone.playersOnly = true
        }
    }
    /// #endif
}

