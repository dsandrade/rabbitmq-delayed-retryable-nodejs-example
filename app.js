const {
    createConnection,
    publishToQueue
} = require('./src/components/rabbitMQ/client');

const publishQueue = async () => {
    await createConnection();
    await publishToQueue(
        'test-message',
        {
            msg: 'message successfully delivered!'
        },
        3000
    );
};

publishQueue();
