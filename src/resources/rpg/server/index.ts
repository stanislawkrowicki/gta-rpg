import dotenv from 'dotenv'
import MainDB from './db/MainDB'

dotenv.config({
    path: '../.env'
})

MainDB.connect()