import { Entity, Schema } from 'redis-om'

export interface Warn {
    resource: string
    id: number
    message: string
}

export class Warn extends Entity {}

export const WarnSchema = new Schema(Warn, {
    resource: { type: 'string' },
    id: { type: 'number' },
    message: { type: 'string' },
})
