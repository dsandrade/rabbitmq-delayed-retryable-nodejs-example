const amqp = require('amqplib');
const retryable = require('amqplib-retryable');

const CONN_URL = 'amqp://testing:testing12@localhost';

let channel = null;
const exchange = 'delayed-exchange';

const createConnection = async () => {
    const conn = await amqp.connect(CONN_URL);
    channel = await conn.createChannel();

    await channel.assertExchange(
        exchange,
        'x-delayed-message',
        {
            autoDelete: false,
            durable: true,
            passive: true,
            arguments: {
                'x-delayed-type': 'direct'
            }
        }
    );

    await retryable(channel, {
        initialDelay: 5000,
        maxRetries: 5,
        separator: '.'
    });

    return channel;
};

const publishToQueue = async (queueName, data, delay = 0) => {
    await channel.publish(
        exchange,
        queueName,
        Buffer.from(JSON.stringify(data)),
        {
            persistent: true,
            headers: {
                'x-delay': delay
            }
        }
    );
};

module.exports = {
    publishToQueue,
    createConnection
};
