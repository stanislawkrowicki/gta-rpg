import mongoose from 'mongoose'

const { Types } = mongoose

// export interface User {
//     name: typeof String,
//     email: {
//         type: typeof String,
//         maxLength: number
//     },
//     passwordHash: string
//
//     groups: Group[]
// }

export const DiscordAccountSchema = new mongoose.Schema({
    discordId: String,
    token: String
})

const AccountSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        maxLength: 319
    },
    passwordHash: String,

    sessions: {
        active: [{
            type: Types.ObjectId,
            ref: 'Session'
        }]
    },

    groups: [{
        type: Types.ObjectId,
        ref: 'Group'
    }],

    owned: {
        vehicles: {
            cars: [{
                type: Types.ObjectId,
                ref: 'Vehicle'
            }],
            bikes: [{
                type: Types.ObjectId,
                ref: 'Vehicle'
            }],
            planes: [{
                type: Types.ObjectId,
                ref: 'Vehicle'
            }],
            helicopters: [{
                type: Types.ObjectId,
                ref: 'Vehicle'
            }],
            watercrafts: {
                personal: [{
                    type: Types.ObjectId,
                    ref: 'Vehicle'
                }],
                boats: [{
                    type: Types.ObjectId,
                    ref: 'Vehicle'
                }],
                submarines: [{
                    type: Types.ObjectId,
                    ref: 'Vehicle'
                }]
            }
        },
        properties: [{
            type: Types.ObjectId,
            ref: 'Property'
        }],
        buildings: [{
            type: Types.ObjectId,
            ref: 'Building'
        }]
    }
})

export default AccountSchema