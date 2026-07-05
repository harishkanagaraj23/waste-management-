import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Recycle, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen' // default role is citizen
  });
  
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [loading, setLoading] = useState(false);

  // Real-time check if passwords match
  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      setIsMatching(formData.password === formData.confirmPassword);
    } else {
      setIsMatching(false);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all the fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setSuccess('Registration successful! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-card glass-panel">
        <div className="signup-header">
          <Recycle className="signup-logo-icon" size={32} />
          <h2>Create Account</h2>
          <p>Join the green initiative today</p>
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

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">Account Type (Role)</label>
            <select
              id="role"
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="citizen">Citizen (Report Issues, View Schedules)</option>
              <option value="staff">Collection Staff (Log Waste Records)</option>
              <option value="admin">Administrator (System Dashboard & Reports)</option>
            </select>
          </div>

          <div className="form-group relative-input">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-icon">
              <input
                type={showPass ? "text" : "password"}
                id="password"
                name="password"
                className="form-input w-full"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group relative-input">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <input
                type={showConfirmPass ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="form-input w-full"
                placeholder="••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {formData.confirmPassword && (
              <div className="match-indicator">
                {isMatching ? (
                  <span className="match-success text-green-glow">
                    <CheckCircle2 size={16} /> Passwords match! (Green Signal)
                  </span>
                ) : (
                  <span className="match-error">
                    Passwords do not match
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${isMatching && formData.name && formData.email ? 'pulse-green' : ''}`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <div className="signup-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>

      <style>{`
        .signup-page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 12rem);
          padding: 2rem 1rem;
        }
        
        .signup-card {
          width: 100%;
          max-width: 480px;
          padding: 2.5rem;
        }
        
        .signup-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .signup-logo-icon {
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        
        .signup-header h2 {
          font-size: 1.75rem;
          color: var(--text-primary);
        }
        
        .signup-header p {
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
        
        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .w-full {
          width: 100%;
        }
        
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-with-icon .form-input {
          padding-right: 2.5rem;
        }
        
        .toggle-password-btn {
          position: absolute;
          right: 0.75rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        
        .toggle-password-btn:hover {
          color: var(--text-secondary);
        }
        
        .match-indicator {
          font-size: 0.8rem;
          margin-top: 0.4rem;
        }
        
        .match-success {
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-weight: 600;
        }
        
        .text-green-glow {
          text-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
        }
        
        .match-error {
          color: var(--accent-red);
        }
        
        .signup-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .signup-footer a {
          color: var(--primary);
          font-weight: 600;
        }
        
        .signup-footer a:hover {
          color: var(--primary-hover);
        }
      `}</style>
    </div>
  );
}
