const { addInventoryBatch, getOldestBatches, updateBatchQuantity } = require('../models/inventeryBaitchModel');
const { recordSale, recordSaleDetail } = require('../models/saleModel');

async function handleInventoryEvent(event) {
  const { product_id, event_type, quantity, unit_price, timestamp } = event;

  if (event_type === 'purchase') {
    await addInventoryBatch({ product_id, quantity, unit_price, timestamp });
  } else if (event_type === 'sale') {
    let remaining = quantity;
    let totalCost = 0;
    let sold = 0;
    const batchDetails = [];

    const batches = await getOldestBatches(product_id);

    for (const batch of batches) {
      if (remaining <= 0) break;

      const consumeQty = Math.min(batch.remaining_quantity, remaining);
      const cost = consumeQty * batch.unit_price;

      totalCost += cost;
      sold += consumeQty;
      batchDetails.push({
        batch_id: batch.id,
        quantity: consumeQty,
        unit_price: batch.unit_price
      });

      await updateBatchQuantity(batch.id, batch.remaining_quantity - consumeQty);
      remaining -= consumeQty;
    }

    if (sold > 0) {
      const saleId = await recordSale({ product_id, quantity: sold, cost: totalCost, timestamp });
      for (const detail of batchDetails) {
        await recordSaleDetail({ sale_id: saleId, ...detail });
      }
    } else {
      console.warn(`No inventory to fulfill sale for ${product_id}`);
    }
  }
}
module.exports = { handleInventoryEvent };
