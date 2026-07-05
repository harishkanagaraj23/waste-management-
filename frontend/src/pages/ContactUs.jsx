import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 1500);
  };

  return (
    <div className="contact-container">
      <div className="page-header">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">Get in touch with the team or share suggestions to improve local waste operations.</p>
      </div>

      <div className="grid-2 contact-layout">
        {/* Contact Form */}
        <div className="contact-form-panel glass-panel">
          {submitted ? (
            <div className="success-message">
              <CheckCircle2 size={48} className="success-icon animate-pulse" />
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for reaching out. Our support team will review your feedback and get back to you shortly.</p>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary mt-1">Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h3>Send us a Message</h3>
              
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Your Name</label>
                <input
                  type="text"
                  id="contact-name"
                  className="form-input"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email Address</label>
                <input
                  type="email"
                  id="contact-email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Topic/Subject</label>
                <select
                  id="contact-subject"
                  className="form-select"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Suggestion">Suggestion / Recommendation</option>
                  <option value="Report Issue">Reporting System Defect</option>
                  <option value="Partnership">Institutional Partnership</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Message Details</label>
                <textarea
                  id="contact-message"
                  className="form-textarea"
                  rows="5"
                  placeholder="Type your suggestions or comments..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
                <Send size={18} />
                <span>{loading ? 'Sending...' : 'Submit Feedback'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info panels */}
        <div className="contact-info-panel">
          <div className="glass-panel info-card-inner">
            <h3>Support & Inquiries</h3>
            <p className="card-desc">Have queries related to collection timings, bins distribution, or compliance guidelines? Contact our helpdesk.</p>
            
            <ul className="info-list">
              <li>
                <div className="icon-box"><Phone size={20} /></div>
                <div>
                  <h4>Citizen Hotline</h4>
                  <p>+91 1800 233 5678 (Toll Free, 9 AM - 6 PM)</p>
                </div>
              </li>
              <li>
                <div className="icon-box"><Mail size={20} /></div>
                <div>
                  <h4>Official Inbox</h4>
                  <p>contact@ecowaste.gov.in</p>
                </div>
              </li>
              <li>
                <div className="icon-box"><MapPin size={20} /></div>
                <div>
                  <h4>Head Office</h4>
                  <p>Ministry of Environment & Sanitation, 3rd Floor, Central Annex, New Delhi - 110001</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="glass-panel info-card-inner highlight-card">
            <h3><MessageSquare size={20} className="card-icon" /> Citizen Portal</h3>
            <p>
              Registered citizens can instantly log collection complaints, upload photographs of trash accumulation, and monitor waste sorting schedules from their dashboard.
            </p>
            <button className="btn btn-secondary mt-1">Visit Citizen Dashboard</button>
          </div>
        </div>
      </div>

      <style>{`
        .contact-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .contact-layout {
          align-items: start;
        }
        
        .contact-form-panel {
          padding: 2.5rem;
        }
        
        .contact-form-panel h3 {
          font-size: 1.35rem;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }
        
        .success-message {
          text-align: center;
          padding: 2rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .success-icon {
          color: var(--primary);
        }
        
        .success-message h3 {
          color: var(--primary);
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .success-message p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .btn-submit {
          width: 100%;
        }
        
        .contact-info-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .info-card-inner {
          padding: 2rem;
        }
        
        .info-card-inner h3 {
          font-size: 1.35rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }
        
        .card-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }
        
        .info-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .info-list li {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }
        
        .icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid var(--border-glass-active);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
        }
        
        .info-list h4 {
          font-size: 0.95rem;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }
        
        .info-list p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .highlight-card {
          border-color: rgba(16, 185, 129, 0.2);
          background: rgba(16, 185, 129, 0.02);
        }
        
        .highlight-card h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent);
        }
        
        .highlight-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }
        
        .mt-1 {
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
