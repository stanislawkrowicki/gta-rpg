import alt from 'alt-client'

export class ClientSettings {}

export class ClientKeyBinds {
    static map: Record<string, string> = {
        chat: 't',
    }

    static loadFromLocalStorage() {
        for (const key of Object.keys(ClientKeyBinds.map)) {
            const savedBind = alt.LocalStorage.get('binds')[key]

            if (savedBind) ClientKeyBinds.map[key as keyof typeof ClientKeyBinds.map] = savedBind
        }
    }

    static get(key: keyof typeof ClientKeyBinds.map) {
        return ClientKeyBinds.map[key]
    }

    static set(key: keyof typeof ClientKeyBinds.map, value: string) {
        ClientKeyBinds.map[key] = value
        alt.LocalStorage.set('binds', ClientKeyBinds.map)
        alt.LocalStorage.save()
    }
}
