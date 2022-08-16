/// #if SERVER
import altServer from 'alt-server'
/// #endif

import type altShared from 'alt-shared'

export enum NativeMarkerType {
    UpsideDownCone = 0,
    VerticalCylinder = 1,
    ThickChevronUp = 2,
    ThinChevronUp = 3,
    CheckeredFlagRect = 4,
    CheckeredFlagCircle = 5,
    VerticleCircle = 6,
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
    DallorSign = 29,
    HorizontalBars = 30,
    WolfHead = 31
}

export enum MarkerType {
    Cylinder
}

/// #if SERVER
export type OnEnterFunction = (entity: altServer.Entity) => void
export type OnLeaveFunction = (entity: altServer.Entity) => void
/// #endif

export abstract class Marker {
    markerType: MarkerType
    nativeMarkerType: NativeMarkerType

    pos: altShared.Vector3
    rot: altShared.Vector3

    /// #if SERVER
    interactionColshape: altServer.Colshape
    clientAcknowledgeColshape?: altServer.Colshape
    /// #endif

    onEnter: OnEnterFunction
    onLeave: OnLeaveFunction

    static onAcknowledgeEnter() {}
    static onAcknowledgeLeave() {}
}

export class CylinderMarker extends Marker {
    radius: number
    height: number
    color: altShared.RGBA
    shouldRender: boolean
    renderDistance?: number

    /// #if SERVER
    blip?: altServer.Blip
    /// #endif

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

        this.markerType = MarkerType.Cylinder
        this.nativeMarkerType = NativeMarkerType.VerticalCylinder
        this.pos = pos
        this.rot = rot
        this.radius = radius
        this.height = height
        this.color = color
        this.onEnter = onEnter
        this.onLeave = onLeave
        this.shouldRender = !!shouldRender
        if (renderDistance) this.renderDistance = renderDistance
        if (blip) this.blip = blip

        this.interactionColshape = new altServer.ColshapeCylinder(this.pos.x, this.pos.y, this.pos.z, this.radius, this.height)
        this.interactionColshape.playersOnly = playersOnly

        this.clientAcknowledgeColshape = new altServer.ColshapeSphere(this.pos.x, this.pos.y, this.pos.z, this.renderDistance)
        this.clientAcknowledgeColshape.playersOnly = playersOnly
    }
    /// #endif
}

