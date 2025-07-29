const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'producer-ui', brokers: ['localhost:9092'] });
const producer = kafka.producer();

let connected = false;
const PRODUCTS = ['PRD001', 'PRD002', 'PRD003', 'PRD004', 'PRD005'];

async function sendRandomEvent() {
  if (!connected) {
    await producer.connect();
    connected = true;
  }

  const productId = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const isSale = Math.random() > 0.4; // 60% chance of purchase
  const quantity = Math.floor(Math.random() * 10) + 1;

  const event = {
    product_id: productId,
    event_type: isSale ? 'sale' : 'purchase',
    quantity,
    ...(isSale ? {} : { unit_price: Math.floor(Math.random() * 90) + 10 }),
    timestamp: new Date().toISOString(),
  };

  await producer.send({
    topic: 'inventory-events',
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log(` sent: ${JSON.stringify(event)}`);
  return event;
}

module.exports = { sendRandomEvent };
