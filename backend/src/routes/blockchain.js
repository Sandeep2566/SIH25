import express from 'express';
import contract from '../blockchain/agritrace.js';

const router = express.Router();

// Create a new batch on blockchain
router.post('/createBatch', async (req, res) => {
  try {
    const { batchId, originGeo, productType, quantity, metadataCID } = req.body;
    const tx = await contract.createBatch(batchId, originGeo, productType, quantity, metadataCID);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get batch details (read-only)
// Get full batch traceability details
router.get('/batch/:batchId', async (req, res) => {
  try {
    const batchId = req.params.batchId;
    // Get main batch info
    const batchInfo = await contract.getBatch(batchId);
    // Get arrays
    const transfers = await contract.getTransfers(batchId);
    const qualityEvents = await contract.getQualityEvents(batchId);
    const prices = await contract.getPrices(batchId);

    // Helper to recursively convert BigInt to string
    function bigIntToString(obj) {
      if (Array.isArray(obj)) return obj.map(bigIntToString);
      if (obj && typeof obj === 'object') {
        const res = {};
        for (const k in obj) {
          res[k] = bigIntToString(obj[k]);
        }
        return res;
      }
      if (typeof obj === 'bigint') return obj.toString();
      return obj;
    }

    res.json(bigIntToString({
      batchId: batchInfo[0],
      producer: batchInfo[1],
      originGeo: batchInfo[2],
      createdAt: batchInfo[3],
      status: batchInfo[4],
      productType: batchInfo[5],
      quantity: batchInfo[6],
      transfers,
      qualityEvents,
      prices
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
