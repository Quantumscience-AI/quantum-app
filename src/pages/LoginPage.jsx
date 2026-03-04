import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { signInWithEmailAndPassword, auth } from '../config/firebase';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password');
          break;
        default:
          setError('Login failed. Please try again.');
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
        <h1 className="auth-title">Login to your Account</h1>

        <form onSubmit={handleLogin} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
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

          <div className="input-group">
            <FiLock className="input-icon" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password-inside"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="auth-secondary-btn"
          >
            Create Account
          </button>

          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="forgot-password-btn"
          >
            Forgot Password?
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            By continuing, you agree to QuantumScienceAI's{' '}
            <a href="https://quantumscience-ai.github.io/quantumscience-ai/terms.html" target="_blank" rel="noopener noreferrer">
              Terms of Use
            </a>{' '}
            and acknowledge their{' '}
            <a href="https://quantumscience-ai.github.io/quantumscience-ai/privacy.html" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
