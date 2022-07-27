import mongoose from 'mongoose'

const { Schema, Types } = mongoose

const Code = String

const NPCSchema = new Schema({
    name: String,

    position: {
        x: Number,
        y: Number,
        z: Number
    },

    logic: Code
})

export default NPCSchema