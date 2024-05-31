// controllers/RabbitController.ts
import RabbitProvider from '#providers/rabbit_provider';
import { HttpContext } from '@adonisjs/core/http';
import { ConsumeMessage } from 'amqplib';

const rabbitProvider = new RabbitProvider();

export default class RabbitController {
    async produce({ request, response }: HttpContext) {
        try {
            const { exchange, queue, routingKey, message } = request.body();
            await rabbitProvider.connect();
            // Assert the exchange
            await rabbitProvider.assertExchange(exchange, 'fanout');
            // Bind exchange to queue
            await rabbitProvider.assertQueue(queue);
            // Send message to the exchange
            await rabbitProvider.sendToQueue(queue, message);
            await rabbitProvider.shutdown();
            return response.status(200).json({ message: 'Message sent successfully' });
        } catch (error) {
            return response.status(500).json({ error: 'Failed to produce message', details: error.message });
        }
    }

    async consume({ response, request }: HttpContext) {
        try {
            const { exchange, queue, routingKey, message } = request.body();

            await rabbitProvider.connect();
            await rabbitProvider.assertExchange(exchange, 'fanout');
            await rabbitProvider.assertQueue(queue);
            await rabbitProvider.bindQueueToExchange(queue, exchange, routingKey);
            await rabbitProvider.consumeFromQueue('your_queue_name_here', (message: ConsumeMessage | null) => {
                if (message !== null) {
                    console.log(`Received message: ${message.content.toString()}`);
                }
            });
            return response.status(200).json({ message: 'Consuming messages started' });
        } catch (error) {
            return response.status(500).json({ error: 'Failed to consume messages', details: error.message });
        }
    }
}
