import type { Group } from './Group'

export default class PlayerGroup implements Group {
    static readonly groupName = 'Gracz'

    static readonly permissionsTree = {
        chat: {
            message: true,
        },
    }
}
