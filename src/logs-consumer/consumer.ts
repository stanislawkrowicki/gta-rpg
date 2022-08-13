import * as amqplib from 'amqplib'
import {Client} from "@elastic/elasticsearch"
import 'dotenv/config'
import {MappingTypeMapping} from "@elastic/elasticsearch/lib/api/types"

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

const dbClient = getDB()

const createIndexIfNotExists = async (index: string, mappings?: MappingTypeMapping) => {
    if (await dbClient.indices.exists({ index: index })) return

    console.info(`Index ${index} does not exist, creating...`)

    if (mappings)
        await dbClient.indices.create({
            index: index,
            body: {
                mappings: mappings
            }
        })
    else
        await dbClient.indices.create({
            index: index
        })
}

(async () => {
    const queue = 'logs'
    const elasticIndex = 'logs'

    await createIndexIfNotExists(elasticIndex, {
        properties: {
            "timestamp": {
                type: "date",
                format: "epoch_millis"
            }
        }
    })

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