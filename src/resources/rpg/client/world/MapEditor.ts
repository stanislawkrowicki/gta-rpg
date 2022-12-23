import alt from 'alt-client'
import natives from 'natives'
import Mouse, { MouseMode } from '../input/Mouse'
import Chat from '../chat/Chat'
import FreeCam from './FreeCam'
import Vector2 from '../../shared/utils/Vector2'
import ClientUtils from 'rpg/client/utils/Utils'
import Vector3 from '../../shared/utils/Vector3'
import RGBA from '../../shared/utils/RGBA'

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

enum Axis3D {
    X,
    Y,
    Z,
}

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

    static lastKnownPointingPosition = new Vector2()

    static debugPosition = new Vector3()

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

                        const result = ClientUtils.screenToWorld(
                            cam.wrapped,
                            cursorPos.x,
                            cursorPos.y
                        )

                        const pos = result[2]

                        MapEditor.debugPosition.setXYZ(pos.x, pos.y, pos.z + 10)

                        // const pos = alt.screenToWorld(cursorPos.x, cursorPos.y)
                        // console.log(pos)

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

    static update() {
        natives.displayRadar(false)

        function drawMovementGizmo(
            position: Vector3,
            rotation: Vector3,
            scale: Vector3,
            activeAxis: Axis3D
        ) {
            natives.setDepthwriting(true)

            ClientUtils.drawBox(
                position.copy().addXYZ(0.5, 0.5, 0.5),
                rotation,
                new Vector3(4.5, 0.1, 0.1).mul(scale),
                new RGBA(0, 0, 0, 255)
            )

            ClientUtils.drawBox(
                position.copy().addXYZ(0.5, 0.5, 0.5),
                rotation,
                new Vector3(0.1, 4.5, 0.1).mul(scale),
                new RGBA(0, 0, 0, 255)
            )

            ClientUtils.drawBox(
                position.copy().addXYZ(0.5, 0.5, 0.5),
                rotation,
                new Vector3(0.1, 0.1, 4.5).mul(scale),
                new RGBA(0, 0, 0, 255)
            )

            ClientUtils.drawBox(
                position.copy().addXYZ(0.35, 0.35, 0.35),
                rotation,
                new Vector3(0.4, 0.4, 0.4).mul(scale),
                new RGBA(210, 210, 210, 255)
            )

            ClientUtils.drawBox(
                position.copy().addXYZ(5, 0, 0),
                rotation,
                new Vector3(1, 1, 1).mul(scale),
                new RGBA(255, 0, 0, 255)
            )

            ClientUtils.drawBox(
                position.copy().addXYZ(0, 5, 0),
                rotation,
                new Vector3(1, 1, 1),
                new RGBA(0, 255, 0, 255)
            )

            ClientUtils.drawBox(
                position.copy().addXYZ(0, 0, 5),
                rotation,
                new Vector3(1, 1, 1).mul(scale),
                new RGBA(0, 0, 255, 255)
            )

            natives.setDepthwriting(false)
        }

        drawMovementGizmo(MapEditor.debugPosition, new Vector3(), new Vector3(1, 1, 1), Axis3D.X)
        // console.log(natives.getGroundZFor3dCoord(pos.x, pos.y, 9999, 9999, false, false))
        // console.log(pos)
        for (let i = 0; i < MapEditor.selectedObjects.length; ++i) {
            // TODO: Render gizmo
        }
    }
}
