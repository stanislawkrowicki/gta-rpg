import mongoose from 'mongoose'

const { Schema } = mongoose

const VehicleEquipment = new Schema({
    owners: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],

    production: {
        date: Date
    }
})

export default VehicleEquipment