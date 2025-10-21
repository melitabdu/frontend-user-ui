import React, { useState } from 'react';
import axios from 'axios';

const ResetPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestReset = async () => {
    if (!/^09\d{8}$/.test(phone)) {
      setError('Please enter a valid Ethiopian phone number starting with 09');
      setMessage('');
      return;
    }
    try {
      const res = await axios.post('/api/auth/request-reset', { phone });
      setMessage(res.data.message);
      setError('');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setMessage('');
    }
  };

  const handleResetPassword = async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit reset code');
      setMessage('');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setMessage('');
      return;
    }
    try {
      const res = await axios.post('/api/auth/reset-password', {
        phone,
        code,
        newPassword,
      });
      setMessage(res.data.message);
      setError('');
      setStep(3);
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      if (backendMessage === 'Invalid or expired reset code') {
        setError('The code you entered is invalid or has expired. Please request a new one.');
      } else {
        setError(backendMessage || 'Failed to reset password. Please try again.');
      }
      setMessage('');
    }
  };

  return (
    <div className="reset-password-modal">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">&times;</button>
        <h2>Reset Password</h2>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={handleRequestReset}>Send Reset Code</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter reset code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleResetPassword}>Reset Password</button>
          </>
        )}

        {step === 3 && (
          <p className="success">Your password has been reset successfully. You can now log in.</p>
        )}

        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
