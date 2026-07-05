import React, { useState } from 'react';
import { Search, MapPin, Phone, Clock, Filter, Compass, Navigation } from 'lucide-react';

export default function FindCenters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCenterId, setSelectedCenterId] = useState(1);

  // Disposal centers dataset
  const centers = [
    {
      id: 1,
      name: "Metro Recyclables Recovery Hub",
      type: "recyclable",
      distance: "1.2 km",
      address: "Plot 42, Okhla Industrial Area Phase-III, New Delhi",
      phone: "+91 11 4056 7890",
      hours: "09:00 AM - 07:00 PM",
      status: "Open Now",
      accepts: ["Plastics", "Cardboard", "Metal Cans", "Glass Jars"],
      coords: { x: 120, y: 150 },
      routeTip: "Head south on Outer Ring Road, take exit 12. Turn left near Metro Station."
    },
    {
      id: 2,
      name: "Delhi Central Organic Composting Site",
      type: "organic",
      distance: "2.4 km",
      address: "Sector 6, Pushp Vihar, Saket, New Delhi",
      phone: "+91 99100 23456",
      hours: "07:00 AM - 04:00 PM",
      status: "Open Now",
      accepts: ["Kitchen Waste", "Fruit Peels", "Leaves & Twigs", "Flowers"],
      coords: { x: 340, y: 80 },
      routeTip: "Follow Press Enclave Marg. Composting bins located at the back of Municipal Office."
    },
    {
      id: 3,
      name: "GreenE-Waste Recycling Solutions",
      type: "hazardous",
      distance: "4.8 km",
      address: "B-108, Mayapuri Industrial Area Phase-I, New Delhi",
      phone: "+91 1800 123 9999",
      hours: "10:00 AM - 06:00 PM",
      status: "Open Now",
      accepts: ["Mobile Phones", "Lead Batteries", "Copper Wires", "Fluorescent Bulbs"],
      coords: { x: 200, y: 280 },
      routeTip: "Located near Mayapuri Flyover. Drop-off station has drive-thru lanes."
    },
    {
      id: 4,
      name: "City Hospital Bio-Hazardous Depot",
      type: "hazardous",
      distance: "6.1 km",
      address: "Ansari Nagar, AIIMS Compound, New Delhi",
      phone: "+91 11 2658 8500",
      hours: "24 Hours Open",
      status: "Open 24/7",
      accepts: ["Syringes", "Expired Medicines", "Infusion Bottles", "Clinical Waste"],
      coords: { x: 450, y: 220 },
      routeTip: "Enter from AIIMS Gate No. 2. Follow medical waste signages to the waste vault."
    },
    {
      id: 5,
      name: "East Delhi Secondary Material Recovery Facility",
      type: "recyclable",
      distance: "7.5 km",
      address: "Sanjay Lake Bypass, Patparganj, New Delhi",
      phone: "+91 11 2275 1234",
      hours: "09:00 AM - 05:30 PM",
      status: "Closes in 2 Hours",
      accepts: ["Corrugated Sheets", "PET Containers", "Shredded Papers", "Tin Foils"],
      coords: { x: 280, y: 190 },
      routeTip: "Exit Noida Link Road near Sanjay Lake Park. Large green gates are visible."
    }
  ];

  // Filtering Logic
  const filteredCenters = centers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  const selectedCenter = centers.find(c => c.id === selectedCenterId) || centers[0];

  return (
    <div className="centers-container">
      <div className="page-header">
        <h1 className="page-title">Find Disposal Centers</h1>
        <p className="page-subtitle">Locate municipal waste recovery centers, organic dump sites, and hazardous drop stations near you.</p>
      </div>

      <div className="grid-2 centers-layout">
        {/* Centers Search & List */}
        <div className="list-panel glass-panel">
          <div className="search-filter-box">
            <div className="search-bar-inner">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search by center name or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-row">
              <Filter size={16} className="filter-label-icon" />
              <button 
                className={`filter-btn ${filterType === 'all' ? 'active-filter' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filterType === 'organic' ? 'active-filter' : ''}`}
                onClick={() => setFilterType('organic')}
              >
                Organic
              </button>
              <button 
                className={`filter-btn ${filterType === 'recyclable' ? 'active-filter' : ''}`}
                onClick={() => setFilterType('recyclable')}
              >
                Recyclable
              </button>
              <button 
                className={`filter-btn ${filterType === 'hazardous' ? 'active-filter' : ''}`}
                onClick={() => setFilterType('hazardous')}
              >
                Hazardous
              </button>
            </div>
          </div>

          <div className="centers-list">
            {filteredCenters.length === 0 ? (
              <div className="empty-list">No disposal centers found matching filters.</div>
            ) : (
              filteredCenters.map(c => (
                <div 
                  key={c.id} 
                  className={`center-card glass-card ${selectedCenterId === c.id ? 'active-center' : ''}`}
                  onClick={() => setSelectedCenterId(c.id)}
                >
                  <div className="card-header-row">
                    <span className={`badge badge-${c.type}`}>{c.type}</span>
                    <span className="distance-tag">{c.distance}</span>
                  </div>
                  <h3>{c.name}</h3>
                  <p className="card-address"><MapPin size={14} /> {c.address.substring(0, 45)}...</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map Simulator Panel */}
        <div className="map-panel glass-panel">
          <div className="map-wrapper">
            {/* Custom SVG Simulated Map */}
            <svg viewBox="0 0 600 400" className="simulated-map-svg">
              {/* Map grid lines */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="600" height="400" fill="url(#grid)" />
              
              {/* Roads */}
              <path d="M 50 100 Q 250 80 550 120" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
              <path d="M 200 0 L 200 400" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <path d="M 0 250 C 150 250 300 150 600 200" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeDasharray="5,5" />
              <path d="M 400 0 C 350 150 400 300 450 400" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />

              {/* Water body */}
              <path d="M 0 50 Q 150 120 300 20 T 600 60" fill="none" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="24" />

              {/* Grid block labels */}
              <text x="70" y="40" fill="rgba(255,255,255,0.15)" fontSize="10">Connaught Zone</text>
              <text x="420" y="360" fill="rgba(255,255,255,0.15)" fontSize="10">Okhla Sector</text>

              {/* Route line to selected center */}
              {selectedCenter && (
                <path 
                  d={`M 150 200 L ${selectedCenter.coords.x} ${selectedCenter.coords.y}`} 
                  fill="none" 
                  stroke="var(--primary)" 
                  strokeWidth="3" 
                  strokeDasharray="6,4"
                  className="route-path-animation"
                />
              )}

              {/* Current User Marker */}
              <g transform="translate(150, 200)">
                <circle r="16" fill="rgba(16, 185, 129, 0.2)" className="pulse-circle" />
                <circle r="6" fill="var(--primary)" />
                <text y="-10" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">You</text>
              </g>

              {/* Center Markers */}
              {filteredCenters.map(c => {
                const isSelected = selectedCenterId === c.id;
                return (
                  <g 
                    key={c.id} 
                    transform={`translate(${c.coords.x}, ${c.coords.y})`}
                    onClick={() => setSelectedCenterId(c.id)}
                    className="map-marker-group"
                  >
                    {isSelected ? (
                      <>
                        <circle r="18" fill="rgba(52, 211, 153, 0.25)" className="pulse-circle-fast" />
                        <circle r="8" fill="var(--accent)" stroke="#fff" strokeWidth="2" />
                      </>
                    ) : (
                      <circle r="7" fill={c.type === 'organic' ? 'var(--accent-blue)' : c.type === 'recyclable' ? 'var(--primary)' : 'var(--accent-red)'} opacity="0.7" />
                    )}
                    <text y="18" textAnchor="middle" fill={isSelected ? '#fff' : 'var(--text-secondary)'} fontSize="8" fontWeight={isSelected ? '700' : '500'}>
                      {c.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Details Overlay */}
          {selectedCenter && (
            <div className="map-detail-card">
              <div className="detail-header">
                <h3>{selectedCenter.name}</h3>
                <span className="badge-distance"><Compass size={14} /> {selectedCenter.distance} away</span>
              </div>
              
              <div className="detail-grid">
                <div className="detail-item">
                  <MapPin size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Address</span>
                    <p>{selectedCenter.address}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <Clock size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Operational Hours</span>
                    <p>{selectedCenter.hours} <span className="status-label">{selectedCenter.status}</span></p>
                  </div>
                </div>

                <div className="detail-item">
                  <Phone size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Contact</span>
                    <p>{selectedCenter.phone}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <Navigation size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Route Advice</span>
                    <p>{selectedCenter.routeTip}</p>
                  </div>
                </div>
              </div>

              <div className="detail-accepts-box">
                <span className="accepts-label">Accepts materials:</span>
                <div className="tags-row">
                  {selectedCenter.accepts.map((tag, idx) => (
                    <span key={idx} className="material-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .centers-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .centers-layout {
          grid-template-columns: 380px 1fr;
          align-items: stretch;
        }
        
        .list-panel {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-height: 600px;
          overflow-y: auto;
        }
        
        .search-bar-inner {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }
        
        .search-input {
          width: 100%;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          color: var(--text-primary);
          font-size: 0.95rem;
        }
        
        .search-input:focus {
          outline: none;
          border-color: var(--primary);
        }
        
        .filter-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .filter-label-icon {
          color: var(--text-muted);
          margin-right: 0.25rem;
        }
        
        .filter-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          padding: 0.35rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        
        .filter-btn:hover {
          color: var(--text-primary);
          border-color: var(--text-muted);
        }
        
        .active-filter {
          background: var(--primary);
          color: #fff !important;
          border-color: var(--primary) !important;
        }
        
        .centers-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          overflow-y: auto;
        }
        
        .center-card {
          cursor: pointer;
          padding: 1.25rem;
        }
        
        .card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .distance-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent);
        }
        
        .center-card h3 {
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
        }
        
        .card-address {
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        
        .active-center {
          border-color: var(--border-glass-active);
          background: rgba(16, 185, 129, 0.05);
          box-shadow: var(--shadow-primary-glow);
        }
        
        .map-panel {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .map-wrapper {
          background: rgba(0,0,0,0.3);
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-glass);
          position: relative;
        }
        
        .simulated-map-svg {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .map-marker-group {
          cursor: pointer;
        }
        
        .pulse-circle {
          animation: pulse-green 2s infinite ease-out;
          transform-origin: center;
        }
        
        @keyframes pulse-fast {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .pulse-circle-fast {
          animation: pulse-fast 1.5s infinite ease-out;
          transform-origin: center;
        }
        
        .route-path-animation {
          stroke-dasharray: 8;
          animation: dash 30s linear infinite;
        }
        
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
        
        .map-detail-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 1.5rem;
        }
        
        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 0.75rem;
        }
        
        .detail-header h3 {
          font-size: 1.2rem;
          color: var(--text-primary);
        }
        
        .badge-distance {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(16,185,129,0.1);
          color: var(--accent);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }
        
        .detail-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }
        
        .detail-icon {
          color: var(--primary);
          margin-top: 0.15rem;
          flex-shrink: 0;
        }
        
        .detail-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .detail-item p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        
        .status-label {
          color: var(--primary);
          font-weight: 600;
          font-size: 0.75rem;
          margin-left: 0.5rem;
        }
        
        .detail-accepts-box {
          border-top: 1px solid var(--border-glass);
          padding-top: 1rem;
        }
        
        .accepts-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          display: block;
        }
        
        .tags-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .material-tag {
          font-size: 0.75rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-glass);
          color: var(--text-secondary);
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
        }
        
        @media (max-width: 992px) {
          .centers-layout {
            grid-template-columns: 1fr;
          }
          
          .list-panel {
            max-height: 350px;
          }
        }
      `}</style>
    </div>
  );
}
