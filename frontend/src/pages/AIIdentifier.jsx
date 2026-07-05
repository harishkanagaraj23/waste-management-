import React, { useState, useRef } from 'react';
import { Upload, ScanLine, FileCheck, HelpCircle, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AIIdentifier() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  // Pre-configured waste database for demo simulation
  const mockDatabase = {
    plastic_bottle: {
      name: "PET Plastic Drink Bottle",
      cipherForm: "PETE (Polyethylene Terephthalate #1)",
      category: "Recyclable (Dry Waste)",
      colorClass: "badge-dry",
      score: 95,
      suggestions: "Rinse out any remaining sweet liquids. Compress the bottle to save collection bin space. Dispose of it with the cap screwed on in the DRY / RECYCLABLE waste bin.",
      process: "Baled and sent to reclaiming mills, where they are washed, shredded into flakes, melted down, and extruded into recycled polyester fiber for textiles or new bottles."
    },
    soda_can: {
      name: "Aluminum Soda Can",
      cipherForm: "ALU (Aluminum Alloy 3104)",
      category: "Recyclable (Dry Waste)",
      colorClass: "badge-dry",
      score: 100,
      suggestions: "Empty completely. Crushing the can flat is highly recommended. Toss it directly into the DRY bin. Highly circular material.",
      process: "Melted in smelting furnaces to remove coatings. Re-cast into giant ingots and rolled out to make new aluminum beverage cans within just 60 days."
    },
    apple_core: {
      name: "Decaying Apple Core",
      cipherForm: "Lignocellulosic Biomass",
      category: "Organic (Wet Waste)",
      colorClass: "badge-wet",
      score: 10,
      suggestions: "Dispose of directly in your home compost heap or your green WET waste bin. Keep separate from plastics.",
      process: "Decomposes through aerobic digestion in soil compost piles, returning vital nitrogen, phosphorus, and organic carbon compounds back into local soils."
    },
    cardboard_box: {
      name: "Corrugated Cardboard Packing Box",
      cipherForm: "Unbleached Kraft Kraftliner",
      category: "Recyclable (Dry Waste)",
      colorClass: "badge-dry",
      score: 85,
      suggestions: "Flatten the box. Remove plastic tape and shipping invoice sleeves if possible. Make sure it stays dry; wet cardboard degrades fiber quality.",
      process: "Mixed with hot water in huge pulpers to separate paper fibers. Screened to remove inks/clays, then pressed and dried into large brown liner paper rolls."
    },
    rechargeable_battery: {
      name: "Lithium-Ion Rechargeable Battery",
      cipherForm: "Li-CoO2 (Lithium Cobalt Oxide)",
      category: "Hazardous Waste",
      colorClass: "badge-hazardous",
      score: 0,
      suggestions: "Do NOT place in standard household bins. Tape the battery terminals to prevent short-circuiting. Take it to a designated local E-Waste collection kiosk.",
      process: "Subjected to hydrometallurgical recycling, where it is crushed in protective gas, and chemical leaching is used to recover expensive cobalt, nickel, and lithium salts."
    },
    potato_chip_bag: {
      name: "Metallized Plastic Potato Chip Bag",
      cipherForm: "BOPP / LDPE Multi-layer Laminate",
      category: "Residual Waste",
      colorClass: "badge-mixed",
      score: 15,
      suggestions: "Cannot be cost-effectively recycled due to fused metal and plastic layers. Place in the residual waste trash bin.",
      process: "Typically routed to a sanitary landfill, or burned in clean Waste-to-Energy incinerators where heat is captured to drive electricity generation turbines."
    }
  };

  // Sample items to let users quickly try the features
  const demoSamples = [
    { key: 'plastic_bottle', label: 'Plastic Bottle', url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&auto=format&fit=crop&q=60' },
    { key: 'soda_can', label: 'Soda Can', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=60' },
    { key: 'apple_core', label: 'Apple Core', url: 'https://images.unsplash.com/photo-1568386178332-9cb77353f40d?w=400&auto=format&fit=crop&q=60' },
    { key: 'rechargeable_battery', label: 'Battery', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&auto=format&fit=crop&q=60' },
    { key: 'potato_chip_bag', label: 'Chip Packet', url: 'https://images.unsplash.com/photo-1518085157771-337c76891ebc?w=400&auto=format&fit=crop&q=60' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSelectSample = (sample) => {
    setSelectedImage(null);
    setImagePreview(sample.url);
    setResult(null);
    
    // Simulate reading mock data
    setTimeout(() => {
      triggerScan(sample.key);
    }, 100);
  };

  const triggerScan = (key = null) => {
    if (!imagePreview) return;
    setScanning(true);
    setResult(null);

    // Simulate AI scan process duration
    setTimeout(() => {
      setScanning(false);
      // Determine response logic
      let matchedKey = key;
      if (!matchedKey) {
        // Fallback random match if custom upload
        const keys = Object.keys(mockDatabase);
        matchedKey = keys[Math.floor(Math.random() * keys.length)];
      }
      setResult(mockDatabase[matchedKey]);
    }, 3000);
  };

  return (
    <div className="ai-container">
      <div className="page-header">
        <h1 className="page-title">AI Waste Identifier</h1>
        <p className="page-subtitle">Upload a photograph or snap a picture of trash to identify material composition and recyclability.</p>
      </div>

      <div className="grid-2 ai-layout">
        {/* Upload Panel */}
        <div className="upload-panel glass-panel">
          <div className="panel-title-row">
            <ScanLine className="panel-icon text-accent" />
            <h3>Image Upload & Recognition</h3>
          </div>

          <div 
            className="drop-zone"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="preview-container">
                <img src={imagePreview} alt="Trash Preview" className="img-preview" />
                {scanning && (
                  <>
                    <div className="scanner-line"></div>
                    <div className="scanning-overlay">Scanning Image...</div>
                  </>
                )}
              </div>
            ) : (
              <div className="drop-zone-prompt">
                <Upload size={48} className="upload-arrow text-muted" />
                <p className="primary-prompt">Drag & drop your waste image here, or <span>browse files</span></p>
                <p className="secondary-prompt">Supports JPG, PNG, WebP up to 5MB</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden-file-input"
            />
          </div>

          <div className="actions-row">
            <button 
              className="btn btn-primary btn-scan"
              onClick={() => triggerScan()}
              disabled={!imagePreview || scanning}
            >
              <ScanLine size={18} />
              <span>{scanning ? 'Analyzing Frame...' : 'Start AI Analysis'}</span>
            </button>
            
            {imagePreview && (
              <button 
                className="btn btn-secondary btn-clear"
                onClick={() => {
                  setImagePreview(null);
                  setSelectedImage(null);
                  setResult(null);
                }}
                disabled={scanning}
              >
                <RefreshCw size={16} />
              </button>
            )}
          </div>

          {/* Quick Demo Selector */}
          <div className="demo-selector-box">
            <h4>Select Sample Image (Quick Test)</h4>
            <div className="samples-grid">
              {demoSamples.map((sample, idx) => (
                <button 
                  key={idx} 
                  className="sample-thumb-btn" 
                  onClick={() => handleSelectSample(sample)}
                  disabled={scanning}
                >
                  <img src={sample.url} alt={sample.label} />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="results-panel glass-panel">
          <div className="panel-title-row">
            <FileCheck className="panel-icon text-accent" />
            <h3>AI Identification Analysis</h3>
          </div>

          {scanning && (
            <div className="scan-placeholder animate-pulse">
              <div className="spinner-glow"></div>
              <h4>Analyzing Material Matrix...</h4>
              <p>Extracting color spectrum, edge geometries, and texture tags.</p>
            </div>
          )}

          {!scanning && !result && (
            <div className="empty-results">
              <HelpCircle size={48} className="empty-icon text-muted" />
              <h4>Awaiting Image Analysis</h4>
              <p>Upload a custom file or select a sample image on the left, then click "Start AI Analysis" to view recyclability data.</p>
            </div>
          )}

          {!scanning && result && (
            <div className="results-content">
              <div className="result-header-row">
                <div>
                  <span className={`badge ${result.colorClass}`}>{result.category}</span>
                  <h2>{result.name}</h2>
                </div>
                
                <div className="score-circle-wrapper" title="Recyclability Score">
                  <div className="score-circle-inner" style={{
                    background: `conic-gradient(var(--primary) ${result.score}%, rgba(255,255,255,0.05) ${result.score}% 100%)`
                  }}>
                    <div className="score-number-box">
                      <span>{result.score}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="results-data-grid">
                <div className="data-row">
                  <span className="row-label">Material Cipher Form:</span>
                  <span className="row-val font-mono">{result.cipherForm}</span>
                </div>
                
                <div className="data-row">
                  <span className="row-label">General Recyclability:</span>
                  <span className={`row-val font-semibold ${result.score > 50 ? 'text-primary' : 'text-danger'}`}>
                    {result.score >= 80 ? 'Highly Recyclable' : result.score >= 50 ? 'Partially Recyclable' : 'Non-Recyclable'}
                  </span>
                </div>
              </div>

              <div className="result-block advice-block">
                <h4><CheckCircle2 size={16} className="block-icon text-primary" /> Segregation Instruction</h4>
                <p>{result.suggestions}</p>
              </div>

              <div className="result-block process-block">
                <h4><ScanLine size={16} className="block-icon text-accent" /> Recycling Recovery Process</h4>
                <p>{result.process}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .ai-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .ai-layout {
          align-items: stretch;
        }
        
        .upload-panel, .results-panel {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .panel-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 1rem;
        }
        
        .panel-icon {
          color: var(--primary);
        }
        
        .panel-title-row h3 {
          font-size: 1.25rem;
          color: var(--text-primary);
        }
        
        .drop-zone {
          border: 2px dashed var(--border-glass);
          border-radius: var(--radius-md);
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: rgba(0, 0, 0, 0.1);
          overflow: hidden;
          position: relative;
          transition: all var(--transition-normal);
        }
        
        .drop-zone:hover {
          border-color: var(--border-glass-active);
          background: rgba(16, 185, 129, 0.01);
        }
        
        .drop-zone-prompt {
          text-align: center;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .upload-arrow {
          margin-bottom: 0.5rem;
          transition: transform var(--transition-normal);
        }
        
        .drop-zone:hover .upload-arrow {
          transform: translateY(-4px);
          color: var(--primary);
        }
        
        .primary-prompt {
          font-size: 0.95rem;
          color: var(--text-primary);
          font-weight: 500;
        }
        
        .primary-prompt span {
          color: var(--primary);
          text-decoration: underline;
        }
        
        .secondary-prompt {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .preview-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .img-preview {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .scanner-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, transparent, var(--primary), transparent);
          box-shadow: 0 0 12px 2px var(--primary);
          animation: scan-radar 2.5s infinite linear;
          z-index: 5;
        }
        
        .scanning-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--primary);
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
        }
        
        .hidden-file-input {
          display: none;
        }
        
        .actions-row {
          display: flex;
          gap: 0.75rem;
        }
        
        .btn-scan {
          flex: 1;
        }
        
        .btn-clear {
          padding: 0 1rem;
        }
        
        .demo-selector-box h4 {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }
        
        .samples-grid {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }
        
        .sample-thumb-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          padding: 0.4rem;
          cursor: pointer;
          flex-shrink: 0;
          width: 80px;
          transition: all var(--transition-fast);
        }
        
        .sample-thumb-btn img {
          width: 100%;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .sample-thumb-btn span {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        
        .sample-thumb-btn:hover {
          border-color: var(--border-glass-active);
          background: rgba(16, 185, 129, 0.05);
        }
        
        .empty-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          padding: 2rem;
          color: var(--text-secondary);
          gap: 0.75rem;
        }
        
        .empty-icon {
          color: var(--text-muted);
        }
        
        .scan-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          gap: 0.75rem;
        }
        
        .spinner-glow {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(16, 185, 129, 0.1);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin-slow 1s infinite linear, scan-glow 1.5s infinite ease-in-out;
        }
        
        .results-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .result-header-row {
          display: flex;
          justify-content: space-between;
          align-items: start;
        }
        
        .result-header-row h2 {
          font-size: 1.6rem;
          margin-top: 0.5rem;
          color: var(--text-primary);
        }
        
        .score-circle-wrapper {
          position: relative;
        }
        
        .score-circle-inner {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow);
        }
        
        .score-number-box {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--text-primary);
        }
        
        .results-data-grid {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .data-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
        }
        
        .row-label {
          color: var(--text-secondary);
        }
        
        .row-val {
          color: var(--text-primary);
        }
        
        .font-mono {
          font-family: monospace;
          font-size: 0.85rem;
          background: rgba(255,255,255,0.03);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }
        
        .result-block {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
        }
        
        .result-block h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .block-icon {
          flex-shrink: 0;
        }
        
        .result-block p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        
        .advice-block {
          border-left: 3px solid var(--primary);
        }
        
        .process-block {
          border-left: 3px solid var(--accent);
        }
      `}</style>
    </div>
  );
}
