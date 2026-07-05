import React, { useState, useEffect } from 'react';
import { Mail, Clock, AlertTriangle, Image as ImageIcon, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function CitizenDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [notifications, setNotifications] = useState([]);
  const [issues, setIssues] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch guidelines/notifications & issues
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Notifications
      const notifRes = await fetch('https://waste-management-1-nb53.onrender.com/api/notifications?role=citizen');
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData);
      }

      // 2. Fetch My reported Issues
      const issuesRes = await fetch('https://waste-management-1-nb53.onrender.com/api/issues', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (issuesRes.ok) {
        const issuesData = await issuesRes.json();
        setIssues(issuesData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setMessage({ text: 'Please fill in all details.', type: 'error' });
      return;
    }

    setSubmitting(true);
    setMessage({ text: '', type: '' });

    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('description', formData.description);
    if (photo) {
      submissionData.append('photo', photo);
    }

    try {
      const res = await fetch('https://waste-management-1-nb53.onrender.com/api/issues', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submissionData // Multi-part form-data
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to lodge complaint');

      setMessage({ text: 'Issue report submitted successfully!', type: 'success' });
      setFormData({ title: '', description: '' });
      setPhoto(null);
      setPhotoPreview(null);
      fetchData(); // Reload issues list
    } catch (err) {
      setMessage({ text: err.message || 'Failed to log report.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1 className="page-title">Citizen Portal</h1>
        <p className="page-subtitle">Welcome, {user.name}. Report collection lapses, track tickets, and read community guidelines.</p>
      </div>

      {/* Announcements */}
      <section className="notifications-section">
        <h3><Mail size={18} className="section-title-icon" /> Notifications & Awareness Program</h3>
        {notifications.length === 0 ? (
          <div className="empty-notif glass-card">No new broadcast notifications.</div>
        ) : (
          <div className="notif-grid">
            {notifications.slice(0, 2).map(n => (
              <div key={n.id} className="notif-card glass-card">
                <h4>{n.title}</h4>
                <p>{n.message}</p>
                <span className="notif-date"><Clock size={12} /> {new Date(n.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid-2 dashboard-layouts">
        {/* Issue Reporter Form */}
        <div className="form-panel glass-panel">
          <h3>Report Waste Issue</h3>
          <p className="panel-desc">Dump yard overflow, uncollected bins, or incorrect segregation complaints.</p>

          {message.text && (
            <div className={`alert-box alert-${message.type}`}>
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleIssueSubmit} className="issue-form">
            <div className="form-group">
              <label className="form-label" htmlFor="issue-title">Issue Title</label>
              <input
                type="text"
                id="issue-title"
                placeholder="e.g., Overflowing dry bin in Block C"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="issue-desc">Detailed Description</label>
              <textarea
                id="issue-desc"
                rows="4"
                placeholder="Detail the location and severity of the issue..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-textarea"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Attach Photo Evidence (Optional)</label>
              <div className="photo-picker-row">
                <button
                  type="button"
                  className="btn btn-secondary btn-photo-select"
                  onClick={() => document.getElementById('issue-photo').click()}
                >
                  <ImageIcon size={16} />
                  <span>Choose Photo</span>
                </button>
                <input
                  type="file"
                  id="issue-photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden-file-input"
                />
                {photo && <span className="filename-indicator">{photo.name}</span>}
              </div>

              {photoPreview && (
                <div className="upload-preview-box">
                  <img src={photoPreview} alt="Complaint preview" />
                  <button type="button" className="btn-remove-preview" onClick={() => { setPhoto(null); setPhotoPreview(null); }}>Remove</button>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-submit-issue" disabled={submitting}>
              <Send size={18} />
              <span>{submitting ? 'Submitting Report...' : 'File Issue Report'}</span>
            </button>
          </form>
        </div>

        {/* Complaints History */}
        <div className="history-panel glass-panel">
          <h3>My Lodged Issues ({issues.length})</h3>
          <p className="panel-desc">Real-time status updates of the garbage collection complaints you filed.</p>

          <div className="issues-list">
            {issues.length === 0 ? (
              <div className="empty-issues">You have not submitted any issue reports yet.</div>
            ) : (
              issues.map(issue => (
                <div key={issue.id} className="issue-history-card glass-card">
                  <div className="issue-card-header">
                    <h4>{issue.title}</h4>
                    <span className={`badge-status ${issue.status === 'resolved' ? 'status-resolved-badge' : 'status-pending-badge'}`}>
                      {issue.status}
                    </span>
                  </div>
                  <p className="issue-card-desc">{issue.description}</p>
                  
                  {issue.photo_url && (
                    <div className="complaint-image-wrapper">
                      <a href={`https://waste-management-1-nb53.onrender.com${issue.photo_url}`} target="_blank" rel="noreferrer">
                        View Attached Evidence Photo
                      </a>
                    </div>
                  )}
                  
                  <div className="issue-card-footer">
                    <Clock size={12} />
                    <span>Reported: {new Date(issue.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        
        .notifications-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .section-title-icon {
          color: var(--primary);
          vertical-align: middle;
          margin-right: 0.5rem;
        }
        
        .notif-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        .notif-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .notif-card h4 {
          color: var(--accent);
          font-size: 1.1rem;
        }
        
        .notif-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        
        .notif-date {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }
        
        .dashboard-layouts {
          grid-template-columns: 1fr 1.2fr;
          align-items: stretch;
        }
        
        .form-panel, .history-panel {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .panel-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: -1rem;
        }
        
        .photo-picker-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .filename-indicator {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        
        .upload-preview-box {
          margin-top: 1rem;
          position: relative;
          display: inline-block;
        }
        
        .upload-preview-box img {
          max-width: 150px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-glass);
        }
        
        .btn-remove-preview {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          background: rgba(0,0,0,0.7);
          color: #fff;
          border: none;
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          cursor: pointer;
          border-radius: var(--radius-sm);
        }
        
        .btn-submit-issue {
          width: 100%;
        }
        
        .issues-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        
        .issue-history-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .issue-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        
        .issue-card-header h4 {
          font-size: 1rem;
          color: var(--text-primary);
        }
        
        .badge-status {
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: 700;
        }
        
        .status-pending-badge {
          background: rgba(245, 158, 11, 0.1);
          color: var(--accent-yellow);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        
        .status-resolved-badge {
          background: rgba(16, 185, 129, 0.1);
          color: var(--primary);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .issue-card-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        
        .complaint-image-wrapper a {
          font-size: 0.8rem;
          color: var(--accent);
          text-decoration: underline;
        }
        
        .issue-card-footer {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-glass);
          padding-top: 0.5rem;
        }
        
        .empty-issues, .empty-notif {
          text-align: center;
          padding: 2.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        
        @media (max-width: 992px) {
          .dashboard-layouts {
            grid-template-columns: 1fr;
          }
          
          .notif-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
