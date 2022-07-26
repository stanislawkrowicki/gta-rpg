import mongoose from 'mongoose'

const { Schema, Types } = mongoose

const PropertySchema = new Schema({
    owners: [{
        type: Types.ObjectId,
        ref: 'User'
    }],

    lotArea: [{
        x: Number,
        y: Number,
        z: Number
    }],

    buildings: [new Schema({
        owners: [{
            type: Types.ObjectId,
            ref: 'User'
        }],

        floorArea: [{
            x: Number,
            y: Number,
            z: Number
        }],

        entrances: {
            lock: {
                position: {
                    x: Number,
                    y: Number,
                    z: Number
                },

                lockType: {
                    type: String,
                    enum: ['ELECTRONIC', 'MECHANICAL'],
                },
            }
        },

        markers: [{
            position: {
                x: Number,
                y: Number,
                z: Number
            },
        }]
    })]
})

export default PropertySchema