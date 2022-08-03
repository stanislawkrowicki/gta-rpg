import amqplib from 'amqplib'

export default class Queues {
    static channels: Record<string, amqplib.Channel> = {}

    static async channel(name: string, useExisting: boolean): Promise<amqplib.Channel> {
        if (name in Queues.channels && useExisting) return Queues.channels[name]

        const channel = await Queues.openChannel()
        Queues.channels[name] = channel

        return channel
    }

    static async openChannel(): Promise<amqplib.Channel> {
        const conn =  await amqplib.connect('amqp://localhost')

        const channel = await conn.createChannel()

        return channel
    }
}
