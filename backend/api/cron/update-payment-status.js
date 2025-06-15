// api/cron/update-payment-status.js

import { updateOrderPaymentStatus } from "../../controllers/order.controller.js";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await updateOrderPaymentStatus(); // this should update DB records older than 10 mins
    res.status(200).json({ message: 'Old payments updated successfully' });
  } catch (error) {
    console.error('Cron job failed:', error);
    res.status(500).json({ error: 'Failed to update payment statuses' });
  }
}
