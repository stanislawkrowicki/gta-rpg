import {Entity, Schema} from "redis-om"

export interface CaughtError {
    resource: string,
    id: number,
    stacktrace: string
}

export class CaughtError extends Entity {}

export const CaughtErrorSchema = new Schema(CaughtError, {
    resource: { type: 'string' },
    id: { type: 'number' },
    stacktrace: { type: 'string' }
})