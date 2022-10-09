import type { PermissionsTree } from '../Permissions'

export abstract class Group {
    static readonly groupName: string
    static readonly permissionsTree: PermissionsTree
}

export abstract class SubGroup extends Group {
    static readonly subGroupName: string
    static readonly permissionsOverwrite: PermissionsTree
    static readonly parent: Group
}
