const amqp = require('amqplib');

const logger = require('./logger');

module.exports = async ({ host, port }) => {
  logger.info('Loading Rabbitmq');
  const connection = await amqp.connect(`amqp://${host}:${port}`);
  const channel = await connection.createChannel();

  const publish = async (queue, message) => {
    await channel.assertQueue(queue, { durable: true });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });

    logger.info(`Rabbitmq: message sent to ${queue}`);
  };

  const subscribe = async (queue, handler) => {
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (msg) => {
      logger.info(`Rabbitmq: ${queue} message received`);
      if (msg != null) {
        const data = JSON.parse(msg.content.toString());
        handler(data)
          .catch((err) => logger.error(`Rabbitmq: failed processing message with error ${err.message}`));
        channel.ack(msg);
      }
    });
  };

  logger.info('Rabbitmq loaded');
  return {
    publish,
    subscribe,
  };
};
