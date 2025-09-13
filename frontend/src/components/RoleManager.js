import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/roles';

function RoleManager() {
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('FARMER_ROLE');
  const [result, setResult] = useState(null);
  const [checkAddress, setCheckAddress] = useState('');
  const [checkRole, setCheckRole] = useState('FARMER_ROLE');
  const [hasRole, setHasRole] = useState(null);

  const handleGrant = async () => {
    try {
      const res = await axios.post(`${API}/grant`, { role, address });
      setResult(`Granted ${role} to ${address}. Tx: ${res.data.txHash}`);
    } catch (err) {
      setResult(err.response?.data?.error || err.message);
    }
  };

  const handleRevoke = async () => {
    try {
      const res = await axios.post(`${API}/revoke`, { role, address });
      setResult(`Revoked ${role} from ${address}. Tx: ${res.data.txHash}`);
    } catch (err) {
      setResult(err.response?.data?.error || err.message);
    }
  };

  const handleCheck = async () => {
    try {
      const res = await axios.get(`${API}/has`, { params: { role: checkRole, address: checkAddress } });
      setHasRole(res.data.hasRole);
    } catch (err) {
      setHasRole('Error');
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Role Manager (Admin Only)</h2>
      <div>
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="FARMER_ROLE">FARMER_ROLE</option>
          <option value="INSPECTOR_ROLE">INSPECTOR_ROLE</option>
          <option value="DISTRIBUTOR_ROLE">DISTRIBUTOR_ROLE</option>
          <option value="RETAILER_ROLE">RETAILER_ROLE</option>
        </select>
        <button onClick={handleGrant}>Grant Role</button>
        <button onClick={handleRevoke}>Revoke Role</button>
      </div>
      {result && <div style={{ marginTop: 10 }}>{result}</div>}
      <div style={{ marginTop: 20 }}>
        <input value={checkAddress} onChange={e => setCheckAddress(e.target.value)} placeholder="Check Address" />
        <select value={checkRole} onChange={e => setCheckRole(e.target.value)}>
          <option value="FARMER_ROLE">FARMER_ROLE</option>
          <option value="INSPECTOR_ROLE">INSPECTOR_ROLE</option>
          <option value="DISTRIBUTOR_ROLE">DISTRIBUTOR_ROLE</option>
          <option value="RETAILER_ROLE">RETAILER_ROLE</option>
        </select>
        <button onClick={handleCheck}>Check Role</button>
        {hasRole !== null && <span style={{ marginLeft: 10 }}>{hasRole === true ? 'Has Role' : hasRole === false ? 'No Role' : hasRole}</span>}
      </div>
    </div>
  );
}

export default RoleManager;
