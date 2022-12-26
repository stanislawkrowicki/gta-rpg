import alt from 'alt-client'
import natives from 'natives'
import Mouse, { MouseMode } from '../input/Mouse'
import Chat from '../chat/Chat'
import FreeCam from './FreeCam'
import Vector2 from '../../shared/utils/Vector2'
import ClientUtils from 'rpg/client/utils/Utils'
import type WorldEntityType from 'rpg/shared/world/WorldEntityType'
import type { MarkerType } from 'rpg/shared/world/markers/Markers'
import type Vector3 from 'rpg/shared/utils/Vector3'
import type WorldEntityGroupSchema from '../../../../db/MainDB/schemas/world/WorldEntityGroup.schema'

export interface IMarkerEntity {
    markerType: MarkerType
    position: Vector3
    scale: number
    vertices?: any
}

export interface IObjectEntity {
    hash: string | number
    position: Vector3
    rotation: Vector3
}

// export interface IVehicleEntity {}
// export interface INPCEntity {}

export interface IEntity {
    _id: string

    type: WorldEntityType
    name: string
    description?: string

    wrapped: IMarkerEntity | IObjectEntity
}

export interface IEntityGroup {
    _id: string
    name: string
    description?: string
    children?: IEntityGroup[]
    entities?: IEntity[]
}

enum EditableObject {
    NPC,
}

const CurrentlyPressedKeys = []

/**
 * permissions:
 *  - MapEditor
 *  - MapEditor.view
 *  - MapEditor.object.edit
 *   - MapEditor.object.edit.rotate
 *    - MapEditor.object.edit.rotate.x
 *    - MapEditor.object.edit.rotate.y
 *   - MapEditor.object.edit.move
 *    - MapEditor.object.edit.move.x
 *    - MapEditor.object.edit.move.y
 *    - MapEditor.object.edit.move.z
 *  - MapEditor.object.add
 *   - MapEditor.object.add.clone\
 *  - MapEditor.object.remove
 *
 */
export default class MapEditor {
    static groupedEntities: string[] = []

    static compoundGizmo = true

    static lastKnownPointingPosition = new Vector2()

    static initialize() {
        const updateInterval = alt.setInterval(MapEditor.update, 15)

        const keyDownListener = (key: number) => {
            if (key === 35) {
                // TODO: Delete selected objects
            }
        }

        const mouseDownListener = (x: number, y: number, button: number) => {
            if (Mouse.mode === MouseMode.SCREEN_POINTING) {
                switch (button) {
                    case 0: {
                        const cam = FreeCam.getCurrentCam()

                        if (cam === null) return

                        const cursorPos = alt.getCursorPos()

                        const pos = ClientUtils.screenToWorld(cam.wrapped, cursorPos.x, cursorPos.y)
                        // const pos = alt.screenToWorld(cursorPos.x, cursorPos.y)
                        console.log(pos)

                        break
                    }
                    case 2: {
                        const cursorPos = alt.getCursorPos()

                        MapEditor.lastKnownPointingPosition.setXY(cursorPos.x, cursorPos.y)
                        Mouse.setMode(MouseMode.CAMERA_CONTROL)

                        break
                    }
                }
            }
        }

        const mouseUpListener = (x: number, y: number, button: number) => {
            if (Mouse.mode === MouseMode.CAMERA_CONTROL) {
                switch (button) {
                    case 2: {
                        Mouse.setMode(MouseMode.SCREEN_POINTING)
                        alt.setCursorPos(MapEditor.lastKnownPointingPosition)

                        break
                    }
                }
            }
        }

        const mouseMoveListener = (x: number, y: number) => {}

        alt.on('keydown', keyDownListener)

        Mouse.addMouseDownListener(mouseDownListener)
        Mouse.addMouseUpListener(mouseUpListener)

        Mouse.addMouseMoveListener(mouseMoveListener)

        Mouse.setMode(MouseMode.SCREEN_POINTING)

        FreeCam.enable()

        Chat.deinitialize()

        MapEditor.deinitialize = () => {
            alt.clearInterval(updateInterval)

            alt.off('keydown', keyDownListener)

            Mouse.removeMouseDownListener(mouseDownListener)
            Mouse.removeMouseDownListener(mouseUpListener)

            Mouse.removeMouseDownListener(mouseMoveListener)

            Mouse.setMode(MouseMode.CAMERA_CONTROL)

            FreeCam.disable()

            Chat.initialize()
        }
    }

    static deinitialize() {}

    private static convertGroupFromDB(dbGroup: WorldEntityGroupSchema): IEntityGroup {
        return {
            _id: dbGroup._id.toString(),
            name: dbGroup.name,
            description: dbGroup.description,
            children: [],
            entities: [],
        }
    }

    // static async loadEntities() {
    //     const groupsFromDB = await MainDB.collections.worldEntityGroups.find()

    //     if (groupsFromDB.length === 0) return

    //     const rootGroupsFromDB = groupsFromDB.filter((group) => typeof group.parent === 'undefined')

    //     const groups: IEntityGroup[] = []

    //     rootGroupsFromDB.forEach((dbGroup) => {
    //         groups.push(MapEditor.convertGroupFromDB(dbGroup))
    //     })

    //     for (const rootGroup of groups) {
    //         const currentParentGroup = rootGroup

    //         let hasAnyChild = false

    //         do {
    //             hasAnyChild = false

    //             for (const groupFromDB of groupsFromDB) {
    //                 if (typeof groupFromDB.parent !== 'undefined') hasAnyChild = true
    //                 if (groupFromDB.parent._id.toString() === currentParentGroup._id)
    //                     currentParentGroup.children.push(MapEditor.convertGroupFromDB(groupFromDB))
    //             }
    //         } while (hasAnyChild)
    //     }
    // }

    static update() {
        natives.displayRadar(false)
        // console.log(natives.getGroundZFor3dCoord(pos.x, pos.y, 9999, 9999, false, false))
        // console.log(pos)
        // for (let i = 0; i < MapEditor.selectedObjects.length; ++i) {
        //     // TODO: Render gizmo
        // }
    }
}
