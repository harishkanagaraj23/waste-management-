import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo">
              <Recycle className="logo-icon" />
              <span>Eco<span className="logo-highlight">Waste</span></span>
            </Link>
            <p className="footer-desc">
              Empowering urban local bodies and citizens with smart tools for waste segregation, compliance tracking, and sustainable waste disposal workflows.
            </p>
          </div>
          
          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Homepage</Link></li>
              <li><Link to="/learn">Waste Aggregation</Link></li>
              <li><Link to="/ai-identifier">AI Identifier</Link></li>
              <li><Link to="/centers">Disposal Centers</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="#segregation">Wet vs Dry Guidelines</a></li>
              <li><a href="#consequences">Pollution Consequences</a></li>
              <li><a href="#solutions">Management Solutions</a></li>
              <li><Link to="/login">Member Portal</Link></li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4>Contact Info</h4>
            <ul>
              <li><MapPin size={16} className="contact-icon" /> <span>Eco-Waste Zone, Ward 15, New Delhi</span></li>
              <li><Phone size={16} className="contact-icon" /> <span>+91 98765 43210</span></li>
              <li><Mail size={16} className="contact-icon" /> <span>support@ecowaste.gov.in</span></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EcoWaste Management Project. Made with React & Node.js by Ronagaw.</p>
          <div className="footer-socials">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><Globe size={18} /></a>
            <a href="https://google.com" target="_blank" rel="noopener noreferrer"><Globe size={18} /></a>
          </div>
        </div>
      </div>
      
      <style>{`
        .footer-container {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-glass);
          padding: 4rem 2rem 2rem 2rem;
          color: var(--text-secondary);
          margin-top: auto;
        }
        
        .footer-inner {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 2fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        
        .footer-brand-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 800;
          font-size: 1.3rem;
          color: var(--text-primary);
        }
        
        .footer-desc {
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        .footer-links-col h4, .footer-contact-col h4 {
          color: var(--text-primary);
          font-size: 1rem;
          margin-bottom: 1.25rem;
          position: relative;
        }
        
        .footer-links-col h4::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 1.5rem;
          height: 2px;
          background: var(--primary);
        }
        
        .footer-links-col ul, .footer-contact-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .footer-links-col a {
          font-size: 0.9rem;
          transition: color var(--transition-fast);
        }
        
        .footer-links-col a:hover {
          color: var(--primary);
        }
        
        .footer-contact-col li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9rem;
        }
        
        .contact-icon {
          color: var(--primary);
          margin-top: 0.2rem;
          flex-shrink: 0;
        }
        
        .footer-bottom {
          border-top: 1px solid var(--border-glass);
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }
        
        .footer-socials {
          display: flex;
          gap: 1.25rem;
        }
        
        .footer-socials a {
          color: var(--text-muted);
          transition: color var(--transition-fast);
        }
        
        .footer-socials a:hover {
          color: var(--primary);
        }
        
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }
        
        @media (max-width: 576px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
