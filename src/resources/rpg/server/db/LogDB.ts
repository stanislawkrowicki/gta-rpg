import { Client } from '@elastic/elasticsearch'
import alt from "alt-server"

export default class LogDB {
    static client: Client

    static connect() {
        try {
            let protocol = 'https'
            if (process.env['ELASTICSEARCH_HOST'] === 'localhost') protocol = 'http'

            LogDB.client = new Client({
                node: `${protocol}://${process.env['ELASTICSEARCH_HOST']}:${process.env['ELASTICSEARCH_PORT']}`,
                auth: {
                    username: process.env['ELASTIC_USER'],
                    password: process.env['ELASTIC_PASSWORD']
                }
            })

            alt.log('~lg~' + 'Successfully connected to ~lb~ElasticSearch.')
        } catch(err) {
            alt.logError('Failed to connect to ElasticSearch:', err)
        }
    }
}