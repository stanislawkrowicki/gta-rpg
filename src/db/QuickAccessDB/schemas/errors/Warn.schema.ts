import { Entity, Schema } from 'redis-om'

export interface Warn {
    resource: string
    message: string
}

export class Warn extends Entity {}

export const WarnSchema = new Schema(Warn, {
    resource: { type: 'string' },
    message: { type: 'string' },
})
