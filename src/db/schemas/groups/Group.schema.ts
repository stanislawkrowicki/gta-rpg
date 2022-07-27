import mongoose from 'mongoose'

const { Schema, Types } = mongoose

export const GroupSchema = new Schema({
    name: String,

    parents: [{
        type: Types.ObjectId,
        ref: 'Group'
    }]
})

export default GroupSchema