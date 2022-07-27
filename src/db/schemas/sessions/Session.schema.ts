import mongoose from 'mongoose'

const { Schema, Types } = mongoose

export const SessionSchema = new Schema({
    sessionType: {
        type: String,
        enum: ['GUEST', 'LOGGED_IN'],
    },

    startTime: {
        type: Date,
        required: true
    },

    loggedAccount: {
        accountType: {
            type: String,
            enum: ['REGISTERED', 'DISCORD']
        },

        loggedAccount: Types.ObjectId
    },

    movement: [{
        x: Number,
        y: Number,
        z: Number
    }]
})

export default SessionSchema