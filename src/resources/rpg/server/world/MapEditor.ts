import EnableMapEditor from 'rpg/shared/events/server/world/EnableMapEditor'
import ServerEvent from 'rpg/shared/events/ServerEvent'
import type { Client } from 'rpg/server/core/client/Client'
import CommandManager from 'rpg/server/core/commands/CommandManager'
import Permissions from 'rpg/server/core/permissions/Permissions'
import type GroupMap from 'rpg/server/core/permissions/groups/GroupMap'

export default {}

CommandManager.registerCommand({
    name: 'mapeditor',
    isUsableFromChat: true,
    isUsableFromConsole: true,
    callback: (client: Client) => {
        ServerEvent.emit(client, new EnableMapEditor())
    },
    requiredPermission: {
        group: 'dev',
        query: Permissions.queryCheck<typeof GroupMap.dev.permissionsTree>(['mapEditor']),
    },
})
