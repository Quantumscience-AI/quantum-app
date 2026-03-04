import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { sendPasswordResetEmail, auth } from '../config/firebase';
import './LoginPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error) {
      console.error('Reset error:', error);
      
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="glass-logo">QuantumScienceAI</span>
      </div>

      <div className="auth-container">
        <button className="back-to-login" onClick={() => navigate('/login')}>
          <FiArrowLeft size={20} />
        </button>

        <h1 className="auth-title">Forgot Password</h1>

        <form onSubmit={handleResetPassword} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              Password reset link sent! Check your email.
            </div>
          )}

          <div className="input-group">
            <FiMail className="input-icon" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              autoComplete="email"
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="auth-secondary-btn"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
