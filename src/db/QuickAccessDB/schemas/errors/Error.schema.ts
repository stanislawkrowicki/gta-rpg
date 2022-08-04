import { Entity, Schema } from 'redis-om'

export interface Error {
    resource: string,
    id: number,
    message: string
}

export class Error extends Entity {}

export const errorSchema = new Schema(Error, {
    resource: { type: 'string' },
    id: { type: 'number' },
    message: { type: 'string' }
})

export interface CaughtError {
    resource: string,
    id: number,
    stacktrace: string
}

export class CaughtError extends Entity {}

export const caughtErrorSchema = new Schema(CaughtError, {
    resource: { type: 'string' },
    id: { type: 'number' },
    stacktrace: { type: 'string' }
})