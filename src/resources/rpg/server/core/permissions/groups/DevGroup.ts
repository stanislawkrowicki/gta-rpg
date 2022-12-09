import type { Group } from './Group'

export default class DevGroup implements Group {
    static readonly groupName = 'Developer'

    static readonly permissionsTree = {
        auth: {
            logout: true,
        },
        mapEditor: true,
    }
}
