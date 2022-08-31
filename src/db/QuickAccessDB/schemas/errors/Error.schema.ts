import { Entity, Schema } from 'redis-om'

export interface Error {
    resource: string
    message: string
}

export class Error extends Entity {}

export const ErrorSchema = new Schema(Error, {
    resource: { type: 'string' },
    message: { type: 'string' },
})
