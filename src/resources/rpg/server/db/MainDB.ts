import mongoose from 'mongoose'
import alt from 'alt-server'

export default class MainDB {
    static NAME = 'rpg'

    static connection: mongoose.Connection

    static collections = {
        users: mongoose.model('User', new mongoose.Schema({}, { collection: 'users' })),
    }
    static connect() {
        MainDB.connection = mongoose.createConnection(`mongodb://127.0.0.1:${process.env.MONGODB_PORT}/${MainDB.NAME}`)
            .on('error', (error) => {
                alt.logError('~r~' + `Failed to connect to the database ${MainDB.NAME}`)
            }).on('connected', (event) => {
                alt.log('~lg~' + `Successfully connected to the database ~lb~${MainDB.NAME}`)
            }).on('disconnect', (error) => {
                alt.logError('~lr~' + 'Disconnected from the database')
            })
    }
}