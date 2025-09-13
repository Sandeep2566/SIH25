import React, { useState } from 'react';
import axios from 'axios';

function BatchMLAnalytics() {
  const [batchId, setBatchId] = useState('');
  const [price, setPrice] = useState(null);
  const [anomaly, setAnomaly] = useState(null);
  const [features, setFeatures] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    setError(null);
    setPrice(null);
    setFeatures(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/ml/predict-price-for-batch/${batchId}`);
      setPrice(res.data.predicted_price);
      setFeatures(res.data.features);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleAnomaly = async () => {
    setError(null);
    setAnomaly(null);
    setFeatures(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/ml/detect-quality-anomaly-for-batch/${batchId}`);
      setAnomaly(res.data.anomaly);
      setFeatures(res.data.features);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Batch AI/ML Analytics (Auto Feature Extraction)</h2>
      <input value={batchId} onChange={e => setBatchId(e.target.value)} placeholder="Batch ID" style={{ width: 200 }} />
      <button onClick={handlePredict}>Predict Price</button>
      <button onClick={handleAnomaly}>Detect Quality Anomaly</button>
      {features && <div>Features: <code>{JSON.stringify(features)}</code></div>}
      {price !== null && <div>Predicted Price: <b>{price}</b></div>}
      {anomaly !== null && <div>Quality Anomaly: <b>{anomaly ? 'Yes' : 'No'}</b></div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default BatchMLAnalytics;
