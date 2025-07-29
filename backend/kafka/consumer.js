require('dotenv').config();
const { Kafka } = require('kafkajs');
const { handleInventoryEvent } = require('../services/fifoService');
const { seedProducts } = require('../models/productModel');

const kafka = new Kafka({
  clientId: 'inventory-app',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'inventory-group' });

async function runConsumer() {
  await seedProducts();
  await consumer.connect();
  await consumer.subscribe({ topic: 'inventory-events', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      console.log("Consumed Kafka Event:", event);
      await handleInventoryEvent(event);
    },
  });
}

runConsumer().catch(console.error);
