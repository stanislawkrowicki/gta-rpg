import type GroupMap from '../permissions/groups/GroupMap'

export default class Account {
    id: string
    name: string
    groups: (keyof typeof GroupMap)[] = []
    individualPermissions: Record<string, boolean | any>
    temporaryPermissions: Record<string, boolean>
}
