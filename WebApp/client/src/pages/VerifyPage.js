import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import "../assets/CSS/Login.css";

const VerifyPage = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="ig-login-bg">
      <div className="ig-login-flex-center">
        <div className="ig-login-col ig-right-col">
          <div className="ig-login-card">
            <h2>{loading ? 'Verifying your account...' : message}</h2>
            {!loading && message === 'Verification complete!' &&
              <>
                <p>You can now log in to your account.</p>
                <Link to="/login" className="ig-login-btn" style={{ display: "inline-block", marginTop: 12 }}>Go to Login</Link>
              </>
            }
            {!loading && message !== 'Verification complete!' &&
              <Link to="/login" className="ig-forgot-link" style={{ marginTop: 20, display: "block" }}>Retry / Back to Login</Link>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
