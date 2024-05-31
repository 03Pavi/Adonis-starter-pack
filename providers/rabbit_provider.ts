// providers/RabbitProvider.ts
import amqp, { ConsumeMessage } from 'amqplib';
import env from '#start/env';

export default class RabbitProvider {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  public async connect(): Promise<void> {
    try {
      const rabbitUrl = env.get('RABBITMQ_URL', 'amqp://localhost');
      this.connection = await amqp.connect(rabbitUrl);
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }
  public async assertExchange(exchange: string, type: string, options?: amqp.Options.AssertExchange): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel is not created. Ensure RabbitMQ is connected.');
    }

    try {
      await this.channel.assertExchange(exchange, type, options);
      console.log(`Exchange '${exchange}' asserted`);
    } catch (error) {
      console.error(`Failed to assert exchange '${exchange}':`, error);
    }
  }

  public async bindQueueToExchange(queue: string, exchange: string, routingKey: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel is not created. Ensure RabbitMQ is connected.');
    }

    try {
      await this.channel.bindQueue(queue, exchange, routingKey);
      console.log(`Queue '${queue}' bound to exchange '${exchange}' with routing key '${routingKey}'`);
    } catch (error) {
      console.error(`Failed to bind queue '${queue}' to exchange '${exchange}':`, error);
    }
  }


  public async assertQueue(queue: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel is not created. Ensure RabbitMQ is connected.');
    }

    try {
      await this.channel.assertQueue(queue, { durable: true });
      console.log(`Queue '${queue}' asserted`);
    } catch (error) {
      console.error(`Failed to assert queue '${queue}':`, error);
    }
  }

  public async sendToQueue(queue: string, message: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel is not created. Ensure RabbitMQ is connected.');
    }

    try {
      await this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
      console.log(`Message sent to queue ${queue}: ${message}`);
    } catch (error) {
      console.error(`Failed to send message to queue ${queue}:`, error);
    }
  }

  public async close(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log('RabbitMQ connection closed');
    } catch (error) {
      console.error('Failed to close RabbitMQ connection:', error);
    }
  }

  public async consumeFromQueue(queue: string, callback: (message: ConsumeMessage | null) => void): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel is not created. Ensure RabbitMQ is connected.');
    }

    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.consume(queue, async (msg) => {
        if (msg !== null) {
          try {
            // Pass the message to the provided callback function
            callback(msg);
            // Acknowledge the message after processing
            this.channel?.ack(msg);
            console.log(`Message acknowledged: ${msg.content.toString()}`);
          } catch (error) {
            console.error(`Failed to process message: ${msg.content.toString()}`, error);
          }
        }
      }, { noAck: false }); // Set noAck to false to enable manual acknowledgment
      console.log(`Started consuming messages from queue ${queue}`);
    } catch (error) {
      console.error(`Failed to consume messages from queue ${queue}:`, error);
      // Optionally, handle the error
    }
  }
  public async shutdown(): Promise<void> {
    await this.close();
  }
}
