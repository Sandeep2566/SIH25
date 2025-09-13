import React, { useState } from 'react';
import { getBatch } from '../api';

function BatchDetails() {
  const [batchId, setBatchId] = useState('');
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

  return (
    <div style={{ marginTop: 30 }}>
      <h2>View Batch Details (Blockchain)</h2>
      <form onSubmit={handleFetch}>
        <input value={batchId} onChange={e => setBatchId(e.target.value)} placeholder="Batch ID" required />
        <button type="submit">Fetch</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {batch && (
        <div style={{ marginTop: 10 }}>
          <pre>{JSON.stringify(batch, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default BatchDetails;
