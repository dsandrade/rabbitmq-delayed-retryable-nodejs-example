const {
    createConnection
} = require('./src/components/rabbitMQ/client');
const {
    getJobList
} = require('./src/jobs/client');

const exchange = 'delayed-exchange';

const execWorker = async () => {
    const channel = await createConnection();

    try {
        const jobs = getJobList();

        // eslint-disable-next-line guard-for-in
        for (const queueName in jobs) {
            await channel.assertQueue(queueName, {
                durable: true
            });

            await channel.bindQueue(queueName, exchange, queueName);

            const job = jobs[queueName];
            channel.consume(
                queueName,
                async (msg) => {
                    try {
                        await job(JSON.parse(msg.content.toString()));
                        channel.ack(msg);
                    } catch (error) {
                        throw new Error(error.message);
                    }
                },
                { noAck: false }
            );
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

execWorker();
