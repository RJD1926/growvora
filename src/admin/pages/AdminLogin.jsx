import React, { useState } from 'react';
import { FiLock, FiMail, FiEye, FiEyeOff, FiArrowRight, FiShield, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { loginAdmin } from '../services/adminAuth';

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const result = loginAdmin(email, password);
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(result.message);
        setIsSubmitting(false);
      }
    }, 300);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-backdrop-glow" />
      
      <div className="admin-login-container">
        {/* Top Back link */}
        <div className="admin-login-top-bar">
          <a href="/" className="login-back-link">
            <FiArrowLeft />
            <span>Back to Public Site</span>
          </a>
          <div className="login-security-tag">
            <FiShield />
            <span>SECURE ACCESS</span>
          </div>
        </div>

        {/* Card */}
        <div className="admin-login-card">
          <div className="login-brand-header">
            <div className="login-logo-circle">
              <img src="/logo.png" alt="GrowVora" className="login-logo-img" />
            </div>
            <h1 className="login-title">GROWVORA</h1>
            <p className="login-subtitle">Admin Control Center</p>
          </div>

          {errorMessage && (
            <div className="login-error-alert" role="alert">
              <FiAlertCircle />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="admin-email">Admin ID / Email</label>
              <div className="input-with-icon">
                <FiMail className="field-icon" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <div className="input-with-icon">
                <FiLock className="field-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="admin-login-submit-btn"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <FiArrowRight />
            </button>
          </form>

          <div className="login-footer-notice">
            <span>Restricted area. Authorized personnel only.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
