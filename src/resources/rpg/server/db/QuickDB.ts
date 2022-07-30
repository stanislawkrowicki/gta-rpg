import redis from 'redis-om'

export default class QuickDB {
    static client = new redis.Client()

    static connect() {
        QuickDB.client.open('').then(() => {})
    }
}