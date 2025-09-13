import React, { useState } from 'react';
import { getBatch } from '../api';
import QRCodeDisplay from './QRCodeDisplay';

function TraceabilityView({ initialBatchId }) {
  const [batchId, setBatchId] = useState(initialBatchId || '');
  const [batch, setBatch] = useState(null);
  const [error, setError] = useState(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    setError(null);
    setBatch(null);
    try {
      const res = await getBatch(batchId);
      setBatch(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  // Auto-fetch if initialBatchId is present
  React.useEffect(() => {
    if (initialBatchId) {
      handleFetch({ preventDefault: () => {} });
    }
    // eslint-disable-next-line
  }, [initialBatchId]);

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Traceability View</h2>
      {!initialBatchId && (
        <form onSubmit={handleFetch}>
          <input value={batchId} onChange={e => setBatchId(e.target.value)} placeholder="Batch ID" required />
          <button type="submit">Show Traceability</button>
        </form>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {batch && (
        <div style={{ marginTop: 10 }}>
          <h3>Batch: {batch.batchId}</h3>
          <QRCodeDisplay value={window.location.origin + '/?batchId=' + encodeURIComponent(batch.batchId)} />
          <div><b>Origin:</b> {batch.originGeo}</div>
          <div><b>Product:</b> {batch.productType}</div>
          <div><b>Status:</b> {batch.status}</div>
          <div><b>Quantity:</b> {batch.quantity?.toString?.()}</div>
          <div><b>Producer:</b> {batch.producer}</div>
          <div><b>Transfers:</b>
            <ol>
              {(batch.transfers || []).map((t, i) => (
                <li key={i}>
                  <b>From:</b> {t.from} <b>To:</b> {t.to} <b>At:</b> {t.timestamp?.toString?.()} <b>Note:</b> {t.noteCID}
                </li>
              ))}
            </ol>
          </div>
          <div><b>Quality Events:</b>
            <ol>
              {(batch.qualityEvents || []).map((q, i) => (
                <li key={i}>
                  <b>Inspector:</b> {q.inspector} <b>Passed:</b> {q.passed ? 'Yes' : 'No'} <b>At:</b> {q.timestamp?.toString?.()} <b>Notes:</b> {q.notes}
                </li>
              ))}
            </ol>
          </div>
          <div><b>Prices:</b>
            <ol>
              {(batch.prices || []).map((p, i) => (
                <li key={i}>
                  <b>Setter:</b> {p.setter} <b>Price:</b> {p.priceWei?.toString?.()} <b>At:</b> {p.timestamp?.toString?.()} <b>Note:</b> {p.noteCID}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default TraceabilityView;
