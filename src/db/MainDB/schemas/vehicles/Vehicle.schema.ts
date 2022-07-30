import mongoose from 'mongoose'

const { Types, Schema } = mongoose

const VehicleSchema = new Schema({
    owners: [{
        type: Types.ObjectId,
        ref: 'User'
    }],

    equipment: [{
        type: Types.ObjectId,
        ref: 'VehicleEquipment'
    }]
})

export default VehicleSchema