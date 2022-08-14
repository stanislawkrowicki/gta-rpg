import { Entity, Schema } from 'redis-om'

export interface Session {
    playerHwidHash: string

    x: number
    y: number
    z: number

    ry: number
    rz: number

    pedCamViewMode: number
    vehicleCamViewMode: number
}

export class Session extends Entity {}

export const SessionSchema = new Schema(Session, {
    playerHwidHash: { type: 'string' },

    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' },

    ry: { type: 'number' },
    rz: { type: 'number' },

    pedCamViewMode: { type: 'number' },
    vehicleCamViewMode: { type: 'number' }
})