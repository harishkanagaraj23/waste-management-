import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Recycle, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <Recycle className="logo-icon animate-spin-slow" />
          <span className="logo-text">Eco<span className="logo-highlight">Waste</span></span>
        </Link>
        
        {/* Mobile menu toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={`nav-item ${isActive('/')}`} onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/learn" className={`nav-item ${isActive('/learn')}`} onClick={() => setIsOpen(false)}>Waste Aggregation</Link>
          <Link to="/ai-identifier" className={`nav-item ${isActive('/ai-identifier')}`} onClick={() => setIsOpen(false)}>AI Identifier</Link>
          <Link to="/centers" className={`nav-item ${isActive('/centers')}`} onClick={() => setIsOpen(false)}>Find Centers</Link>
          <Link to="/contact" className={`nav-item ${isActive('/contact')}`} onClick={() => setIsOpen(false)}>Contact Us</Link>
          
          <div className="nav-divider"></div>
          
          {token && user ? (
            <div className="nav-auth-group">
              <Link 
                to={user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/citizen'} 
                className={`nav-item nav-dashboard-link ${isActive('/admin') || isActive('/staff') || isActive('/citizen')}`}
                onClick={() => setIsOpen(false)}
              >
                <User size={16} />
                <span>Dashboard ({user.name.split(' ')[0]})</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout-nav" title="Log Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="nav-login-btn" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/signup" className="nav-signup-btn btn-primary" onClick={() => setIsOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 4.5rem;
          background: rgba(10, 15, 13, 0.75);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-bottom: 1px solid var(--border-glass);
          z-index: 1000;
          display: flex;
          align-items: center;
          padding: 0 2rem;
        }
        
        .navbar-inner {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--text-primary);
        }
        
        .logo-icon {
          color: var(--primary);
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        
        .logo-highlight {
          color: var(--primary);
        }
        
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .nav-item {
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--text-secondary);
          padding: 0.25rem 0;
          border-bottom: 2px solid transparent;
          transition: all var(--transition-fast);
        }
        
        .nav-item:hover, .active-link {
          color: var(--primary);
        }
        
        .active-link {
          border-bottom-color: var(--primary);
        }
        
        .nav-divider {
          width: 1px;
          height: 1.25rem;
          background: var(--border-glass);
        }
        
        .nav-auth-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .nav-dashboard-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid var(--border-glass-active);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
          color: var(--accent);
          font-weight: 600;
        }
        
        .nav-dashboard-link:hover {
          background: rgba(16, 185, 129, 0.2);
        }
        
        .btn-logout-nav {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color var(--transition-fast);
          display: flex;
          align-items: center;
        }
        
        .btn-logout-nav:hover {
          color: var(--accent-red);
        }
        
        .nav-auth-buttons {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .nav-login-btn {
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .nav-signup-btn {
          padding: 0.5rem 1.2rem;
          font-size: 0.9rem;
          border-radius: var(--radius-sm);
        }
        
        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .mobile-toggle {
            display: block;
          }
          
          .nav-links {
            display: none;
            position: absolute;
            top: 4.5rem;
            left: 0;
            right: 0;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-glass);
            flex-direction: column;
            padding: 2rem;
            gap: 1.5rem;
            align-items: stretch;
            box-shadow: var(--shadow-glow);
          }
          
          .nav-links.mobile-open {
            display: flex;
          }
          
          .nav-divider {
            display: none;
          }
          
          .nav-auth-group, .nav-auth-buttons {
            flex-direction: column;
            align-items: stretch;
          }
          
          .btn-logout-nav {
            justify-content: center;
            padding: 0.75rem;
            border: 1px solid var(--border-glass);
            border-radius: var(--radius-sm);
          }
        }
      `}</style>
    </nav>
  );
}
