import React from 'react';
import QRCode from 'qrcode.react';

function QRCodeDisplay({ value }) {
  if (!value) return null;
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Batch QR Code</h3>
      <QRCode value={value} size={180} />
      <div style={{ marginTop: 10, wordBreak: 'break-all' }}>{value}</div>
    </div>
  );
}

export default QRCodeDisplay;
