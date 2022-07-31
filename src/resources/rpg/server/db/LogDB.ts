import { Client } from '@elastic/elasticsearch'
import alt from "alt-server"

export default class LogDB {
    static client: Client

    static connect() {
        alt.log('~lg~', 'Connecting to ~lb~ElasticSearch')
        try {
            LogDB.client = new Client({
                auth: {
                    username: process.env['ELASTIC_USER'],
                    password: process.env['ELASTIC_PASSWORD']
                }
            })
            alt.log('~lg~' + 'Successfully connected to ~lb~ElasticSearch.')
        } catch(err) {
            alt.logError('~r~' + 'Failed to connect to ~lb~ElasticSearch ~r~:', err)
        }
    }
}