import React, { useState, useEffect } from 'react';
import { Truck, AlertCircle, CheckCircle2, ClipboardList, Send, Camera } from 'lucide-react';

export default function StaffDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [collections, setCollections] = useState([]);
  const [formData, setFormData] = useState({
    ward_no: 'Ward 1',
    waste_type: 'wet',
    weight_kg: '',
    segregated_correctly: '1',
    notes: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://waste-management-1-nb53.onrender.com/api/collections', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      }
    } catch (err) {
      console.error('Error fetching collection logs:', err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ward_no || !formData.weight_kg) {
      setMessage({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    setSubmitting(true);
    setMessage({ text: '', type: '' });

    const submissionData = new FormData();
    submissionData.append('ward_no', formData.ward_no);
    submissionData.append('waste_type', formData.waste_type);
    submissionData.append('weight_kg', formData.weight_kg);
    submissionData.append('segregated_correctly', formData.segregated_correctly);
    submissionData.append('notes', formData.notes);
    if (photo) {
      submissionData.append('photo', photo);
    }

    try {
      const res = await fetch('https://waste-management-1-nb53.onrender.com/api/collections', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submissionData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit log');

      setMessage({ text: 'Waste collection logged successfully!', type: 'success' });
      setFormData({
        ward_no: 'Ward 1',
        waste_type: 'wet',
        weight_kg: '',
        segregated_correctly: '1',
        notes: ''
      });
      setPhoto(null);
      setPhotoPreview(null);
      fetchCollections(); // Reload list
    } catch (err) {
      setMessage({ text: err.message || 'Error saving collection log.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1 className="page-title">Staff Portal</h1>
        <p className="page-subtitle">Welcome, {user.name}. Input waste metrics, monitor segregation rules, and log daily collection weights.</p>
      </div>

      <div className="grid-2 dashboard-layouts">
        {/* Form to log collections */}
        <div className="form-panel glass-panel">
          <div className="panel-header">
            <Truck className="panel-icon text-accent" />
            <h3>Log Daily Collection</h3>
          </div>
          
          {message.text && (
            <div className={`alert-box alert-${message.type}`}>
              {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="collection-form">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="ward">Ward Number / Area</label>
                <select
                  id="ward"
                  value={formData.ward_no}
                  onChange={(e) => setFormData({ ...formData, ward_no: e.target.value })}
                  className="form-select"
                >
                  <option value="Ward 1">Ward 1 (Connaught Place)</option>
                  <option value="Ward 2">Ward 2 (Vasant Kunj)</option>
                  <option value="Ward 3">Ward 3 (Karol Bagh)</option>
                  <option value="Ward 4">Ward 4 (Mayur Vihar)</option>
                  <option value="Ward 5">Ward 5 (Dwarka)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="waste-type">Waste Category</label>
                <select
                  id="waste-type"
                  value={formData.waste_type}
                  onChange={(e) => setFormData({ ...formData, waste_type: e.target.value })}
                  className="form-select"
                >
                  <option value="wet">Wet Waste (Biodegradable)</option>
                  <option value="dry">Dry Waste (Recyclable)</option>
                  <option value="hazardous">Hazardous Waste</option>
                  <option value="mixed">Mixed Waste (Non-Compliant)</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="weight">Weight (in Kilograms)</label>
                <input
                  type="number"
                  step="0.01"
                  id="weight"
                  placeholder="e.g., 45.5"
                  value={formData.weight_kg}
                  onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="compliance">Segregation Compliance</label>
                <select
                  id="compliance"
                  value={formData.segregated_correctly}
                  onChange={(e) => setFormData({ ...formData, segregated_correctly: e.target.value })}
                  className="form-select"
                >
                  <option value="1">Yes (Segregated Properly)</option>
                  <option value="0">No (Improper Segregation)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notes">Collector Remarks / Notes</label>
              <textarea
                id="notes"
                rows="2"
                placeholder="Add notes e.g., plastic contaminants found in organic bin..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="form-textarea"
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Attach Non-Compliance Photo (Optional)</label>
              <div className="photo-picker-row">
                <button
                  type="button"
                  className="btn btn-secondary btn-photo-select"
                  onClick={() => document.getElementById('collection-photo').click()}
                >
                  <Camera size={16} />
                  <span>Attach Photo</span>
                </button>
                <input
                  type="file"
                  id="collection-photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden-file-input"
                />
                {photo && <span className="filename-indicator">{photo.name}</span>}
              </div>

              {photoPreview && (
                <div className="upload-preview-box">
                  <img src={photoPreview} alt="Non compliance evidence" />
                  <button type="button" className="btn-remove-preview" onClick={() => { setPhoto(null); setPhotoPreview(null); }}>Remove</button>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-submit-collection" disabled={submitting}>
              <Send size={18} />
              <span>{submitting ? 'Saving Log...' : 'Submit Log Entry'}</span>
            </button>
          </form>
        </div>

        {/* History panel */}
        <div className="history-panel glass-panel">
          <div className="panel-header">
            <ClipboardList className="panel-icon text-accent" />
            <h3>My Collection History</h3>
          </div>
          
          <div className="collections-list-container">
            {collections.length === 0 ? (
              <div className="empty-collections">No collections logged yet for today.</div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Ward</th>
                      <th>Type</th>
                      <th>Weight</th>
                      <th>Compliance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map(c => (
                      <tr key={c.id}>
                        <td>{new Date(c.collected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td>{c.ward_no}</td>
                        <td><span className={`badge badge-${c.waste_type}`}>{c.waste_type}</span></td>
                        <td>{c.weight_kg} kg</td>
                        <td>
                          <span className={c.segregated_correctly === 1 ? 'text-primary' : 'text-danger'}>
                            {c.segregated_correctly === 1 ? 'Compliant' : 'Non-Compliant'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
        
        .panel-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .panel-icon {
          color: var(--primary);
        }
        
        .dashboard-layouts {
          grid-template-columns: 1.1fr 1fr;
          align-items: start;
        }
        
        .form-panel, .history-panel {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .collection-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
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
        
        .btn-submit-collection {
          width: 100%;
        }
        
        .collections-list-container {
          overflow: hidden;
        }
        
        .empty-collections {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        
        @media (max-width: 992px) {
          .dashboard-layouts {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
