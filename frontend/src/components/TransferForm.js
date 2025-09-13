import React, { useState } from 'react';
import { recordTransfer } from '../api';

function TransferForm() {
  const [form, setForm] = useState({ batchId: '', to: '', noteCID: '' });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await recordTransfer(form);
      setResult({ success: true, txHash: res.data.txHash });
    } catch (err) {
      setResult({ error: err.response?.data?.error || err.message });
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Transfer Batch Ownership</h2>
      <form onSubmit={handleSubmit}>
        <input name="batchId" placeholder="Batch ID" value={form.batchId} onChange={handleChange} required />
        <input name="to" placeholder="To (address)" value={form.to} onChange={handleChange} required />
        <input name="noteCID" placeholder="Note CID (optional)" value={form.noteCID} onChange={handleChange} />
        <button type="submit">Transfer</button>
      </form>
      {result && (
        <div style={{ marginTop: 10 }}>
          {result.error ? <span style={{ color: 'red' }}>{result.error}</span> : <span>Success! Tx: {result.txHash}</span>}
        </div>
      )}
    </div>
  );
}

export default TransferForm;
