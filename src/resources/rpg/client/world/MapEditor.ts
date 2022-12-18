import alt from 'alt-client'
import natives from 'natives'
import Mouse, { MouseMode } from '../input/Mouse'
import Chat from '../chat/Chat'
import FreeCam from './FreeCam'
import Vector2 from '../../shared/utils/Vector2'
export interface IEditorObject {
    id: string
    key: string
    description: string
    object: alt.Object
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
    static editableObjects: IEditorObject[] = []
    static selectedObjects: IEditorObject[] = []

    static compoundGizmo = true

    static lastKnownPointingPositon = new Vector2()

    static initialize() {
        const updateInterval = alt.setInterval(MapEditor.update, 15)

        const keyDownListener = (key: number) => {
            if (key === 35) {
                // TODO: Delete selected objects
            }
        }

        const mouseDownListener = (x: number, y: number, button: number) => {
            switch (button) {
                case 0: {
                    const cam = FreeCam.getCurrentCam()

                    if (cam === null) return

                    const cursorPos = alt.getCursorPos()

                    // const pos = ClientUtils.screenToWorld(cam, cursorPos.x, cursorPos.y)
                    const pos = alt.screenToWorld(cursorPos.x, cursorPos.y)
                    console.log(pos.x, pos.y, pos.z)

                    break
                }
                case 2: {
                    const cursorPos = alt.getCursorPos()

                    MapEditor.lastKnownPointingPositon.setXY(cursorPos.x, cursorPos.y)
                    Mouse.setMode(MouseMode.CAMERA_CONTROL)

                    break
                }
            }
        }

        const mouseUpListener = (x: number, y: number, button: number) => {
            switch (button) {
                case 2:
                    Mouse.setMode(MouseMode.SCREEN_POINTING)
                    alt.setCursorPos(MapEditor.lastKnownPointingPositon)

                    break
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

    static update() {
        natives.disableControlAction(0, 142, true)
        natives.displayRadar(false)
        // console.log(natives.getGroundZFor3dCoord(pos.x, pos.y, 9999, 9999, false, false))
        // console.log(pos)
        for (let i = 0; i < MapEditor.selectedObjects.length; ++i) {
            // TODO: Render gizmo
        }
    }
}
