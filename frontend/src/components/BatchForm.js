import React, { useState } from 'react';
import { createBatch } from '../api';

function BatchForm() {
  const [form, setForm] = useState({
    batchId: '',
    originGeo: '',
    productType: '',
    quantity: '',
    metadataCID: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createBatch({ ...form, quantity: Number(form.quantity) });
      setResult(res.data);
    } catch (err) {
      setResult({ error: err.response?.data?.error || err.message });
    }
  };

  return (
    <div>
      <h2>Create Produce Batch (Blockchain)</h2>
      <form onSubmit={handleSubmit}>
        <input name="batchId" placeholder="Batch ID" value={form.batchId} onChange={handleChange} required />
        <input name="originGeo" placeholder="Origin (Geo)" value={form.originGeo} onChange={handleChange} required />
        <input name="productType" placeholder="Product Type" value={form.productType} onChange={handleChange} required />
        <input name="quantity" placeholder="Quantity" type="number" value={form.quantity} onChange={handleChange} required />
        <input name="metadataCID" placeholder="Metadata CID" value={form.metadataCID} onChange={handleChange} />
        <button type="submit">Create Batch</button>
      </form>
      {result && (
        <div style={{ marginTop: 10 }}>
          {result.error ? <span style={{ color: 'red' }}>{result.error}</span> : <span>Success! Tx: {result.txHash}</span>}
        </div>
      )}
    </div>
  );
}

export default BatchForm;
