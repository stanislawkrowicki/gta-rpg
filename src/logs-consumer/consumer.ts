import * as amqplib from 'amqplib'
import {Client} from "@elastic/elasticsearch"
import 'dotenv/config'

const getDB = () => {
    try {
        let protocol = 'https'
        if (process.env['ELASTICSEARCH_HOST'] === 'localhost') protocol = 'http'

        const client =  new Client({
            node: `${protocol}://${process.env['ELASTICSEARCH_HOST']}:${process.env['ELASTICSEARCH_PORT']}`,
            auth: {
                username: process.env['ELASTIC_USER'],
                password: process.env['ELASTIC_PASSWORD']
            }
        })

        console.info('Successfully connected to ElasticSearch.')
        return client
    } catch(err) {
        console.error('Failed to connect to ElasticSearch.')
        throw err
    }
}

(async () => {
    const dbClient = getDB()

    const queue = 'logs'
    const elasticIndex = 'logs'

    const conn = await amqplib.connect('amqp://localhost')
    const channel = await conn.createChannel()

    await channel.assertQueue(queue)

    console.info(`Listening to ${queue}...`)

    await channel.consume(queue, async (msg) => {
        console.info('.')
        await dbClient.index({
            index: elasticIndex,
            document: JSON.parse(msg.content.toString())

        })
        channel.ack(msg)
    })
})()