import alt from 'alt-server'
import redis from 'redis-om'

export default class QuickDB {
    static client = new redis.Client()

    static async connect() {
        try {
            await QuickDB.client.open(`redis://default:${process.env['REDIS_PASSWORD']}@${process.env['REDIS_HOST']}:${process.env['REDIS_PORT']}`)
            alt.log('~lg~' + 'Successfully connected to ~lb~Redis')
        } catch (err) {
            alt.logError('~r~' + 'There was an error while connecting to ~lb~Redis.', err)
        }
    }
}