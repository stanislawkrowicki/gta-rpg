import alt from 'alt-client'

export type KeydownFunction = () => void

export class ClientSettings {}

export class ClientKeyBinds {
    private static map: Record<string, number> = {
        chat: 84, // t
    }

    private static keydownCallbacks: Record<keyof typeof ClientKeyBinds.map, KeydownFunction> = {}

    static initialize() {
        ClientKeyBinds.loadFromLocalStorage()

        alt.on('keydown', (key: number) => {
            for (const [bindKey, bindValue] of Object.entries(ClientKeyBinds.map)) {
                if (bindValue === key && Object.hasOwn(ClientKeyBinds.keydownCallbacks, bindKey))
                    ClientKeyBinds.keydownCallbacks[bindKey]()
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

    static set(bindName: keyof typeof ClientKeyBinds.map, value: number) {
        ClientKeyBinds.map[bindName] = value
        alt.LocalStorage.set('binds', ClientKeyBinds.map)
        alt.LocalStorage.save()
    }

    static registerListener(bindName: keyof typeof ClientKeyBinds.map, callback: KeydownFunction) {
        ClientKeyBinds.keydownCallbacks[bindName] = callback
    }
}
