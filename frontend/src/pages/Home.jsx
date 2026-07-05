import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Recycle, ScanLine, Info, AlertTriangle, ShieldCheck, 
  Wind, Droplets, Landmark, ShieldAlert, ThermometerSun, HeartPulse, Compass 
} from 'lucide-react';

export default function Home() {
  const consequences = [
    {
      icon: <Wind size={24} className="text-accent-yellow" />,
      title: "Air Pollution",
      desc: "Decomposing garbage releases methane, nitrous oxide, and toxic particles. Burning trash releases carcinogenic dioxins, contributing to smog and asthma."
    },
    {
      icon: <Droplets size={24} className="text-accent-blue" />,
      title: "Water Pollution",
      desc: "Rain washes toxic liquids (leachate) from landfills into rivers and groundwater, contaminating drinking water sources and toxicifying aquatic biosystems."
    },
    {
      icon: <Compass size={24} className="text-accent-red" />,
      title: "Soil & Land Damage",
      desc: "Hazardous chemicals soak into the soil, killing off vital microorganisms. This reduces agricultural fertility, impacts plant health, and ruins land usability."
    },
    {
      icon: <ThermometerSun size={24} className="text-accent-yellow" />,
      title: "Global Warming",
      desc: "Organic waste rotting in landfills produces methane, which is 25 times more potent than carbon dioxide at trapping heat in the Earth's atmosphere."
    },
    {
      icon: <HeartPulse size={24} className="text-accent-red" />,
      title: "Public Health Issues",
      desc: "Uncollected trash attracts rodents and insects that carry dengue, malaria, and cholera. Exposure to electronic/chemical waste leads to chronic toxicity."
    },
    {
      icon: <ShieldAlert size={24} className="text-accent-blue" />,
      title: "Marine Life Threat",
      desc: "Around 8 million tons of plastic waste enters oceans yearly. Sea turtles and birds mistake plastic for food, causing suffocation, poisoning, and death."
    },
    {
      icon: <Landmark size={24} className="text-accent-yellow" />,
      title: "Economic Impact",
      desc: "Local governments spend millions of dollars annually cleaning up municipal dumps. Tourism drops in highly polluted areas, harming local livelihoods."
    }
  ];

  const solutions = [
    {
      title: "Source Segregation",
      desc: "Separating waste at the point of origin into wet (biodegradable), dry (recyclable), and hazardous categories. This prevents contamination and boosts recycling rates."
    },
    {
      title: "Composting & Bio-Gas Generation",
      desc: "Converting organic waste (food leftovers, garden trimmings) into organic fertilizers via aerobic composting, or trapping bio-gas to generate clean energy."
    },
    {
      title: "Extended Producer Responsibility",
      desc: "Holding companies and manufacturers financially and logistically responsible for gathering, recycling, and disposing of their packaging and e-waste."
    },
    {
      title: "Waste-to-Energy (WTE)",
      desc: "Using modern combustion technologies that incinerate residual non-recyclable materials at high temperatures, creating steam to drive electric generators."
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section glass-panel">
        <div className="hero-content">
          <span className="hero-tagline"><Recycle size={16} /> Eco-Friendly Waste Management Portal</span>
          <h1>Smart Waste Segregation <br /><span className="text-highlight">For A Healthier Planet</span></h1>
          <p className="hero-desc">
            An advanced platform designed for citizens, local authorities, and waste inspectors to monitor waste disposal, track compliance, and utilize AI classification to sort waste.
          </p>
          <div className="hero-actions">
            <Link to="/ai-identifier" className="btn btn-primary">
              <ScanLine size={18} />
              <span>Try AI Identifier</span>
            </Link>
            <Link to="/learn" className="btn btn-secondary">
              <Info size={18} />
              <span>Learn Aggregation</span>
            </Link>
          </div>
        </div>
        <div className="hero-graphics">
          <div className="graphics-circle">
            <Recycle size={120} className="rotating-icon" />
          </div>
        </div>
      </section>

      {/* Industrial Waste Overview */}
      <section className="info-section">
        <h2 className="section-title">Waste in the Industry</h2>
        <p className="section-subtitle">Understanding what kind of waste industries generate and how they should be managed</p>
        
        <div className="grid-2">
          <div className="glass-card info-card">
            <h3>Manufacturing & Processing Waste</h3>
            <p>
              Factories produce huge volumes of scrap metal, packaging, chemical effluents, and residual slag. If unmanaged, these materials cause toxic pollution.
            </p>
            <div className="disposal-method">
              <strong>Recommended Disposal:</strong> Materials must undergo neutralization, solvent extraction, and controlled thermal treatment prior to discharge.
            </div>
          </div>

          <div className="glass-card info-card">
            <h3>Electronic & Hazardous Waste</h3>
            <p>
              Circuit boards, batteries, mercury switches, and machinery oil. They contain heavy metals (lead, cadmium, mercury) that poison food chains.
            </p>
            <div className="disposal-method">
              <strong>Recommended Disposal:</strong> Handed over to licensed e-waste recyclers who extract precious metals safely under vacuum hoods.
            </div>
          </div>
        </div>
      </section>

      {/* Consequences Section */}
      <section id="consequences" className="consequences-section">
        <h2 className="section-title">Consequences of Poor Waste Management</h2>
        <p className="section-subtitle">The severe impact of unsorted and neglected trash on our ecosystem and lives</p>
        
        <div className="grid-3">
          {consequences.map((c, i) => (
            <div key={i} className="glass-card consequence-card">
              <div className="consequence-icon-wrapper">
                {c.icon}
              </div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="solutions-section glass-panel">
        <div className="solutions-inner">
          <div className="solutions-header">
            <ShieldCheck size={40} className="solutions-shield" />
            <h2>Sustainable Management Solutions</h2>
            <p>How we can work together to handle urban waste responsibly</p>
          </div>
          
          <div className="grid-2 solutions-grid">
            {solutions.map((s, i) => (
              <div key={i} className="solution-item">
                <span className="solution-number">0{i+1}</span>
                <div className="solution-text">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }
        
        .hero-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4rem;
          background: linear-gradient(135deg, rgba(24, 37, 32, 0.7) 0%, rgba(10, 15, 13, 0.9) 100%);
          border-color: rgba(16, 185, 129, 0.15);
          gap: 2rem;
          margin-top: 1rem;
        }
        
        .hero-content {
          max-width: 60%;
        }
        
        .hero-tagline {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        
        .hero-content h1 {
          font-size: 3.2rem;
          line-height: 1.15;
          margin-bottom: 1.5rem;
        }
        
        .text-highlight {
          background: linear-gradient(135deg, var(--accent) 0%, #6ee7b7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .hero-desc {
          font-size: 1.15rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .hero-actions {
          display: flex;
          gap: 1rem;
        }
        
        .hero-graphics {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
        }
        
        .graphics-circle {
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed rgba(16, 185, 129, 0.25);
          position: relative;
        }
        
        .rotating-icon {
          color: var(--primary);
          opacity: 0.85;
          filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.3));
          animation: spin-slow 25s linear infinite;
        }
        
        .section-title {
          font-size: 2rem;
          text-align: center;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #ffffff, var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .section-subtitle {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 3rem;
        }
        
        .info-card {
          padding: 2rem;
        }
        
        .info-card h3 {
          font-size: 1.25rem;
          color: var(--accent);
          margin-bottom: 1rem;
        }
        
        .disposal-method {
          margin-top: 1.5rem;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.2);
          border-left: 3px solid var(--primary);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          font-size: 0.9rem;
        }
        
        .consequence-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }
        
        .consequence-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .consequence-card h3 {
          font-size: 1.15rem;
          color: var(--text-primary);
        }
        
        .consequence-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .solutions-section {
          padding: 4rem;
          background: rgba(16, 185, 129, 0.02);
          border-color: rgba(16, 185, 129, 0.1);
        }
        
        .solutions-inner {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        
        .solutions-header {
          text-align: center;
        }
        
        .solutions-shield {
          color: var(--primary);
          margin-bottom: 0.75rem;
        }
        
        .solutions-header h2 {
          font-size: 2rem;
        }
        
        .solutions-header p {
          color: var(--text-secondary);
        }
        
        .solutions-grid {
          gap: 3rem;
        }
        
        .solution-item {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }
        
        .solution-number {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
          opacity: 0.5;
          line-height: 1;
        }
        
        .solution-text h3 {
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .solution-text p {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 992px) {
          .hero-section {
            flex-direction: column-reverse;
            padding: 3rem 2rem;
            text-align: center;
          }
          
          .hero-content {
            max-width: 100%;
          }
          
          .hero-tagline, .hero-actions {
            justify-content: center;
          }
          
          .hero-content h1 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}
