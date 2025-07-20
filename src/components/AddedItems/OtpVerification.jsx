import React, { useState } from 'react';

const OtpVerification = ({ onVerify, onCancel, onEmailUpdate }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const regex = new RegExp('[a-zA-Z0-9]+@[a-z]+\\.[a-z]{2,3}');

  const sendOtp = async () => {
    if (!regex.test(email)) {
      setError('Invalid email address');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://royalbangla-server.gofastapi.com/sendotp', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setSuccess(true);
        onEmailUpdate(email);
      } else {
        setError('Email not found');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpCheck = otp.join('');
    if (otpCheck.length !== 4) {
      setError('Please enter a valid OTP');
      return;
    }

    try {
      const response = await fetch('https://royalbangla-server.gofastapi.com/verify', {
        method: 'POST',
        body: JSON.stringify({ email, otp: otpCheck }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        onVerify();
      } else {
        setError('Invalid OTP');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    }
  };

  const handleOtpChange = (index, value, event) => {
    const newOtp = [...otp];
    const { key } = event;

    if (key === 'Backspace') {
      if (newOtp[index] === '') {
        if (index > 0) {
          document.querySelector(`.otp-input-${index - 1}`).focus();
        }
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (value.length === 1) {
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 3) {
        document.querySelector(`.otp-input-${index + 1}`).focus();
      }
    }
  };

  return (
    <div className="otp-verification-modal">
      <div className="otp-verification-content">
        <button className="close-button" onClick={onCancel}>
          &times;
        </button>
        <h3>Verify Your Identity</h3>
        <p>Please enter your email</p>

        <input
          type="email"
          className="form-control email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
        />
        <button className="btn btn-primary" onClick={sendOtp} disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>

        {success && (
          <div className="verification">
            <p className="success">An OTP has been sent to <strong>{email}</strong>.</p>
            <p>Please enter the OTP below:</p>
            <div className="otp-input-fields">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className={`otp-input-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value, e.nativeEvent)}
                  inputMode="numeric"
                  onKeyDown={(e) => handleOtpChange(index, e.target.value, e)}
                />
              ))}
            </div>
            <button className="btn btn-success" onClick={verifyOtp}>
              Verify OTP
            </button>
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        )}

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default OtpVerification;
