// src/pages/VerifyPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const VerifyPage = () => {
  // Get the token from the URL
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Send request to backend to verify the token
    fetch(`http://localhost:5000/api/auth/verify/${token}`)
      .then(res => res.json())
      .then(data => {
        setMessage(data.message || 'Verification complete!');
        setLoading(false);
      })
      .catch(() => {
        setMessage('Verification failed.');
        setLoading(false);
      });
  }, [token]);

  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>{loading ? 'Verifying your account...' : message}</h1>
      {(!loading && message === 'Verification complete!') &&
        <p>You can now log in to your account.</p>
      }
    </div>
  );
};

export default VerifyPage;
