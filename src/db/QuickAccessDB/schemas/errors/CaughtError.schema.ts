import { Entity, Schema } from 'redis-om'

export interface CaughtError {
    resource: string
    stacktrace: string
    message: string
}

export class CaughtError extends Entity {}

export const CaughtErrorSchema = new Schema(CaughtError, {
    resource: { type: 'string' },
    stacktrace: { type: 'string' },
    message: { type: 'string' },
})
