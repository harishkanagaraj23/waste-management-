import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  ShieldCheck, AlertCircle, FileText, Send, 
  Trash2, Printer, CheckCircle2, UserCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [stats, setStats] = useState({
    complianceRate: 100,
    pendingIssuesCount: 0,
    categoryStats: [],
    wardStats: [],
    trendStats: [],
    recentCollections: []
  });

  const [issues, setIssues] = useState([]);
  const [notifData, setNotifData] = useState({ title: '', message: '', target_role: 'all' });
  
  const [loading, setLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  
  // Recharts color scheme
  const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];

  useEffect(() => {
    fetchStats();
    fetchIssues();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('https://waste-management-1-nb53.onrender.com/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard statistics:', err);
    }
  };

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://waste-management-1-nb53.onrender.com/api/issues', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (err) {
      console.error('Error loading complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveIssue = async (id) => {
    try {
      const res = await fetch(`https://waste-management-1-nb53.onrender.com/api/issues/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'resolved' })
      });
      if (res.ok) {
        fetchIssues();
        fetchStats(); // Update counters
      }
    } catch (err) {
      console.error('Error resolving issue:', err);
    }
  };

  const handleBroadcastNotice = async (e) => {
    e.preventDefault();
    if (!notifData.title || !notifData.message) return;
    setNotifMessage('');

    try {
      const res = await fetch('https://waste-management-1-nb53.onrender.com/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notifData)
      });
      
      if (res.ok) {
        setNotifMessage('Notification broadcasted successfully!');
        setNotifData({ title: '', message: '', target_role: 'all' });
        setTimeout(() => setNotifMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error broadcasting notice:', err);
    }
  };

  // Convert stats to charts friendly formats
  const pieChartData = stats.categoryStats.map(item => ({
    name: item.waste_type.toUpperCase() + ' WASTE',
    value: parseFloat(item.total_weight)
  }));

  const areaChartData = stats.trendStats.map(item => ({
    date: item.date_label,
    weight: parseFloat(item.total_weight)
  }));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-container">
      <div className="page-header print-hidden">
        <h1 className="page-title">Administrator Center</h1>
        <p className="page-subtitle">Welcome, {user.name}. Control compliance rates, audit dump weights, and resolve reports.</p>
        <button className="btn btn-secondary btn-print-report" onClick={handlePrint}>
          <Printer size={16} />
          <span>Print Daily Summary Report</span>
        </button>
      </div>

      {/* Printable Report Header */}
      <div className="print-only print-report-header">
        <h1>EcoWaste Management System - Administrative Report</h1>
        <p>Generated on: {new Date().toLocaleString()}</p>
        <p>Auditor: {user.name} (Admin)</p>
      </div>

      {/* Summary Cards */}
      <div className="stats-row grid-3">
        <div className="glass-panel stats-card">
          <div className="card-desc">Compliance Rating</div>
          <h2>{stats.complianceRate}%</h2>
          <div className="card-tag text-primary">
            <ShieldCheck size={14} /> <span>Sorting rules met</span>
          </div>
        </div>

        <div className="glass-panel stats-card">
          <div className="card-desc">Active Complaints</div>
          <h2>{stats.pendingIssuesCount} Tickets</h2>
          <div className={`card-tag ${stats.pendingIssuesCount > 0 ? 'text-danger' : 'text-primary'}`}>
            <AlertCircle size={14} /> <span>Requires action</span>
          </div>
        </div>

        <div className="glass-panel stats-card">
          <div className="card-desc">Recent Collection Logged</div>
          <h2>{stats.recentCollections.length > 0 ? `${stats.recentCollections[0].weight_kg} kg` : '0 kg'}</h2>
          <div className="card-tag text-accent">
            <FileText size={14} /> <span>From {stats.recentCollections.length > 0 ? stats.recentCollections[0].ward_no : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid-2 charts-row print-break">
        {/* Collection Trend */}
        <div className="glass-panel chart-card">
          <h3>Collection Volume Trend (kg)</h3>
          <p className="chart-subtitle">Total waste quantity logged across all wards during past collections.</p>
          <div className="chart-viewport">
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={areaChartData.length > 0 ? areaChartData : [{ date: 'No Data', weight: 0 }]}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} />
                <YAxis stroke="var(--text-muted)" fontSize={10} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }} />
                <Area type="monotone" dataKey="weight" stroke="var(--primary)" fillOpacity={1} fill="url(#colorWeight)" name="Quantity (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Breakdown */}
        <div className="glass-panel chart-card">
          <h3>Waste Type Breakdown</h3>
          <p className="chart-subtitle">Percentage weight share of wet, dry, hazardous, and mixed trash.</p>
          <div className="chart-viewport flex-chart">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={pieChartData.length > 0 ? pieChartData : [{ name: 'No Data', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-glass)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Admin Actions & Complaint Resolver Grid */}
      <div className="grid-2 dashboard-layouts print-hidden">
        {/* Broadcast Form */}
        <div className="form-panel glass-panel">
          <h3>Broadcast Notice / Notification</h3>
          <p className="panel-desc">Publish notices regarding collection changes or segregation reminders.</p>

          {notifMessage && (
            <div className="alert-box alert-success">
              <CheckCircle2 size={18} />
              <span>{notifMessage}</span>
            </div>
          )}

          <form onSubmit={handleBroadcastNotice} className="notif-form">
            <div className="form-group">
              <label className="form-label" htmlFor="notif-title">Announcement Title</label>
              <input
                type="text"
                id="notif-title"
                placeholder="e.g., Extended Holiday Collection Hours"
                value={notifData.title}
                onChange={(e) => setNotifData({ ...notifData, title: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notif-target">Target Audience</label>
              <select
                id="notif-target"
                value={notifData.target_role}
                onChange={(e) => setNotifData({ ...notifData, target_role: e.target.value })}
                className="form-select"
              >
                <option value="all">Everyone (All Roles)</option>
                <option value="citizen">Citizens Only</option>
                <option value="staff">Collection Staff Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notif-msg">Notice Details</label>
              <textarea
                id="notif-msg"
                rows="4"
                placeholder="Compose announcement body..."
                value={notifData.message}
                onChange={(e) => setNotifData({ ...notifData, message: e.target.value })}
                className="form-textarea"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              <Send size={16} />
              <span>Broadcast Notice</span>
            </button>
          </form>
        </div>

        {/* Complaints Resolver */}
        <div className="issues-resolver-panel glass-panel">
          <h3>Active Citizen Tickets ({issues.filter(i => i.status === 'pending').length})</h3>
          <p className="panel-desc">Audit complaints filed by residents and resolve unresolved issues.</p>

          <div className="tickets-list">
            {issues.length === 0 ? (
              <div className="empty-tickets">No tickets lodged. Everything clean!</div>
            ) : (
              issues.map(item => (
                <div key={item.id} className="ticket-card glass-card">
                  <div className="ticket-header">
                    <h4>{item.title}</h4>
                    <span className={`badge-status ${item.status === 'resolved' ? 'status-resolved-badge' : 'status-pending-badge'}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <p className="ticket-desc">{item.description}</p>
                  
                  <div className="ticket-meta">
                    <span>Filed by: <strong>{item.citizen_name}</strong></span>
                    <span>Date: {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>

                  {item.photo_url && (
                    <div className="ticket-photo-link">
                      <a href={`https://waste-management-1-nb53.onrender.com${item.photo_url}`} target="_blank" rel="noreferrer">
                        View Photo Evidence
                      </a>
                    </div>
                  )}

                  {item.status === 'pending' && (
                    <button 
                      className="btn btn-primary btn-resolve-ticket"
                      onClick={() => handleResolveIssue(item.id)}
                    >
                      <UserCheck size={14} />
                      <span>Resolve Ticket</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Ward Compliance Table (Shown on print) */}
      <div className="print-table-section print-only mt-3">
        <h3>Ward Segregation Compliance Performance</h3>
        <table className="print-table">
          <thead>
            <tr>
              <th>Ward Name</th>
              <th>Total Logged Weight (kg)</th>
              <th>Compliance Rating (%)</th>
            </tr>
          </thead>
          <tbody>
            {stats.wardStats.map((w, idx) => (
              <tr key={idx}>
                <td>{w.ward_no}</td>
                <td>{w.total_weight} kg</td>
                <td>{w.compliance_percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-container {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        
        .btn-print-report {
          margin-top: 0.5rem;
        }
        
        .stats-card {
          padding: 1.75rem;
          text-align: left;
        }
        
        .stats-card h2 {
          font-size: 2.25rem;
          margin: 0.5rem 0;
          color: var(--text-primary);
        }
        
        .card-desc {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        
        .card-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .chart-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .chart-card h3 {
          font-size: 1.15rem;
          color: var(--text-primary);
        }
        
        .chart-subtitle {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        
        .chart-viewport {
          margin-top: auto;
        }
        
        .flex-chart {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .dashboard-layouts {
          grid-template-columns: 1fr 1.2fr;
          align-items: start;
        }
        
        .form-panel, .issues-resolver-panel {
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
        
        .tickets-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        
        .ticket-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .ticket-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        
        .ticket-header h4 {
          font-size: 0.95rem;
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
        
        .ticket-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        
        .ticket-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
          background: rgba(0,0,0,0.1);
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
        }
        
        .ticket-photo-link a {
          font-size: 0.8rem;
          color: var(--accent);
          text-decoration: underline;
        }
        
        .btn-resolve-ticket {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          align-self: flex-start;
        }
        
        .empty-tickets {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        
        .print-only {
          display: none;
        }
        
        /* Print Styles */
        @media print {
          body {
            background: #fff !important;
            color: #000 !important;
          }
          
          .print-hidden {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          .print-report-header {
            margin-bottom: 2rem;
            border-bottom: 2px solid #000;
            padding-bottom: 1rem;
          }
          
          .stats-row {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 1rem !important;
          }
          
          .stats-card {
            border: 1px solid #000 !important;
            box-shadow: none !important;
            background: none !important;
            color: #000 !important;
          }
          
          .stats-card h2, .stats-card .card-desc, .stats-card .card-tag {
            color: #000 !important;
          }
          
          .print-break {
            page-break-before: always;
          }
          
          .print-table-section {
            margin-top: 2rem;
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }
          
          .print-table th, .print-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            color: #000 !important;
          }
          
          .print-table th {
            background: #f2f2f2 !important;
          }
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
