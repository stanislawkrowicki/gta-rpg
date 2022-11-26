import alt from 'alt-client'
import { binds as trans } from 'lang'

export type KeydownFunction = () => void

export interface IBind {
    keyCode: number
    modifierCode?: ModifierKey // shift, ctrl, alt
}
export interface IBindDefinition {
    name: string
    description: string
    keyCode: number
    modifierCode?: ModifierKey // shift, ctrl, alt
}

export interface IBindChange {
    keyCode: number
    modifierCode?: ModifierKey
    bindName: string
}

export type ModifierKey = 16 | 17 | 18

export class ClientSettings {}

export class ClientKeyBinds {
    private static map: Record<string, IBind> = {
        // those are default values
        chat: {
            keyCode: 84, // t
        },
        clientSettingsPanel: {
            keyCode: 114, // f3
        },
    }

    private static bindsDescriptions: Record<keyof typeof ClientKeyBinds.map, string> = {
        chat: trans.chat,
        clientSettingsPanel: trans.clientSettingsPanel,
    }

    private static keydownCallbacks: Partial<
        Record<keyof typeof ClientKeyBinds.map, KeydownFunction>
    > = {}

    static forceDisable = false

    static initialize() {
        ClientKeyBinds.loadFromLocalStorage()

        alt.on('keydown', (key: number) => {
            if (ClientKeyBinds.forceDisable) return

            for (const [bindName, bindValue] of Object.entries(ClientKeyBinds.map)) {
                if (
                    bindValue.keyCode === key &&
                    Object.hasOwn(ClientKeyBinds.keydownCallbacks, bindName)
                ) {
                    if (bindValue.modifierCode && alt.isKeyDown(bindValue.modifierCode)) {
                        ClientKeyBinds.keydownCallbacks[
                            bindName as keyof typeof ClientKeyBinds.map
                        ]()
                        return
                    } else if (!bindValue.modifierCode)
                        ClientKeyBinds.keydownCallbacks[
                            bindName as keyof typeof ClientKeyBinds.map
                        ]()
                }
            }
        })
    }

    static loadFromLocalStorage() {
        for (const key of Object.keys(ClientKeyBinds.map)) {
            const localStorageBinds = alt.LocalStorage.get('binds')
            if (!localStorageBinds) return

            const savedBind = localStorageBinds[key]

            if (savedBind) ClientKeyBinds.map[key as keyof typeof ClientKeyBinds.map] = savedBind
        }
    }

    static get(bindName: keyof typeof ClientKeyBinds.map) {
        return ClientKeyBinds.map[bindName]
    }

    static set(
        bindName: keyof typeof ClientKeyBinds.map,
        keyCode: number,
        modifierCode?: ModifierKey
    ) {
        ClientKeyBinds.map[bindName] = { keyCode: keyCode, modifierCode: modifierCode }
        alt.LocalStorage.set('binds', ClientKeyBinds.map)
        alt.LocalStorage.save()
    }

    static getAll() {
        return ClientKeyBinds.map
    }

    static getAllWithDefinitions() {
        const res: IBindDefinition[] = []

        for (const [name, bind] of Object.entries(ClientKeyBinds.map)) {
            res.push({
                name: name,
                description: ClientKeyBinds.bindsDescriptions[name],
                keyCode: bind.keyCode,
                modifierCode: bind.modifierCode,
            })
        }

        return res
    }

    static registerListener(bindName: keyof typeof ClientKeyBinds.map, callback: KeydownFunction) {
        callback.bind(callback)
        ClientKeyBinds.keydownCallbacks[bindName] = callback
    }
}
