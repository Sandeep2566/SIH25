import React, { useEffect, useState } from 'react';
import BatchForm from './components/BatchForm';
import BatchDetails from './components/BatchDetails';
import TransferForm from './components/TransferForm';
import TraceabilityView from './components/TraceabilityView';
import QRCodeDisplay from './components/QRCodeDisplay';
import PriceQualityForm from './components/PriceQualityForm';


function App() {
  const [qrBatchId, setQrBatchId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const batchId = params.get('batchId');
    if (batchId) setQrBatchId(batchId);
  }, []);

  return (
    <div>
      <h1>AgriTrace Supply Chain Transparency</h1>
      <p>Welcome to the blockchain-based agricultural produce traceability platform.</p>
      {!qrBatchId && <>
        <BatchForm />
        <BatchDetails />
        <TransferForm />
        <PriceQualityForm />
      </>}
      <TraceabilityView initialBatchId={qrBatchId} />
    </div>
  );
}

export default App;
