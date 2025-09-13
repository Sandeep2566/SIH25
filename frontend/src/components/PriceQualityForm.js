import React, { useState } from 'react';
import { postPrice, recordQuality } from '../api';

function PriceQualityForm() {
  const [form, setForm] = useState({ batchId: '', priceWei: '', noteCID: '', passed: '', reportCID: '', notes: '' });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePrice = async (e) => {
    e.preventDefault();
    try {
      const res = await postPrice({ batchId: form.batchId, priceWei: form.priceWei, noteCID: form.noteCID });
      setResult({ success: true, txHash: res.data.txHash });
    } catch (err) {
      setResult({ error: err.response?.data?.error || err.message });
    }
  };

  const handleQuality = async (e) => {
    e.preventDefault();
    try {
      const res = await recordQuality({ batchId: form.batchId, passed: form.passed === 'true', reportCID: form.reportCID, notes: form.notes });
      setResult({ success: true, txHash: res.data.txHash });
    } catch (err) {
      setResult({ error: err.response?.data?.error || err.message });
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Add Price or Quality Event</h2>
      <form onSubmit={handlePrice} style={{ marginBottom: 10 }}>
        <input name="batchId" placeholder="Batch ID" value={form.batchId} onChange={handleChange} required />
        <input name="priceWei" placeholder="Price (Wei)" value={form.priceWei} onChange={handleChange} required />
        <input name="noteCID" placeholder="Note CID (optional)" value={form.noteCID} onChange={handleChange} />
        <button type="submit">Add Price</button>
      </form>
      <form onSubmit={handleQuality}>
        <input name="batchId" placeholder="Batch ID" value={form.batchId} onChange={handleChange} required />
        <select name="passed" value={form.passed} onChange={handleChange} required>
          <option value="">Quality Passed?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <input name="reportCID" placeholder="Report CID (optional)" value={form.reportCID} onChange={handleChange} />
        <input name="notes" placeholder="Notes (optional)" value={form.notes} onChange={handleChange} />
        <button type="submit">Add Quality Event</button>
      </form>
      {result && (
        <div style={{ marginTop: 10 }}>
          {result.error ? <span style={{ color: 'red' }}>{result.error}</span> : <span>Success! Tx: {result.txHash}</span>}
        </div>
      )}
    </div>
  );
}

export default PriceQualityForm;
