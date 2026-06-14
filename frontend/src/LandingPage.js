import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Animated Counter ──────────────────────────────────────────────────────────
function Counter({ target, suffix = '', decimals = 0 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 80;
    const increment = target / steps;
    const t = setInterval(() => {
      start += increment;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(start);
    }, 18);
    return () => clearInterval(t);
  }, [target]);
  return <>{decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString()}{suffix}</>;
}

// ── OpenStreetMap World Embed (free, no API key) ───────────────────────────────
function GlobalMap({ height = 480 }) {
  // World-view OSM embed centered on major shipping lanes — no API key needed
  const src = 'https://www.openstreetmap.org/export/embed.html?bbox=-160,-45,170,65&layer=mapnik';
  return (
    <div className="map-embed-wrapper" style={{ height, position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
      <iframe
        title="Global Logistics Network"
        src={src}
        loading="lazy"
        style={{
          width: '100%', height: '100%', border: 'none',
          filter: 'saturate(0.6) contrast(1.1) brightness(0.75) hue-rotate(175deg)'
        }}
      />
      {/* Overlay branding */}
      <div style={{
        position: 'absolute', top: 16, left: 16,
        background: 'rgba(6,13,26,0.85)', border: '1px solid rgba(20,184,166,0.3)',
        borderRadius: 8, padding: '8px 14px', fontSize: 12, color: 'var(--teal-500)',
        fontWeight: 700, backdropFilter: 'blur(8px)', pointerEvents: 'none'
      }}>
        📍 CARGOVerse — Live Global Fleet View
      </div>
      <div style={{
        position: 'absolute', bottom: 10, right: 10,
        fontSize: 10, color: 'rgba(255,255,255,0.3)', pointerEvents: 'none'
      }}>
        © OpenStreetMap contributors
      </div>
    </div>
  );
}

// ── Navigation ────────────────────────────────────────────────────────────────
function Nav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className={`land-nav${scrolled ? ' scrolled' : ''}`}>
      {/* Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color: '#111', fontWeight: 900,
        }}>⚓</div>
        <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px' }}>
          CARGOVerse
        </span>
      </div>

      {/* Center nav */}
      <div className="land-nav-links">
        {[
          { label: 'Home',         id: 'home' },
          { label: 'Platform',     id: 'platform' },
          { label: 'Solutions',    id: 'solutions' },
          { label: 'Digital Twin', id: 'digital-twin' },
          { label: 'Features',     id: 'features' },
          { label: 'About',        id: 'about' },
        ].map(({ label, id }) => (
          <a key={label} className="land-nav-link" onClick={() => scrollTo(id)} href={`#${id}`}>
            {label}
          </a>
        ))}
      </div>

      {/* Right CTA */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Login</button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => window.alert('Demo booking — connect your CRM here!')}
        >
          Request Demo
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
          Launch Platform
        </button>
      </div>
    </nav>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero" id="home" style={{ minHeight: '100vh', paddingTop: 68 }}>
      {/* Background image */}
      <div className="hero-bg" />
      {/* Dark overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content anim-fade-up">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          AI-Powered Intermodal Logistics Platform
        </div>

        <h1 className="hero-title">
          Autonomous Logistics<br />
          For A <span>Resilient World</span>
        </h1>

        <p className="hero-sub">
          CARGOVerse uses AI-powered autonomous agents to coordinate ports, vessels,
          containers and rail networks during disruptions — delivering intelligence that
          keeps global trade moving.
        </p>

        <div className="hero-buttons">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
            🚀 Launch Platform
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => document.getElementById('digital-twin')?.scrollIntoView({ behavior: 'smooth' })}
          >
            ▶ Watch Simulation
          </button>
        </div>

        <div className="hero-stats">
          {[
            { num: 284000, label: 'Containers Managed', suffix: '+' },
            { num: 47,     label: 'Active Ports',       suffix: '' },
            { num: 312,    label: 'Active Vessels',     suffix: '' },
            { num: 1840,   label: 'Disruptions Resolved', suffix: '+' },
            { num: 98.4,   label: 'On-Time Rate',       suffix: '%', decimals: 1 },
          ].map(s => (
            <div key={s.label} className="hero-stat">
              <div className="hero-stat-num">
                <Counter target={s.num} suffix={s.suffix} decimals={s.decimals || 0} />
              </div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Floating Feature Cards (below hero) ───────────────────────────────────────
function FloatingCards() {
  const cards = [
    { icon: '🤖', title: 'Autonomous Containers', desc: 'Self-managing containers that reroute and negotiate berths without human input.' },
    { icon: '⚡', title: 'Disaster Response',      desc: 'Typhoons, earthquakes and port closures resolved autonomously in minutes.' },
    { icon: '🛃', title: 'AI Customs',             desc: 'Digital pre-clearance at sea reduces dwell from 48 hrs to 18 minutes.' },
    { icon: '🖥', title: 'Digital Twin',           desc: 'A live synchronized clone of the global shipping network, always up to date.' },
  ];
  return (
    <div id="platform" style={{ background: 'var(--primary-bg)', paddingBottom: 80, paddingTop: 20 }}>
      <div className="feature-float-grid">
        {cards.map(c => (
          <div key={c.title} className="feature-float-card">
            <span className="feature-float-icon">{c.icon}</span>
            <div className="feature-float-title">{c.title}</div>
            <div className="feature-float-desc">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Platform Features ─────────────────────────────────────────────────────────
function Features() {
  const cards = [
    {
      icon: '🤖', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',
      title: 'Autonomous Container Intelligence',
      desc: 'Each container operates as a self-managing agent — monitoring temperature, tracking deadlines, negotiating berths and re-routing autonomously.',
    },
    {
      icon: '🤝', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)',
      title: 'Multi-Agent Coordination',
      desc: 'Ports, vessels, customs and rail agents negotiate logistics decisions in parallel. Conflicts resolved in under 800ms via reputation scoring.',
    },
    {
      icon: '⚡', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',
      title: 'Disaster Response Automation',
      desc: 'When typhoons, earthquakes or geopolitical crises strike, CARGOVerse detects, reroutes and recovers cargo flows within minutes.',
    },
    {
      icon: '📋', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)',
      title: 'AI Customs Processing',
      desc: 'Customs declarations are pre-verified digitally at sea. Containers arrive to instant clearance — reducing dwell time from 48 hours to 18 minutes.',
    },
    {
      icon: '🌿', color: '#22C55E', bg: 'rgba(34,197,94,0.12)',
      title: 'Carbon-Aware Optimization',
      desc: 'Every routing decision weighs EU ETS carbon costs alongside speed and cost. Real-time emissions tracking built in.',
    },
    {
      icon: '🌐', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',
      title: 'Global Digital Twin',
      desc: 'A live synchronized copy of the global shipping network — ports, vessels, containers and routes — updated from satellite AIS and IoT sensors.',
    },
  ];
  return (
    <section className="features-section" id="features">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginBottom: 60 }}>
          <div>
            <div className="section-eyebrow">Platform Features</div>
            <h2 className="section-heading">Intelligence that moves global trade forward</h2>
          </div>
          <div>
            <p className="section-body" style={{ marginBottom: 0 }}>
              From autonomous container agents to real-time disaster recovery, CARGOVerse
              delivers enterprise-grade logistics orchestration trusted by leading shipping lines worldwide.
            </p>
          </div>
        </div>
        <div className="features-grid">
          {cards.map(c => (
            <div key={c.title} className="feature-card">
              <div className="feature-icon" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
              <div className="feature-title">{c.title}</div>
              <div className="feature-desc">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Global Digital Twin / Map ─────────────────────────────────────────────────
function DigitalTwinShowcase() {
  return (
    <section className="map-section" id="digital-twin">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-eyebrow">Live Intelligence</div>
          <h2 className="section-heading" style={{ margin: '0 auto 16px' }}>
            Your global supply chain, visualized
          </h2>
          <p className="section-body" style={{ margin: '0 auto', textAlign: 'center' }}>
            Real-time maritime intelligence — ports, vessels, cargo flows, risk zones and
            disruption alerts in a single live view.
          </p>
        </div>

        {/* Google Maps world embed */}
        <GlobalMap height={480} />

        {/* Stats below map */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20 }}>
          {[
            { icon: '🏗', label: 'Major Ports',      value: '47',   color: '#F59E0B' },
            { icon: '🚢', label: 'Vessels Tracked',  value: '312',  color: '#60A5FA' },
            { icon: '📦', label: 'Containers Live',  value: '284K', color: '#A78BFA' },
            { icon: '⚠️', label: 'Risk Alerts Active', value: '3',  color: '#EF4444' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 22px',
              display: 'flex', gap: 14, alignItems: 'center',
            }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Autonomous Agent Network ──────────────────────────────────────────────────
function AgentNetwork() {
  const agents = [
    { icon: '📦', name: 'Container Agent',    desc: 'Monitors temp, tracks deadlines, autonomously negotiates berths.' },
    { icon: '🏗', name: 'Port Agent',         desc: 'Manages berth allocation, gate scheduling and crane operations.' },
    { icon: '🚢', name: 'Ship Agent',         desc: 'Optimizes speed, fuel and routing for every voyage in real time.' },
    { icon: '🚂', name: 'Rail Agent',         desc: 'Books and manages intermodal rail slots across DB Cargo, BNSF.' },
    { icon: '🛃', name: 'Customs Agent',      desc: 'Pre-clears manifests at sea using digital certificates.' },
  ];
  return (
    <section className="agents-section" id="solutions">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div className="section-eyebrow">Autonomous Intelligence</div>
          <h2 className="section-heading" style={{ margin: '0 auto 16px' }}>Five agents, one unified network</h2>
          <p className="section-body" style={{ margin: '0 auto 0', textAlign: 'center' }}>
            Each agent operates independently yet collaborates in real time — eliminating handoff
            delays and manual coordination from your supply chain.
          </p>
        </div>
        <div className="agent-grid">
          {agents.map(a => (
            <div key={a.name} className="agent-card">
              <span className="agent-icon">{a.icon}</span>
              <div className="agent-name">{a.name}</div>
              <div className="agent-desc">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Disaster Recovery Simulation ──────────────────────────────────────────────
function DisasterSection() {
  const scenarios = [
    {
      icon: '🌍', title: 'Earthquake Response',
      desc: 'Seismic event detected at origin port. AI instantly reroutes 340 containers via alternate hub, filing customs digitally at sea.',
      tag: 'Avg. Recovery: 4 min',
    },
    {
      icon: '🌪', title: 'Typhoon Rerouting',
      desc: '14 vessels redirected away from tropical storm path. Alternative routes computed factoring port capacity and fuel costs.',
      tag: 'Avg. Delay Saved: 12h',
    },
    {
      icon: '🔒', title: 'Port Closure Protocol',
      desc: 'Port strike or terminal closure triggers immediate rerouting to nearest capable port with automatic customer notification.',
      tag: '100% Cargo Tracked',
    },
  ];
  return (
    <section className="disaster-section" id="about">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div className="section-eyebrow">Disaster Recovery</div>
          <h2 className="section-heading" style={{ margin: '0 auto 16px' }}>Built for disruption</h2>
          <p className="section-body" style={{ margin: '0 auto 0', textAlign: 'center' }}>
            When crisis strikes, CARGOVerse responds before humans can react — keeping your
            cargo moving regardless of geopolitical, environmental or operational disruption.
          </p>
        </div>
        <div className="disaster-grid">
          {scenarios.map(s => (
            <div key={s.title} className="disaster-card">
              <div style={{ fontSize: 48, marginBottom: 20 }}>{s.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 20 }}>{s.desc}</p>
              <div style={{
                display: 'inline-block', padding: '6px 16px',
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 20, fontSize: 12, color: '#F59E0B', fontWeight: 600,
              }}>{s.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Benefits ──────────────────────────────────────────────────────────────────
function Benefits() {
  const items = [
    { icon: '⏱', title: 'Reduce Delays',         desc: 'Autonomous rerouting resolves disruptions 4× faster than traditional operations centers.' },
    { icon: '👁', title: 'Increase Visibility',   desc: 'Full end-to-end cargo visibility from origin to final-mile across all transport modes.' },
    { icon: '🛡', title: 'Improve Resilience',    desc: 'Multi-agent architecture with no single points of failure ensures continuous operations.' },
    { icon: '⚡', title: 'Faster Recovery',       desc: 'Disaster recovery orchestration delivers ecosystem stabilization in under 5 minutes.' },
    { icon: '💰', title: 'Lower Costs',           desc: 'AI-driven optimization reduces demurrage, detention and customs holding costs by up to 38%.' },
    { icon: '🌿', title: 'Sustainable Logistics', desc: 'Carbon-aware routing decisions reduce fleet emissions by up to 70% on multimodal routes.' },
  ];
  return (
    <section className="benefits-section">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div className="section-eyebrow">Why CARGOVerse</div>
          <h2 className="section-heading" style={{ margin: '0 auto 16px' }}>Measurable business outcomes</h2>
          <p className="section-body" style={{ margin: '0 auto 0', textAlign: 'center' }}>
            Designed for shipping lines, freight forwarders, port operators and government logistics authorities.
          </p>
        </div>
        <div className="benefits-grid">
          {items.map(b => (
            <div key={b.title} className="benefit-card">
              <div className="benefit-icon">{b.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{b.title}</div>
                <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Trusted By ────────────────────────────────────────────────────────────────
function TrustedBy() {
  const logos = ['Maersk', 'MSC', 'DP World', 'DHL', 'Flexport', 'CMA CGM', 'COSCO'];
  return (
    <section style={{ padding: '56px 48px', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 32 }}>
          Trusted by the world's leading logistics companies
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 52, flexWrap: 'wrap', alignItems: 'center' }}>
          {logos.map(l => (
            <div key={l} style={{
              fontSize: 16, fontWeight: 800, color: 'rgba(255,255,255,0.22)',
              letterSpacing: 1, textTransform: 'uppercase',
            }}>{l}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  const navigate = useNavigate();
  return (
    <section className="cta-section">
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Get Started</div>
        <h2 className="section-heading" style={{ margin: '0 auto 20px', textAlign: 'center' }}>
          Ready to transform your logistics?
        </h2>
        <p className="section-body" style={{ margin: '0 auto 44px', textAlign: 'center' }}>
          Join leading shipping lines and port operators using CARGOVerse to build resilient,
          intelligent supply chains.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => window.alert('Demo booking — connect your CRM here!')}>
            Request a Demo
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
            Sign In Free
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="site-footer">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#111' }}>⚓</div>
              <span style={{ fontSize: 16, fontWeight: 800 }}>CARGOVerse</span>
            </div>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: 300 }}>
              Autonomous logistics intelligence platform for global maritime and intermodal supply chains.
            </p>
          </div>
          {[
            { title: 'Platform',  links: ['Digital Twin', 'Container Agents', 'Port Intelligence', 'Analytics'] },
            { title: 'Solutions', links: ['Shipping Lines', 'Port Operators', 'Freight Forwarders', 'Government'] },
            { title: 'Company',   links: ['About', 'Careers', 'Blog', 'Contact'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 18 }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 10, cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                  onClick={() => navigate('/login')}
                >{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.3)' }}>© 2025 CARGOVerse. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service', 'Security'].map(l => (
              <span key={l} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}
              >{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Page Export ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div>
      <Nav />
      <Hero />
      <FloatingCards />
      <TrustedBy />
      <Features />
      <DigitalTwinShowcase />
      <AgentNetwork />
      <DisasterSection />
      <Benefits />
      <CTA />
      <Footer />
    </div>
  );
}
