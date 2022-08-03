import alt from 'alt-server'
import amqplib from 'amqplib'

export enum QueueChannels {
    logs = 'log_channel'
}

export class Queues {
    static channels: Record<QueueChannels, amqplib.Channel> = {log_channel: undefined}

    static async channel(name: QueueChannels): Promise<amqplib.Channel> {
        if (Queues.channels[name]) return Queues.channels[name]

        const channel = await Queues.openChannel()
        Queues.channels[name] = channel

        alt.log('~lg~' + 'Successfully connected to RabbitMQ channel ~lb~', name)
        return channel
    }

    private static async openChannel(): Promise<amqplib.Channel> {
        const conn =  await amqplib.connect('amqp://localhost')

        const channel = await conn.createChannel()

        return channel
    }
}
