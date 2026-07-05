import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Recycle, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token & user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess('Login successful! Access granted...');
      
      // Redirect based on role
      setTimeout(() => {
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else if (data.user.role === 'staff') {
          navigate('/staff');
        } else {
          navigate('/citizen');
        }
      }, 1000);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card glass-panel">
        <div className="login-header">
          <Recycle className="login-logo-icon" size={32} />
          <h2>Welcome Back</h2>
          <p>Login to your Waste Management Dashboard</p>
        </div>

        {error && (
          <div className="alert-box alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert-box alert-success">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials glass-card">
          <h4>Demo Accounts</h4>
          <ul>
            <li><strong>Admin:</strong> admin@waste.com / admin123</li>
            <li><strong>Staff:</strong> staff@waste.com / staff123</li>
            <li><strong>Citizen:</strong> citizen@waste.com / citizen123</li>
          </ul>
        </div>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
        </div>
      </div>

      <style>{`
        .login-page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 12rem);
          padding: 2rem 1rem;
        }
        
        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .login-logo-icon {
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        
        .login-header h2 {
          font-size: 1.75rem;
          color: var(--text-primary);
        }
        
        .login-header p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .alert-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        
        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--accent-red);
        }
        
        .alert-success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: var(--primary);
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .w-full {
          width: 100%;
        }
        
        .demo-credentials {
          margin-top: 1.5rem;
          padding: 1rem;
          font-size: 0.85rem;
          border-color: rgba(16, 185, 129, 0.15);
        }
        
        .demo-credentials h4 {
          margin-bottom: 0.5rem;
          color: var(--accent);
        }
        
        .demo-credentials ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          color: var(--text-secondary);
        }
        
        .login-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .login-footer a {
          color: var(--primary);
          font-weight: 600;
        }
        
        .login-footer a:hover {
          color: var(--primary-hover);
        }
      `}</style>
    </div>
  );
}
