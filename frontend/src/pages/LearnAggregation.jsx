import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Apple, HelpCircle, AlertOctagon, Trash, ChevronRight, Recycle, ArrowRight } from 'lucide-react';

export default function LearnAggregation() {
  const [activeTab, setActiveTab] = useState('organic');
  
  const wasteCategories = {
    organic: {
      title: "Organic Waste (Wet Waste)",
      icon: <Apple size={24} className="text-accent-blue" />,
      color: "badge-wet",
      description: "Biodegradable materials that can be broken down naturally by microorganisms. Primarily kitchen scraps, horticultural materials, and animal wastes.",
      examples: [
        "Food scraps (vegetable peels, leftover meals, fruit skins)",
        "Garden waste (leaves, grass cuttings, small branches, weeds)",
        "Eggshells, tea bags, and coffee grounds",
        "Soiled cardboard/paper towels (uncoated)"
      ],
      decompositionTime: "2 to 6 weeks (in composting setups)",
      disposalMethods: [
        "Home/Community Composting: Turn food scraps into rich humus soil conditioner.",
        "Biogas Plants: Anaerobic digestion generates methane gas for green power and organic slurry fertilizer."
      ],
      warnings: "Do not mix with plastic bags, dairy items, or meats in open piles as they attract vermin and generate odor."
    },
    recyclable: {
      title: "Recyclable Waste (Dry Waste)",
      icon: <Recycle size={24} className="text-accent-green" />,
      color: "badge-dry",
      description: "Non-biodegradable items that can be collected, processed, and remanufactured into brand new raw materials or products.",
      examples: [
        "Paper & Cardboard (newspapers, booklets, dry packages)",
        "Plastic containers (PET drink bottles, HDPE milk jars, containers)",
        "Glass bottles and jars (transparent, green, amber)",
        "Metal cans (aluminum beverage tins, steel food cans, tin foil)"
      ],
      decompositionTime: "Plastic: 450 years | Aluminum: 200 years | Glass: Undetermined",
      disposalMethods: [
        "Curbside Recycling: Sort dry waste separately so municipal trucks route it to processing centers.",
        "Material Recovery Facilities: Industrial sorting lines separate plastics by code, crush metals, and wash glass."
      ],
      warnings: "Rinse food residues out of plastic/glass jars before recycling. Wet or grease-stained paper cannot be recycled."
    },
    hazardous: {
      title: "Hazardous Waste",
      icon: <AlertOctagon size={24} className="text-accent-red" />,
      color: "badge-hazardous",
      description: "Substances that present direct threats to human health or ecosystems due to corrosive, reactive, toxic, or flammable properties.",
      examples: [
        "Batteries (lead-acid, lithium-ion, alkaline cells)",
        "Chemical agents (insecticides, oil-paints, strong acids, cleaning fluids)",
        "Electronic waste (old smartphones, cables, monitors, light bulbs)",
        "Medical items (expired pills, syringes, contaminated bandages)"
      ],
      decompositionTime: "Non-degradable (toxic chemicals persist in soil indefinitely)",
      disposalMethods: [
        "Hazardous Collection Depots: Drop off hazardous components at designated local government recovery drives.",
        "Neutralization and Containment: Secure encapsulation inside concrete lined high-tech landfill bins."
      ],
      warnings: "NEVER dispose of batteries or electronic devices in standard household garbage bins. They leak heavy metals and can ignite fires."
    },
    residual: {
      title: "Residual Waste",
      icon: <Trash size={24} className="text-accent-yellow" />,
      color: "badge-mixed",
      description: "Non-hazardous, non-recyclable materials left over after sorting organic wastes and clean dry recyclables. Often sent directly to landfills.",
      examples: [
        "Sanitary waste (diapers, napkins, medical masks, wet wipes)",
        "Multi-layered packaging (potato chip packets, laminated plastics)",
        "Ceramic items, mirror shards, and heavy ash",
        "Very small scraps of plastic, styrofoam, and dust"
      ],
      decompositionTime: "100 to 500+ years",
      disposalMethods: [
        "Sanitary Landfill: Laid out in compacted clay-lined cells fitted with gas/liquid collection piping.",
        "Waste-to-Energy Incinerators: High-temperature burn zones convert solid waste volume into steam electricity."
      ],
      warnings: "Maximize segregation to minimize residual waste, as landfill capacity is highly limited and expensive."
    }
  };

  const currentTab = wasteCategories[activeTab];

  return (
    <div className="learn-container">
      <div className="page-header">
        <h1 className="page-title">Waste Segregation Guide</h1>
        <p className="page-subtitle">Learn about different waste classifications, decomposition stats, and appropriate disposal pathways.</p>
      </div>

      <div className="learn-layout">
        {/* Tab Buttons (Left on Desktop, Top on Mobile) */}
        <div className="tabs-sidebar glass-panel">
          <button 
            className={`tab-btn ${activeTab === 'organic' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('organic')}
          >
            <Apple size={20} />
            <span>Organic Waste</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'recyclable' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('recyclable')}
          >
            <Recycle size={20} />
            <span>Recyclable Waste</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'hazardous' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('hazardous')}
          >
            <AlertOctagon size={20} />
            <span>Hazardous Waste</span>
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'residual' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('residual')}
          >
            <Trash size={20} />
            <span>Residual Waste</span>
          </button>
        </div>

        {/* Tab Details (Right side) */}
        <div className="tab-content-panel glass-panel">
          <div className="content-header">
            <div className={`tab-icon-badge ${currentTab.color}`}>
              {currentTab.icon}
            </div>
            <h2>{currentTab.title}</h2>
          </div>
          
          <p className="tab-description">{currentTab.description}</p>
          
          <div className="content-grid">
            <div className="examples-section">
              <h3>Common Examples</h3>
              <ul className="bullet-list">
                {currentTab.examples.map((item, idx) => (
                  <li key={idx}><ChevronRight size={14} className="list-arrow" /> {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="disposal-section">
              <div className="stat-block">
                <h4>Decomposition Estimate</h4>
                <p>{currentTab.decompositionTime}</p>
              </div>

              <div className="stat-block">
                <h4>Disposal Solutions</h4>
                <ul className="numbered-list">
                  {currentTab.disposalMethods.map((method, idx) => (
                    <li key={idx}><strong>{idx + 1}.</strong> {method}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="warning-panel">
            <HelpCircle size={18} className="warn-icon" />
            <p><strong>Important Warning:</strong> {currentTab.warnings}</p>
          </div>
        </div>
      </div>

      {/* Quick Action Links Section */}
      <section className="quick-links-section glass-panel">
        <h3>Ready to take action? Utilize our digital utilities</h3>
        <p>Explore tools to identify waste items or find a sorting center nearby.</p>
        <div className="quick-links-grid">
          <Link to="/ai-identifier" className="quick-link-card">
            <h4>Run AI Identifier</h4>
            <p>Scan waste items with your camera or uploads to detect recyclability tags instantly.</p>
            <span className="arrow-btn"><ArrowRight size={18} /></span>
          </Link>

          <Link to="/centers" className="quick-link-card">
            <h4>Find Disposal Hubs</h4>
            <p>Locate sorting bins, e-waste drop-points, and compost sites on our interactive map.</p>
            <span className="arrow-btn"><ArrowRight size={18} /></span>
          </Link>
        </div>
      </section>

      <style>{`
        .learn-container {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        
        .learn-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          align-items: start;
        }
        
        .tabs-sidebar {
          display: flex;
          flex-direction: column;
          padding: 1rem;
          gap: 0.5rem;
        }
        
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
        }
        
        .active-tab {
          background: rgba(16, 185, 129, 0.1) !important;
          border-left: 3px solid var(--primary);
          color: var(--accent) !important;
        }
        
        .tab-content-panel {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .content-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .tab-icon-badge {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .tab-description {
          font-size: 1.05rem;
          color: var(--text-secondary);
          border-left: 2px solid var(--border-glass-active);
          padding-left: 1rem;
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          margin-top: 1rem;
        }
        
        .examples-section h3, .disposal-section h3 {
          font-size: 1.15rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }
        
        .bullet-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .bullet-list li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        
        .list-arrow {
          color: var(--primary);
          flex-shrink: 0;
        }
        
        .stat-block {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          padding: 1rem;
          margin-bottom: 1.25rem;
        }
        
        .stat-block h4 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        
        .stat-block p {
          font-size: 1rem;
          font-weight: 600;
          color: var(--accent);
        }
        
        .numbered-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .numbered-list li {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .warning-panel {
          background: rgba(239, 68, 68, 0.05);
          border: 1px dashed rgba(239, 68, 68, 0.2);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-sm);
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          font-size: 0.9rem;
        }
        
        .warn-icon {
          color: var(--accent-red);
          margin-top: 0.15rem;
          flex-shrink: 0;
        }
        
        .quick-links-section {
          padding: 2.5rem;
          text-align: center;
          background: linear-gradient(135deg, rgba(24, 37, 32, 0.4) 0%, rgba(10, 15, 13, 0.6) 100%);
        }
        
        .quick-links-section h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .quick-links-section p {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }
        
        .quick-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          text-align: left;
        }
        
        .quick-link-card {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-glass);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: relative;
          transition: all var(--transition-normal);
        }
        
        .quick-link-card:hover {
          border-color: var(--border-glass-active);
          transform: translateY(-2px);
          background: rgba(16, 185, 129, 0.02);
        }
        
        .quick-link-card h4 {
          font-size: 1.15rem;
          color: var(--accent);
        }
        
        .quick-link-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0;
          max-width: 85%;
        }
        
        .arrow-btn {
          position: absolute;
          right: 1.5rem;
          bottom: 1.5rem;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        
        .quick-link-card:hover .arrow-btn {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
        }
        
        @media (max-width: 768px) {
          .learn-layout {
            grid-template-columns: 1fr;
          }
          
          .tabs-sidebar {
            flex-direction: row;
            overflow-x: auto;
            white-space: nowrap;
          }
          
          .tab-btn {
            padding: 0.6rem 1rem;
          }
          
          .content-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .quick-links-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
