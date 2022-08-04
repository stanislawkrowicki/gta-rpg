import { Entity, Schema } from 'redis-om'

export interface Error {
    resource: string,
    id: number,
    message: string
}

export class Error extends Entity {}

export const ErrorSchema = new Schema(Error, {
    resource: { type: 'string' },
    id: { type: 'number' },
    message: { type: 'string' }
})
