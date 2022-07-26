import dotenv from 'dotenv'
import MainDB from './db/MainDB'

dotenv.config({
    path: '../docker/.env'
})

MainDB.connect()