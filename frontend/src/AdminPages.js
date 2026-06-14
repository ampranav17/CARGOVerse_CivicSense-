import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import beforeImg from './before.png';
import afterImg from './after.png';

// ── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CONTAINERS = [
  { id: 'CT-9081', type: 'Reefer (Pharma)', origin: 'Singapore', dest: 'Rotterdam', status: 'In Transit', priority: 'High', eta: '2026-06-18' },
  { id: 'CT-4402', type: 'Dry Cargo (Electronics)', origin: 'Shanghai', dest: 'Los Angeles', status: 'In Transit', priority: 'Medium', eta: '2026-06-21' },
  { id: 'CT-7731', type: 'Hazmat (Chemicals)', origin: 'Yokohama', dest: 'Hamburg', status: 'Customs Hold', priority: 'Critical', eta: '2026-06-25' },
  { id: 'CT-2091', type: 'Dry Cargo (Textiles)', origin: 'Mumbai', dest: 'Singapore', status: 'Discharged', priority: 'Low', eta: '2026-06-12' },
  { id: 'CT-5510', type: 'Reefer (Produce)', origin: 'Lagos', dest: 'Rotterdam', status: 'Departed', priority: 'High', eta: '2026-06-20' },
  { id: 'CT-8812', type: 'Dry Cargo (Auto Parts)', origin: 'Busan', dest: 'Los Angeles', status: 'In Transit', priority: 'Medium', eta: '2026-06-22' },
];

const MOCK_PORTS = [
  { name: 'Port of Singapore', capacity: '85,000 TEU', status: 'Normal', congestion: '12%', activeContainers: 1420 },
  { name: 'Port of Shanghai', capacity: '120,000 TEU', status: 'Normal', congestion: '24%', activeContainers: 2840 },
  { name: 'Port of Rotterdam', capacity: '95,000 TEU', status: 'Congested', congestion: '68%', activeContainers: 1910 },
  { name: 'Port of Los Angeles', capacity: '75,000 TEU', status: 'Critical', congestion: '85%', activeContainers: 1530 },
  { name: 'Port of Hamburg', capacity: '60,000 TEU', status: 'Normal', congestion: '32%', activeContainers: 980 },
];

const MOCK_VESSELS = [
  { name: 'Atlas Mariner', route: 'Shanghai - LA', status: 'At Sea', speed: '21.5 kts', load: '84%' },
  { name: 'Oceanic Pioneer', route: 'Singapore - Rotterdam', status: 'At Sea', speed: '19.2 kts', load: '92%' },
  { name: 'Pacific Sovereign', route: 'Busan - Seattle', status: 'Moored', speed: '0.0 kts', load: '65%' },
  { name: 'Nova Express', route: 'Yokohama - Hamburg', status: 'At Sea', speed: '20.4 kts', load: '78%' },
  { name: 'Polaris Voyager', route: 'Lagos - Rotterdam', status: 'Departing', speed: '8.5 kts', load: '88%' },
];

const MOCK_DISRUPTIONS = [
  { type: 'Typhoon Mawar', location: 'South China Sea', status: 'Active', severity: 'Critical', impact: '14 Vessels rerouted, average 12h delay' },
  { type: 'Port Strike', location: 'Hamburg Terminal 2', status: 'Active', severity: 'High', impact: 'Dwell time increased by 36 hours' },
  { type: 'Customs Outage', location: 'Rotterdam Gate 4', status: 'Resolved', severity: 'Medium', impact: 'Automated clearance fallback active' },
  { type: 'Chokepoint Congestion', location: 'Suez Canal', status: 'Warning', severity: 'Medium', impact: 'Increased waiting times for northbound vessels' },
];

// ── Admin Pages Object ────────────────────────────────────────────────────────
const AdminPages = {
  // ── HOME PAGE ──────────────────────────────────────────────────────────────
  Home: () => {
    const data = [
      { name: 'Mon', volume: 4000, efficiency: 90 },
      { name: 'Tue', volume: 4500, efficiency: 92 },
      { name: 'Wed', volume: 5100, efficiency: 94 },
      { name: 'Thu', volume: 4800, efficiency: 93 },
      { name: 'Fri', volume: 5300, efficiency: 96 },
      { name: 'Sat', volume: 3800, efficiency: 95 },
      { name: 'Sun', volume: 4200, efficiency: 97 },
    ];
    return (
      <div className="anim-fade-up">
        <div className="kpi-grid">
          {[
            { title: 'Total Containers', val: '28,402 TEU', icon: '📦', delta: '+12.4%', up: true },
            { title: 'Active Vessels', val: '142 At Sea', icon: '🚢', delta: '+2.1%', up: true },
            { title: 'Active Ports', val: '47 Terminals', icon: '🏗', delta: 'Stable', up: true },
            { title: 'System Health', val: '99.98%', icon: '⚡', delta: 'Optimal', up: true },
            { title: 'Disruptions Today', val: '3 Active', icon: '⚠', delta: '-12%', up: false },
            { title: 'Completed Deliveries', val: '1,840', icon: '✓', delta: '+8.4%', up: true },
          ].map((k, i) => (
            <div key={i} className="kpi-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>{k.title}</span>
                <span style={{ fontSize: '18px' }}>{k.icon}</span>
              </div>
              <div className="kpi-value">{k.val}</div>
              <div className={`kpi-delta ${k.up ? 'up' : 'down'}`}>{k.delta} vs last week</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>
          <div className="panel">
            <div className="panel-header">
              <span className="section-title">Global Fleet Throughput & Optimization</span>
              <span className="badge badge-teal">Live telemetry</span>
            </div>
            <div className="panel-body" style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--teal-500)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--teal-500)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.2)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'var(--navy-800)', border: '1px solid var(--border)' }} />
                  <Area type="monotone" dataKey="volume" stroke="var(--teal-500)" fillOpacity={1} fill="url(#colorVolume)" name="Cargo Vol (TEU)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="section-title">Autonomous Agent Feed</span>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { time: '14:24', agent: 'Port Agent Singapore', text: 'Allocated priority berth #4 to Atlas Mariner. Dwell optimized by 4.2h.', type: 'info' },
                { time: '14:18', agent: 'Risk Agent Suez', text: 'Rerouting 3 vessels around Cape of Good Hope due to weather advisory.', type: 'warning' },
                { time: '13:54', agent: 'Customs Agent Shanghai', text: 'Pre-cleared 42 electronic manifest files. Zero cargo delay registered.', type: 'success' },
                { time: '13:10', agent: 'Disaster Coordinator', text: 'Stabilized terminal flow at Rotterdam following minor crane outage.', type: 'info' },
              ].map((a, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyStyle: 'space-between', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 700, color: a.type === 'warning' ? 'var(--amber-500)' : 'var(--teal-500)' }}>{a.agent}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{a.time}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },

  // ── DIGITAL TWIN PAGE (FLAGSHIP) ───────────────────────────────────────────
  DigitalTwin: () => {
    const [disruption, setDisruption] = useState(null);
    const [log, setLog] = useState([]);
    const [running, setRunning] = useState(false);

    const SIMULATION_STEPS = {
      earthquake: [
        { t: 0,    level: 'alert',   msg: '🌋 EARTHQUAKE DETECTED — M7.1 @ 34.2°N 139.8°E (Yokohama coast). Seismic intensity: 5.8 MMI.', conclusion: null },
        { t: 900,  level: 'agent',   msg: '🤖 Risk Agent scanning all vessels within 600 km radius. Found: MSC Astrid, Ever Glory, COSCO Pride (3 vessels at risk).', conclusion: null },
        { t: 1800, level: 'agent',   msg: '🏗 Berth Agent: Yokohama Terminal 3 structural integrity check FAILED. Shutting berths A, B, C.', conclusion: 'Conclusion: 3 berths closed. Alternate ports requested from Kobe, Nagoya.' },
        { t: 2700, level: 'agent',   msg: '🔄 Route Optimizer: Cape deviation adds 2,100 nm — inefficient. Negotiating Nagoya port slots (2 available mega-berths).', conclusion: 'Conclusion: Divert MSC Astrid → Nagoya (ETA +4h). Reroute Ever Glory → Kobe (ETA +6h).' },
        { t: 3600, level: 'agent',   msg: '🌿 Carbon Agent: Alternate route delta +8.4% CO₂. EU ETS cost adjustment: €1,240 surcharge allocated.', conclusion: 'Conclusion: Carbon penalty logged. Offset credits allocated from reserve pool.' },
        { t: 4500, level: 'agent',   msg: '📋 Customs Agent: Pre-clearing 2 diverted manifests remotely. Digital document transfer to Nagoya customs complete.', conclusion: 'Conclusion: 18-minute expedited clearance granted for humanitarian priority cargo.' },
        { t: 5400, level: 'success', msg: '✅ RESOLUTION COMPLETE — 2 vessels diverted. Yokohama damage assessment ongoing. Network ETA accuracy: 97.2%.', conclusion: 'Decision: Divert + pre-clear + carbon offset. Recovery time: 5.4 min.' },
      ],
      typhoon: [
        { t: 0,    level: 'alert',   msg: '🌀 TYPHOON KIRA — Category 4 detected at 28.3°N 131.8°E. Wind speed: 165 kph. Approaching Yokohama corridor.', conclusion: null },
        { t: 900,  level: 'agent',   msg: '🤖 Risk Agent: 14 vessels flagged in typhoon path. Estimated impact window: 18-24 hours.', conclusion: null },
        { t: 1800, level: 'agent',   msg: '🚢 Ship Agent: Issuing storm avoidance orders. Speed reduction from 22kts → 14kts for 6 vessels still in safe zone.', conclusion: 'Conclusion: 6 vessels slow-steam to wait out the storm south of the exclusion zone.' },
        { t: 2700, level: 'agent',   msg: '🏗 Smart Berth Agent: Yokohama Terminals 1-4 suspended. Crane lockdown at wind >50kts. Diverting 8 vessels to Kobe (3 berths), Nagoya (2 berths), Osaka (3 berths).', conclusion: 'Conclusion: Berth pre-allocations negotiated. All diversion ETAs confirmed within 12 hours.' },
        { t: 3600, level: 'agent',   msg: '📋 Customs Agent: Remote pre-clearance triggered for all 8 diverted vessels. EDI manifests transmitted to alternate port authorities.', conclusion: 'Conclusion: Zero customs dwell delay for diverted cargo. Saves 48h per vessel.' },
        { t: 4500, level: 'agent',   msg: '🌿 Sustainability Agent: Rerouting adds 3,200 nm aggregate distance. Offsetting with slow-steaming to cap additional CO₂ at +14%.', conclusion: 'Conclusion: Carbon budget maintained within quarterly ETS allowance.' },
        { t: 5400, level: 'success', msg: '✅ RESOLUTION COMPLETE — 14 vessels managed. 8 diverted, 6 slow-steamed. 100% cargo safety secured. Recovery time: 5.9 min.', conclusion: 'Decision: Autonomously diverted + berth-allocated + pre-cleared 14 vessels without human intervention.' },
      ],
      'port-closure': [
        { t: 0,    level: 'alert',   msg: '🚧 PORT CLOSURE — Rotterdam Terminal Euromax: Docker strike confirmed. All gate operations suspended indefinitely.', conclusion: null },
        { t: 900,  level: 'agent',   msg: '🤖 Risk Agent: 22 inbound vessels affected. Estimated total TEU impact: 48,000 TEU. Strike duration estimate: 36-72 hours.', conclusion: null },
        { t: 1800, level: 'agent',   msg: '🔄 Route Optimizer: Evaluating Antwerp (Berth 4 available, +8h), Hamburg (3 berths, +14h), Bremerhaven (+12h).', conclusion: 'Conclusion: 12 vessels → Antwerp, 6 vessels → Hamburg, 4 vessels anchor-wait for Rotterdam reopening.' },
        { t: 2700, level: 'agent',   msg: '🚂 Rail Agent: Pre-booking DB Cargo slots from Antwerp to Rotterdam inland rail. 18 intermodal trains secured (14:00-22:00 window).', conclusion: 'Conclusion: Inland connectivity secured. Cargo reaches Rotterdam warehouses within 6 hours of Antwerp discharge.' },
        { t: 3600, level: 'agent',   msg: '📋 Customs Agent: Cross-border customs pre-clearance for Belgium entry issued. AEO trusted trader status accelerates all manifests.', conclusion: 'Conclusion: 22 manifests pre-cleared. Average customs dwell: 22 minutes.' },
        { t: 4500, level: 'agent',   msg: '💰 Commercial Agent: Shipper notifications dispatched. Delay liability estimated €2.4M. Insurance claims pre-filled. Demurrage waiver requested.', conclusion: 'Conclusion: 94% of shippers accepted alternate routing with no surcharge.' },
        { t: 5400, level: 'success', msg: '✅ RESOLUTION COMPLETE — Rotterdam closure managed. 18 vessels rerouted, 4 anchor-wait. Cargo continuity: 96.8%. Recovery time: 5.4 min.', conclusion: 'Decision: Split-route to Antwerp+Hamburg + inland rail bridge. Zero cargo stranded.' },
      ],
      'geopolitical-crisis': [
        { t: 0,    level: 'alert',   msg: '⚔ GEOPOLITICAL CRISIS — Red Sea Houthi escalation. US CENTCOM advisory: Bab-el-Mandeb Strait declared high-risk zone.', conclusion: null },
        { t: 900,  level: 'agent',   msg: '🌐 Geopolitical Monitor: GDELT risk index spiked to 88/100. GDACS cross-referenced. 31 vessels in affected corridor identified.', conclusion: null },
        { t: 1800, level: 'agent',   msg: '🔄 Route Optimizer: Red Sea (11,800 nm) vs Cape of Good Hope (16,400 nm). Additional transit: +14 days. Fuel cost delta: +$380,000/vessel.', conclusion: 'Conclusion: Cape route recommended for 28 vessels. 3 high-priority vessels retain Red Sea with naval escort.' },
        { t: 2700, level: 'agent',   msg: '🚢 Ship Agent: Speed optimization for Cape route. 18.5 kts cruise recommended to balance fuel efficiency and delivery SLA.', conclusion: 'Conclusion: SLA maintained for 24/28 vessels. 4 non-critical shipments rescheduled to next window.' },
        { t: 3600, level: 'agent',   msg: '💰 Insurance Agent: P&I war-risk premium surcharge applied. Rate: +0.025% per voyage. Brokers notified. New policy endorsement issued.', conclusion: 'Conclusion: Insurance compliant. Additional cost: $18,500 per vessel auto-absorbed per contract clause 7.4.' },
        { t: 4500, level: 'agent',   msg: '📋 Customs Agent: Country-of-origin re-verification for sanctioned goods list. 2 containers flagged for secondary inspection at Cape Town.', conclusion: 'Conclusion: 2 flagged containers isolated. Remaining 29 vessels cleared for Cape route.' },
        { t: 5400, level: 'success', msg: '✅ RESOLUTION COMPLETE — 31 vessels managed. 28 rerouted via Cape. 3 escorted through Red Sea. Cargo integrity: 99.1%. Recovery time: 5.4 min.', conclusion: 'Decision: Autonomous multi-agent geopolitical re-routing with insurance + customs + speed optimization.' },
      ],
    };

    const triggerSimulation = (type) => {
      setDisruption(type);
      setLog([]);
      setRunning(true);
      const steps = SIMULATION_STEPS[type] || [];
      steps.forEach((s, idx) => {
        setTimeout(() => {
          setLog(prev => [...prev, { level: s.level, msg: s.msg, conclusion: s.conclusion, idx }]);
          if (idx === steps.length - 1) setRunning(false);
        }, s.t);
      });
    };

    const levelColor = { alert: '#ef4444', agent: 'rgba(255,255,255,0.75)', success: '#22c55e' };
    const levelBg = { alert: 'rgba(239,68,68,0.06)', agent: 'transparent', success: 'rgba(34,197,94,0.06)' };

    return (
      <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', minHeight: 600 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Google Maps Digital Twin */}
          <div className="dash-map-wrapper" style={{ position: 'relative', minHeight: 480 }}>
            <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 10, pointerEvents: 'none' }}>
              <div style={{ background: 'rgba(30,41,59,0.92)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-md)', padding: '10px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: '#fff' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: disruption ? '#ef4444' : '#22c55e', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                  {disruption ? `SIMULATION: ${disruption.replace(/-/g,' ').toUpperCase()}` : 'Live Digital Twin — Global Fleet'}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>AIS Feed Rate: 1,842 pps · 312 vessels tracked · {running ? '⚡ Agent processing...' : '● Nominal'}</div>
              </div>
            </div>
            {disruption && (
              <div style={{ position: 'absolute', inset: 0, border: '2px solid #ef4444', pointerEvents: 'none', animation: 'pulse 1.5s infinite', borderRadius: 'inherit', zIndex: 5 }} />
            )}
            <iframe
              title="CARGOVerse Digital Twin Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d60000000!2d20!3d15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              style={{ width: '100%', height: 480, border: 'none', display: 'block', filter: 'saturate(0.7) brightness(0.8)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Detailed Agent Decision Timeline */}
          {disruption && (
            <div className="panel anim-fade-in">
              <div className="panel-header" style={{ background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid rgba(239,68,68,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontWeight: 700 }}>LIVE</span>
                  <span className="section-title" style={{ color: '#fff' }}>🧠 Agent Decision Reasoning — {disruption.replace(/-/g,' ').toUpperCase()}</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => { setDisruption(null); setLog([]); setRunning(false); }}>✕ Reset</button>
              </div>
              <div className="panel-body" style={{ background: 'rgba(0,0,0,0.25)', maxHeight: 380, overflowY: 'auto', padding: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {log.map((entry, idx) => (
                    <div key={idx} style={{ background: levelBg[entry.level], borderLeft: `3px solid ${levelColor[entry.level]}`, padding: '10px 14px', borderRadius: '0 var(--radius-md) var(--radius-md) 0', animation: 'fadeIn 0.4s ease' }}>
                      <div style={{ fontSize: 13, color: levelColor[entry.level], fontFamily: 'monospace', fontWeight: entry.level === 'alert' || entry.level === 'success' ? 700 : 400, marginBottom: entry.conclusion ? 6 : 0 }}>
                        {entry.msg}
                      </div>
                      {entry.conclusion && (
                        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', marginTop: 4, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)', fontStyle: 'italic' }}>
                          ↳ {entry.conclusion}
                        </div>
                      )}
                    </div>
                  ))}
                  {running && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                      <span style={{ animation: 'pulse 0.8s infinite' }}>●</span> Agents processing...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Simulation Controls */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <span className="section-title">Disruption Controls</span>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Select a disruption scenario to watch the autonomous multi-agent system reason through each decision in real-time.</p>
            {[
              { type: 'earthquake', icon: '🌋', label: 'Earthquake (Yokohama)', sub: '7 agents · 5.4 min recovery' },
              { type: 'typhoon', icon: '🌀', label: 'Typhoon Kira (Cat 4)', sub: '14 vessels affected' },
              { type: 'port-closure', icon: '🚧', label: 'Rotterdam Port Strike', sub: '22 vessels rerouted' },
              { type: 'geopolitical-crisis', icon: '⚔', label: 'Red Sea Crisis', sub: '31 vessels managed' },
            ].map(s => (
              <button
                key={s.type}
                className={`btn ${disruption === s.type ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'flex-start', padding: '12px 14px', gap: 2 }}
                onClick={() => triggerSimulation(s.type)}
                disabled={running}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>{s.icon} {s.label}</span>
                <span style={{ fontSize: 11, opacity: 0.65, fontWeight: 400 }}>{s.sub}</span>
              </button>
            ))}

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Live Recovery Metrics</div>
              {[
                { label: 'Avg Recovery Time', val: '4.2 min', color: 'var(--green-500)' },
                { label: 'Agents Active', val: '7 / 7', color: 'var(--accent)' },
                { label: 'Routes Monitored', val: '312 paths', color: 'rgba(255,255,255,0.7)' },
                { label: 'ETA Accuracy', val: '98.4%', color: 'var(--green-500)' },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                  <span style={{ fontWeight: 600, color: m.color }}>{m.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },

  // ── CONTAINERS PAGE ────────────────────────────────────────────────────────
  Containers: () => {
    const INIT_CONTAINERS = [
      { id: 'CT-9081', type: 'Reefer (Pharma)', origin: 'Singapore', dest: 'Rotterdam', status: 'In Transit', priority: 'High', eta: '2026-06-18' },
      { id: 'CT-4402', type: 'Dry Cargo (Electronics)', origin: 'Shanghai', dest: 'Los Angeles', status: 'In Transit', priority: 'Medium', eta: '2026-06-21' },
      { id: 'CT-7731', type: 'Hazmat (Chemicals)', origin: 'Yokohama', dest: 'Hamburg', status: 'Customs Hold', priority: 'Critical', eta: '2026-06-25' },
      { id: 'CT-2091', type: 'Dry Cargo (Textiles)', origin: 'Mumbai', dest: 'Singapore', status: 'Discharged', priority: 'Low', eta: '2026-06-12' },
      { id: 'CT-5510', type: 'Reefer (Produce)', origin: 'Lagos', dest: 'Rotterdam', status: 'Departed', priority: 'High', eta: '2026-06-20' },
      { id: 'CT-8812', type: 'Dry Cargo (Auto Parts)', origin: 'Busan', dest: 'Los Angeles', status: 'In Transit', priority: 'Medium', eta: '2026-06-22' },
    ];
    const [containers, setContainers] = useState(INIT_CONTAINERS);
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [nc, setNc] = useState({ id: '', type: '', origin: '', dest: '', priority: 'Medium', eta: '' });

    const filtered = containers.filter(c =>
      !search || c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase()) ||
      c.origin.toLowerCase().includes(search.toLowerCase()) ||
      c.dest.toLowerCase().includes(search.toLowerCase())
    );

    const addContainer = () => {
      if (!nc.id.trim() || !nc.type.trim()) return;
      setContainers(prev => [...prev, { ...nc, status: 'In Transit' }]);
      setShowAdd(false);
      setNc({ id: '', type: '', origin: '', dest: '', priority: 'Medium', eta: '' });
    };

    const exportCSV = () => {
      const header = 'Container ID,Cargo Type,Origin,Destination,Status,Priority,ETA';
      const rows = containers.map(c => `${c.id},${c.type},${c.origin},${c.dest},${c.status},${c.priority},${c.eta}`);
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'cargoverse-containers.csv'; a.click();
      URL.revokeObjectURL(url);
    };

    const deleteContainer = (id) => setContainers(prev => prev.filter(c => c.id !== id));

    return (
      <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Add Container Modal */}
        {showAdd && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="panel" style={{ width: 480, animation: 'scaleIn 0.25s ease' }}>
              <div className="panel-header">
                <span className="section-title">➕ Add New Container</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>✕</button>
              </div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Container ID *</label>
                    <input className="form-input" placeholder="CT-0001" value={nc.id} onChange={e => setNc(p => ({...p, id: e.target.value}))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Cargo Type *</label>
                    <input className="form-input" placeholder="Dry Cargo (Electronics)" value={nc.type} onChange={e => setNc(p => ({...p, type: e.target.value}))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Origin Port</label>
                    <input className="form-input" placeholder="Shanghai" value={nc.origin} onChange={e => setNc(p => ({...p, origin: e.target.value}))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Destination Port</label>
                    <input className="form-input" placeholder="Rotterdam" value={nc.dest} onChange={e => setNc(p => ({...p, dest: e.target.value}))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Priority</label>
                    <select className="form-input" value={nc.priority} onChange={e => setNc(p => ({...p, priority: e.target.value}))}>
                      <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">ETA (Date)</label>
                    <input className="form-input" type="date" value={nc.eta} onChange={e => setNc(p => ({...p, eta: e.target.value}))} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={addContainer}>✓ Add Container</button>
                  <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="panel">
          <div className="panel-header">
            <span className="section-title">Autonomous Containers Fleet ({filtered.length} of {containers.length})</span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  placeholder="🔍  Search by ID, type, port..."
                  style={{ padding: '7px 14px', width: 220, fontSize: 12 }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14 }}>✕</button>
                )}
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>➕ Add Container</button>
              <button className="btn btn-secondary btn-sm" onClick={exportCSV}>⬇ Export CSV</button>
            </div>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Container ID</th><th>Cargo Type</th><th>Origin</th><th>Destination</th><th>Status</th><th>Priority</th><th>ETA</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24, color: 'rgba(255,255,255,0.3)' }}>No containers match your search.</td></tr>
                )}
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{c.id}</td>
                    <td>{c.type}</td>
                    <td>{c.origin}</td>
                    <td>{c.dest}</td>
                    <td><span className={`badge ${c.status === 'In Transit' ? 'badge-blue' : c.status === 'Customs Hold' ? 'badge-amber' : c.status === 'Discharged' ? 'badge-green' : 'badge-gray'}`}>{c.status}</span></td>
                    <td><span className={`badge ${c.priority === 'Critical' ? 'badge-red' : c.priority === 'High' ? 'badge-amber' : c.priority === 'Medium' ? 'badge-blue' : 'badge-gray'}`}>{c.priority}</span></td>
                    <td>{c.eta}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button className="btn btn-secondary btn-sm" style={{ padding: '4px 9px', fontSize: 11 }}
                          onClick={() => window.alert(`📍 Tracking ${c.id}\nRoute: ${c.origin} → ${c.dest}\nStatus: ${c.status}\nETA: ${c.eta}`)}>📍 Track</button>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 9px', fontSize: 11 }}
                          onClick={() => window.alert(`Container: ${c.id}\nType: ${c.type}\nPriority: ${c.priority}\nRoute: ${c.origin} → ${c.dest}\nETA: ${c.eta}`)}>Details</button>
                        <button className="btn btn-danger btn-sm" style={{ padding: '4px 9px', fontSize: 11 }}
                          onClick={() => { if (window.confirm(`Delete container ${c.id}?`)) deleteContainer(c.id); }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  },

  // ── FEATURE 1: AUTONOMOUS CONTAINER AGENT ──────────────────────────────────
  ContainerAgent: () => {
    const [selected, setSelected] = useState(null);
    const [agentLog, setAgentLog] = useState([]);
    const [thinking, setThinking] = useState(false);

    const AGENT_CONTAINERS = [
      { id: 'CT-9081', type: 'Reefer (Pharma — Vaccines)', origin: 'Mumbai', dest: 'Osaka', status: 'En Route', risk: 'High', temp: '-20°C', deadline: '2026-06-21', lat: '28.4°N', lon: '72.1°E', scenario: 'typhoon' },
      { id: 'CT-4402', type: 'Dry Cargo (Electronics)', origin: 'Shanghai', dest: 'Los Angeles', status: 'At Sea', risk: 'Low', temp: 'N/A', deadline: '2026-06-25', lat: '32.1°N', lon: '148.2°E', scenario: 'normal' },
      { id: 'CT-7731', type: 'Hazmat (Chemicals)', origin: 'Yokohama', dest: 'Hamburg', status: 'Customs Hold', risk: 'Critical', temp: 'N/A', deadline: '2026-06-20', lat: 'Stationary', lon: 'Yokohama', scenario: 'customs' },
      { id: 'CT-2091', type: 'Humanitarian Aid (Medicine)', origin: 'Singapore', dest: 'Türkiye', status: 'Priority Flagged', risk: 'Disaster', temp: '2–8°C', deadline: '2026-06-15', lat: '10.2°N', lon: '82.4°E', scenario: 'disaster' },
    ];

    const AGENT_SCENARIOS = {
      typhoon: [
        { msg: '🧠 CT-9081 Agent activated. Scanning route Mumbai → Osaka...', delay: 0 },
        { msg: '⚠️ ALERT: Typhoon Mawar detected at 28.3°N 131.8°E. Route intersection in 14 hours.', delay: 800 },
        { msg: '📊 Risk calculation: Delivery deadline = June 21. Current ETA = June 20. Buffer = 24h. Storm delay estimate = 36h. DEADLINE MISS CONFIRMED.', delay: 1800 },
        { msg: '🔄 Querying Port Agent network... Kobe: 2 berths available. Nagoya: 1 berth available. Requesting priority pharma slot.', delay: 2800 },
        { msg: '📋 Customs Agent notified: manifest pre-transfer to Kobe customs authority. EDI document transmitted.', delay: 3800 },
        { msg: '🏥 HUMANITARIAN FLAG activated: Vaccine cargo — overriding commercial queue. Priority unloading slot secured at Kobe Terminal 3.', delay: 4800 },
        { msg: '✅ DECISION COMPLETE: CT-9081 diverted to Kobe. Vaccines safe. New ETA: June 21 05:00. Zero human intervention required.', delay: 5800 },
      ],
      normal: [
        { msg: '🧠 CT-4402 Agent activated. Route Shanghai → Los Angeles monitoring...', delay: 0 },
        { msg: '✅ Route clear. No disruptions detected on Pacific crossing. Weather: Nominal.', delay: 800 },
        { msg: '📊 Efficiency check: Current speed 21.5 kts. Optimal fuel speed: 19.2 kts. Slowing to save 8.4% fuel.', delay: 1800 },
        { msg: '🌿 Carbon Agent: Slow-steam reduces CO₂ by 420 kg. Savings: $1,240 / ₹1,03,320 in ETS credits.', delay: 2800 },
        { msg: '✅ STATUS: On time. All systems nominal. ETA June 25 confirmed.', delay: 3600 },
      ],
      customs: [
        { msg: '🧠 CT-7731 Agent activated. Customs Hold detected at Yokohama Terminal.', delay: 0 },
        { msg: '🔍 Analyzing hold reason: HS Code 2814.10 (Ammonia) — flagged for dual-use screening.', delay: 800 },
        { msg: '📋 Customs Agent: Extracting safety data sheets, COO certificates, end-user declaration...', delay: 1800 },
        { msg: '🤝 Negotiating with Yokohama Customs Authority. Requesting expedited screening slot.', delay: 2800 },
        { msg: '✅ Expedited inspection booked: 14:00 today. Pre-submitted documents approved. Hold expected to clear in 4 hours.', delay: 3800 },
      ],
      disaster: [
        { msg: '🧠 CT-2091 HUMANITARIAN AGENT activated. Earthquake detected — Türkiye coast.', delay: 0 },
        { msg: '🌍 Disaster Coordinator: Scanning global cargo database for medicine/relief supplies heading to region...', delay: 800 },
        { msg: '🚨 CT-2091 flagged: Contains 12,000 units Amoxicillin + 800 units surgical kits. HUMANITARIAN PRIORITY ACTIVATED.', delay: 1800 },
        { msg: '⚡ Commercial queue OVERRIDDEN. CT-2091 assigned emergency berth. Customs fast-tracked — AEO trusted trader bypass.', delay: 2800 },
        { msg: '🚂 Rail Agent: Emergency ground transport booked from Mersin Port to disaster zone (420 km). ETA: 6 hours.', delay: 3800 },
        { msg: '✅ HUMANITARIAN CORRIDOR ACTIVE. CT-2091 en route. Estimated lives impacted: 2,400 patients. No human needed.', delay: 5000 },
      ],
    };

    const runAgent = (container) => {
      setSelected(container);
      setAgentLog([]);
      setThinking(true);
      const steps = AGENT_SCENARIOS[container.scenario] || [];
      steps.forEach((s) => {
        setTimeout(() => {
          setAgentLog(prev => [...prev, s.msg]);
          if (s.delay === steps[steps.length - 1].delay) setThinking(false);
        }, s.delay);
      });
    };

    const riskColor = { High: '#f59e0b', Low: '#22c55e', Critical: '#ef4444', Disaster: '#a855f7' };

    return (
      <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 28 }}>🤖</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>Feature 1 — Autonomous Container Agent</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Every container has its own AI brain. It knows its cargo, deadline, risk level, and makes decisions autonomously — no human needed.</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {AGENT_CONTAINERS.map(c => (
              <div key={c.id} className="card" style={{ cursor: 'pointer', border: selected?.id === c.id ? '1px solid var(--accent)' : '1px solid var(--card-border)', transition: 'all 0.2s' }} onClick={() => runAgent(c)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent)', fontSize: 14 }}>{c.id}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${riskColor[c.risk]}22`, color: riskColor[c.risk] }}>{c.risk} Risk</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{c.type}</div>
                <div style={{ fontSize: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span>📍 {c.origin} → {c.dest}</span>
                  {c.temp !== 'N/A' && <span>🌡 {c.temp}</span>}
                  <span>🕐 ETA: {c.deadline}</span>
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>▶ Click to Activate Agent Reasoning →</div>
              </div>
            ))}
          </div>
          <div className="panel" style={{ minHeight: 500 }}>
            <div className="panel-header" style={{ background: 'rgba(245,158,11,0.06)' }}>
              <span className="section-title">🧠 Agent Decision Console</span>
              {thinking && <span style={{ fontSize: 11, color: 'var(--accent)', animation: 'pulse 1s infinite' }}>● Processing...</span>}
            </div>
            <div className="panel-body" style={{ background: 'rgba(0,0,0,0.2)', minHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
              {agentLog.length === 0 && (
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, textAlign: 'center', marginTop: 80 }}>← Select a container to watch the AI agent reason through every decision in real-time</div>
              )}
              {agentLog.map((line, i) => (
                <div key={i} style={{ fontSize: 12, fontFamily: 'monospace', color: line.startsWith('✅') ? '#22c55e' : line.startsWith('⚠️') || line.startsWith('🚨') ? '#ef4444' : 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: 6, borderLeft: `3px solid ${line.startsWith('✅') ? '#22c55e' : line.startsWith('⚠️') || line.startsWith('🚨') ? '#ef4444' : 'rgba(245,158,11,0.4)'}`, animation: 'fadeIn 0.3s ease' }}>
                  {line}
                </div>
              ))}
              {thinking && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', padding: '8px 12px', animation: 'pulse 0.8s infinite' }}>● agent thinking...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },

  // ── FEATURE 5: CARGO HEALTH & DAMAGE PREDICTION ────────────────────────────
  CargoHealth: () => {
    const [selectedCargo, setSelectedCargo] = useState(0);
    const CARGO_ITEMS = [
      {
        id: 'CT-9081', name: 'Pharmaceutical Vaccines', icon: '💉',
        sensors: { temp: -17.8, tempTarget: -20, humidity: 48, vibration: 0.12, shock: 'None', tilt: '1.2°' },
        prediction: { status: 'WARNING', msg: 'Temperature rising. Safe limit will be breached in ~4 hours if unchecked.', action: 'AI Action: Alerting vessel crew. Locating nearest cold-storage port (Kobe — 280 nm). Pre-filling insurance claim.', color: '#f59e0b' },
        history: [{ t: '06:00', v: -20.1 }, { t: '08:00', v: -19.8 }, { t: '10:00', v: -19.2 }, { t: '12:00', v: -18.4 }, { t: '14:00', v: -17.8 }]
      },
      {
        id: 'CT-4402', name: 'Consumer Electronics', icon: '📱',
        sensors: { temp: 22.3, tempTarget: '15-30', humidity: 62, vibration: 0.04, shock: 'None', tilt: '0.3\u00b0' },
        prediction: { status: 'HEALTHY', msg: 'All sensor readings within safe parameters. No damage risk detected.', action: 'AI Action: Monitoring continues. Next checkpoint in 2 hours.', color: '#22c55e' },
        history: [{ t: '06:00', v: 22.0 }, { t: '08:00', v: 22.1 }, { t: '10:00', v: 22.3 }, { t: '12:00', v: 22.2 }, { t: '14:00', v: 22.3 }]
      },
      {
        id: 'CT-5510', name: 'Fresh Produce (Perishables)', icon: '🥦',
        sensors: { temp: 6.8, tempTarget: '2–8°C', humidity: 91, vibration: 0.08, shock: 'Low', tilt: '0.9°' },
        prediction: { status: 'ALERT', msg: 'Humidity at 91% — exceeds threshold of 85%. Mold risk within 8 hours.', action: 'AI Action: Adjusting ventilation in container. Shipper notified. Port authority alerted for priority unloading.', color: '#ef4444' },
        history: [{ t: '06:00', v: 78 }, { t: '08:00', v: 82 }, { t: '10:00', v: 86 }, { t: '12:00', v: 89 }, { t: '14:00', v: 91 }]
      },
    ];

    const c = CARGO_ITEMS[selectedCargo];

    return (
      <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 28 }}>🌡</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>Feature 5 — Cargo Health & Damage Prediction</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>AI continuously monitors IoT sensors (temperature, humidity, vibration, shock) and predicts damage BEFORE it occurs. Not reactive — predictive.</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {CARGO_ITEMS.map((item, i) => (
            <div key={i} className="card" style={{ flex: 1, cursor: 'pointer', border: selectedCargo === i ? '1px solid var(--accent)' : '1px solid var(--card-border)' }} onClick={() => setSelectedCargo(i)}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{item.id}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>{item.name}</div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${item.prediction.color}22`, color: item.prediction.color }}>{item.prediction.status}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="panel">
            <div className="panel-header"><span className="section-title">📡 Live Sensor Readings — {c.id}</span></div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Temperature', val: `${c.sensors.temp}°C`, target: `Target: ${c.sensors.tempTarget}°C`, warn: c.id === 'CT-9081' },
                { label: 'Humidity', val: `${c.sensors.humidity}%`, target: 'Target: <85%', warn: c.id === 'CT-5510' },
                { label: 'Vibration (g)', val: `${c.sensors.vibration}g`, target: 'Safe: <0.5g', warn: false },
                { label: 'Shock Events', val: c.sensors.shock, target: 'Monitored', warn: false },
                { label: 'Tilt Angle', val: c.sensors.tilt, target: 'Safe: <5°', warn: false },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{row.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.target}</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: row.warn ? '#ef4444' : '#22c55e' }}>{row.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="panel" style={{ flex: 1 }}>
              <div className="panel-header"><span className="section-title">🔮 AI Damage Prediction</span></div>
              <div className="panel-body">
                <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: `${c.prediction.color}11`, border: `1px solid ${c.prediction.color}44`, marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, color: c.prediction.color, fontSize: 13, marginBottom: 6 }}>{c.prediction.status}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{c.prediction.msg}</div>
                </div>
                <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontFamily: 'monospace' }}>
                  {c.prediction.action}
                </div>
              </div>
            </div>

            <div className="panel" style={{ flex: 1 }}>
              <div className="panel-header"><span className="section-title">📈 Sensor Trend (Last 8h)</span></div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {c.history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 50 }}>{h.t}</span>
                    <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(100, Math.abs(h.v / (c.id === 'CT-5510' ? 1 : 0.22)))}%`, background: i === c.history.length - 1 ? c.prediction.color : 'var(--accent)', borderRadius: 4, transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, minWidth: 40, textAlign: 'right', color: i === c.history.length - 1 ? c.prediction.color : 'var(--text-primary)' }}>{h.v}{c.id === 'CT-5510' ? '%' : '°C'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  // ── FEATURE 9: CONTAINER REPUTATION SCORE ──────────────────────────────────
  ReputationScore: () => {
    const CONTAINERS_REP = [
      { id: 'CT-9081', owner: 'MedLogix Asia Pte.', score: 96, onTime: '99%', violations: 0, damage: '0%', sustainability: 'A+', badge: 'Platinum', color: '#a855f7', history: [88, 90, 92, 93, 95, 96], trends: 'up' },
      { id: 'CT-4402', owner: 'TechFreight Global', score: 88, onTime: '94%', violations: 1, damage: '0.2%', sustainability: 'A', badge: 'Gold', color: '#f59e0b', history: [82, 83, 85, 86, 87, 88], trends: 'up' },
      { id: 'CT-7731', owner: 'ChemPort Logistics', score: 71, onTime: '82%', violations: 3, damage: '1.1%', sustainability: 'B', badge: 'Standard', color: '#60a5fa', history: [76, 75, 74, 73, 72, 71], trends: 'down' },
      { id: 'CT-2091', owner: 'GlobalAid Org.', score: 99, onTime: '100%', violations: 0, damage: '0%', sustainability: 'A++', badge: 'Elite (NGO)', color: '#22c55e', history: [95, 96, 97, 98, 99, 99], trends: 'up' },
      { id: 'CT-5510', owner: 'FreshProduce Africa', score: 79, onTime: '88%', violations: 1, damage: '0.8%', sustainability: 'B+', badge: 'Silver', color: '#94a3b8', history: [74, 75, 76, 77, 78, 79], trends: 'up' },
    ];

    return (
      <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 28 }}>⭐</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>Feature 9 — Container Reputation Score</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Like an "Uber rating" for containers. The AI scores each container on delivery reliability, customs compliance, damage history, and sustainability over time. High-trust containers get priority service.</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { label: 'Avg Fleet Score', val: '86.6', icon: '📊', color: '#f59e0b' },
            { label: 'Platinum Rated', val: '1 Container', icon: '💎', color: '#a855f7' },
            { label: 'At-Risk Containers', val: '1 (Score <75)', icon: '⚠️', color: '#ef4444' },
          ].map((k, i) => (
            <div key={i} className="kpi-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{k.label}</span>
                <span style={{ fontSize: 20 }}>{k.icon}</span>
              </div>
              <div className="kpi-value" style={{ color: k.color }}>{k.val}</div>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-header">
            <span className="section-title">Reputation Leaderboard — AI Scoring Engine</span>
            <span className="badge badge-teal">Live scoring</span>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th><th>Container ID</th><th>Owner</th><th>Reputation Score</th><th>On-Time %</th><th>Violations</th><th>Damage Rate</th><th>Sustainability</th><th>Badge</th><th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {[...CONTAINERS_REP].sort((a, b) => b.score - a.score).map((c, i) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 800, color: 'var(--text-muted)' }}>#{i + 1}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{c.id}</td>
                    <td>{c.owner}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${c.score}%`, background: c.color, borderRadius: 4 }} />
                        </div>
                        <span style={{ fontWeight: 800, color: c.color, minWidth: 32 }}>{c.score}</span>
                      </div>
                    </td>
                    <td><span style={{ color: '#22c55e', fontWeight: 600 }}>{c.onTime}</span></td>
                    <td><span style={{ color: c.violations > 0 ? '#ef4444' : '#22c55e' }}>{c.violations}</span></td>
                    <td><span style={{ color: parseFloat(c.damage) > 0.5 ? '#ef4444' : '#22c55e' }}>{c.damage}</span></td>
                    <td><span className="badge badge-green">{c.sustainability}</span></td>
                    <td><span style={{ padding: '3px 10px', borderRadius: 20, background: `${c.color}22`, color: c.color, fontWeight: 700, fontSize: 11 }}>{c.badge}</span></td>
                    <td><span style={{ color: c.trends === 'up' ? '#22c55e' : '#ef4444', fontSize: 16 }}>{c.trends === 'up' ? '↑' : '↓'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><span className="section-title">How the AI Reputation Score Works</span></div>
          <div className="panel-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {[
                { factor: 'Delivery Reliability', weight: '40%', icon: '🕐', desc: 'On-time arrival rate across all voyages' },
                { factor: 'Customs Compliance', weight: '25%', icon: '🛂', desc: 'Clean manifests, zero violations history' },
                { factor: 'Damage History', weight: '20%', icon: '📦', desc: 'Cargo integrity & claim-free record' },
                { factor: 'Sustainability Score', weight: '15%', icon: '🌿', desc: 'Carbon efficiency, routing choices made' },
              ].map((f, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{f.factor}</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 18, marginBottom: 6 }}>{f.weight}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },

  // ── PORTS PAGE (PORT OPERATIONS CENTER) ────────────────────────────────────
  Ports: () => {

    const SCENARIOS = {
      normal: {
        overview: {
          portName: "Yokohama Port (Autonomous Terminal 4)",
          totalBerths: 4,
          availableBerths: 2,
          occupiedBerths: 1,
          reservedBerths: 1,
          portCapacityPct: 45,
          avgWaitingTime: "12 mins",
          status: "Optimal"
        },
        berths: [
          { name: "Berth A", status: "Occupied", vessel: "MSC Astrid", release: "01:45 hrs", color: "red" },
          { name: "Berth B", status: "Available", vessel: "-", release: "-", color: "green" },
          { name: "Berth C", status: "Available", vessel: "-", release: "-", color: "green" },
          { name: "Berth D", status: "Reserved", vessel: "Ever Glory", release: "02:30 hrs (Docking)", color: "orange" }
        ],
        queue: [
          { name: "Ever Glory", eta: "02:30", cargo: "Commercial Goods", priority: "Normal", berth: "Berth D", dockTime: "02:45" },
          { name: "COSCO Pride", eta: "04:15", cargo: "Textiles", priority: "Low", berth: "Berth B", dockTime: "04:30" }
        ],
        aiDecision: {
          decision: "COSCO Pride assigned to Berth B",
          reason: "Berth B is available immediately and COSCO Pride has low-priority cargo; customs pre-cleared. Nearby Crane 2 is ready.",
          confidence: 98,
          criteria: {
            cargoUrgency: "Low priority - Standard slot",
            craneAvail: "Crane 2 ready (efficiency 94%)",
            customsReady: "Pre-cleared at sea (18 min clearance)",
            weather: "Optimal (sea state 1.2m)"
          }
        },
        heatmap: {
          anchorage: "low",
          channel: "low",
          terminal1: "low",
          terminal2: "medium",
          storage: "low"
        },
        metrics: {
          utilization: "55%",
          waitingTime: "12m",
          processed: 42,
          accuracy: "99.1%",
          reduction: "34%",
          efficiency: "96%"
        }
      },
      congestion: {
        overview: {
          portName: "Yokohama Port (Autonomous Terminal 4)",
          totalBerths: 4,
          availableBerths: 0,
          occupiedBerths: 3,
          reservedBerths: 1,
          portCapacityPct: 85,
          avgWaitingTime: "145 mins",
          status: "Congested"
        },
        berths: [
          { name: "Berth A", status: "Occupied", vessel: "MSC Astrid", release: "03:48 hrs", color: "red" },
          { name: "Berth B", status: "Occupied", vessel: "COSCO Pride", release: "04:12 hrs", color: "red" },
          { name: "Berth C", status: "Occupied", vessel: "Hapag Hamburg", release: "02:10 hrs", color: "red" },
          { name: "Berth D", status: "Reserved", vessel: "Ever Glory", release: "00:30 hrs (Docking)", color: "orange" }
        ],
        queue: [
          { name: "Ever Glory", eta: "00:30", cargo: "Commercial Goods", priority: "Normal", berth: "Berth D", dockTime: "00:45" },
          { name: "APL Danube", eta: "01:10", cargo: "Electronics", priority: "High", berth: "Pending (C Slot)", dockTime: "02:25" },
          { name: "Maersk Elba", eta: "01:45", cargo: "Machinery", priority: "Medium", berth: "Rerouted (Nagoya)", dockTime: "N/A" }
        ],
        aiDecision: {
          decision: "Maersk Elba rerouted to Port of Nagoya",
          reason: "Yokohama capacity exceeds 85%. Delay at anchorage would be 5.5 hours. Port of Nagoya has empty berths and matching cargo specs.",
          confidence: 94,
          criteria: {
            cargoUrgency: "Medium priority - Transit delay trade-off",
            craneAvail: "No local cranes available within 4 hours",
            customsReady: "Import papers pending secondary review",
            weather: "Minor wind gusts (18 kts) at Yokohama"
          }
        },
        heatmap: {
          anchorage: "high",
          channel: "high",
          terminal1: "high",
          terminal2: "high",
          storage: "medium"
        },
        metrics: {
          utilization: "88%",
          waitingTime: "145m",
          processed: 48,
          accuracy: "95.8%",
          reduction: "12%",
          efficiency: "72%"
        }
      },
      typhoon: {
        overview: {
          portName: "Yokohama Port (Autonomous Terminal 4)",
          totalBerths: 4,
          availableBerths: 0,
          occupiedBerths: 1,
          reservedBerths: 0,
          portCapacityPct: 25,
          avgWaitingTime: "N/A",
          status: "Restricted (Storm)"
        },
        berths: [
          { name: "Berth A", status: "Occupied", vessel: "MSC Astrid (Locked)", release: "Indefinite", color: "red" },
          { name: "Berth B", status: "Maintenance", vessel: "-", release: "-", color: "gray" },
          { name: "Berth C", status: "Maintenance", vessel: "-", release: "-", color: "gray" },
          { name: "Berth D", status: "Maintenance", vessel: "-", release: "-", color: "gray" }
        ],
        queue: [
          { name: "Ever Glory", eta: "Rerouted", cargo: "Commercial Goods", priority: "Normal", berth: "Rerouted (Kobe)", dockTime: "N/A" },
          { name: "COSCO Pride", eta: "Rerouted", cargo: "Textiles", priority: "Low", berth: "Rerouted (Nagoya)", dockTime: "N/A" },
          { name: "APL Danube", eta: "Rerouted", cargo: "Electronics", priority: "High", berth: "Rerouted (Osaka)", dockTime: "N/A" }
        ],
        aiDecision: {
          decision: "Yokohama operations suspended; 3 vessels rerouted",
          reason: "Typhoon wind speeds exceed 65 kts. Yokohama crane operations suspended. Vessels rerouted to alternate ports Kobe, Nagoya, and Osaka.",
          confidence: 99,
          criteria: {
            cargoUrgency: "Safety Override - Storm evacuation",
            craneAvail: "All cranes locked down (winds > 50 kts)",
            customsReady: "Customs office evacuated",
            weather: "TYPHOON (Sea state 7.5m, wind 68 kts)"
          }
        },
        heatmap: {
          anchorage: "high",
          channel: "high",
          terminal1: "low",
          terminal2: "low",
          storage: "high"
        },
        metrics: {
          utilization: "25%",
          waitingTime: "N/A",
          processed: 12,
          accuracy: "100%",
          reduction: "0%",
          efficiency: "15%"
        }
      },
      crane_failure: {
        overview: {
          portName: "Yokohama Port (Autonomous Terminal 4)",
          totalBerths: 4,
          availableBerths: 1,
          occupiedBerths: 2,
          reservedBerths: 1,
          portCapacityPct: 65,
          avgWaitingTime: "68 mins",
          status: "Degraded Operations"
        },
        berths: [
          { name: "Berth A", status: "Occupied", vessel: "MSC Astrid", release: "01:45 hrs", color: "red" },
          { name: "Berth B", status: "Available", vessel: "-", release: "-", color: "green" },
          { name: "Berth C", status: "Maintenance", vessel: "Hapag Hamburg (Stuck)", release: "06:48 hrs", color: "gray" },
          { name: "Berth D", status: "Reserved", vessel: "Ever Glory", release: "02:30 hrs", color: "orange" }
        ],
        queue: [
          { name: "Ever Glory", eta: "02:30", cargo: "Commercial Goods", priority: "Normal", berth: "Berth D", dockTime: "02:45" },
          { name: "COSCO Pride", eta: "03:00", cargo: "Textiles", priority: "Low", berth: "Berth B", dockTime: "03:20" }
        ],
        aiDecision: {
          decision: "COSCO Pride reassigned from Berth C to Berth B",
          reason: "Gantry Crane 3 at Berth C experienced mechanical failure. Repaired in 8h. Berth B has Crane 2 available with matching capacity.",
          confidence: 96,
          criteria: {
            cargoUrgency: "Standard priority - Slot shift approved",
            craneAvail: "Crane 3 offline. Re-routing to Crane 2",
            customsReady: "Pre-cleared at sea",
            weather: "Optimal (sea state 1.1m)"
          }
        },
        heatmap: {
          anchorage: "medium",
          channel: "low",
          terminal1: "high",
          terminal2: "medium",
          storage: "medium"
        },
        metrics: {
          utilization: "70%",
          waitingTime: "68m",
          processed: 38,
          accuracy: "97.5%",
          reduction: "22%",
          efficiency: "78%"
        }
      },
      humanitarian: {
        overview: {
          portName: "Yokohama Port (Autonomous Terminal 4)",
          totalBerths: 4,
          availableBerths: 1,
          occupiedBerths: 1,
          reservedBerths: 2,
          portCapacityPct: 50,
          avgWaitingTime: "8 mins",
          status: "Priority Protocol Active"
        },
        berths: [
          { name: "Berth A", status: "Occupied", vessel: "MSC Astrid", release: "01:45 hrs", color: "red" },
          { name: "Berth B", status: "Reserved", vessel: "UN Aid Carrier", release: "Immediate Docking", color: "orange" },
          { name: "Berth C", status: "Available", vessel: "-", release: "-", color: "green" },
          { name: "Berth D", status: "Reserved", vessel: "Ever Glory", release: "02:30 hrs", color: "orange" }
        ],
        queue: [
          { name: "UN Aid Carrier", eta: "00:10", cargo: "Vaccines & Medical Supplies", priority: "Critical", berth: "Berth B", dockTime: "00:15" },
          { name: "Ever Glory", eta: "02:30", cargo: "Commercial Goods", priority: "Normal", berth: "Berth D", dockTime: "02:45" },
          { name: "COSCO Pride", eta: "03:30", cargo: "Textiles", priority: "Low", berth: "Berth C", dockTime: "03:45" }
        ],
        aiDecision: {
          decision: "UN Aid Carrier assigned to Berth B (Preempted COSCO Pride)",
          reason: "Humanitarian vaccines cargo has critical temperature expiration. Smart Berth Agent displaced COSCO Pride to Berth C to guarantee immediate dock.",
          confidence: 99,
          criteria: {
            cargoUrgency: "HUMANITARIAN CRITICAL (Temp sensitive vaccines)",
            craneAvail: "Crane 2 ready + backup staff allocated",
            customsReady: "Pre-cleared with emergency diplomatic passport",
            weather: "Optimal (sea state 1.0m)"
          }
        },
        heatmap: {
          anchorage: "low",
          channel: "low",
          terminal1: "medium",
          terminal2: "medium",
          storage: "low"
        },
        metrics: {
          utilization: "60%",
          waitingTime: "8m",
          processed: 45,
          accuracy: "99.8%",
          reduction: "36%",
          efficiency: "98%"
        }
      }
    };

    const [simMode, setSimMode] = useState('normal');
    const sc = SCENARIOS[simMode] || SCENARIOS.normal;

    return (
      <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Dynamic Simulation Controls */}
        <div className="panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Smart Berth Operations Control</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Select a simulation scenario to test autonomous berth slot allocation</div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { id: 'normal', label: 'Normal Operations', icon: '🟢' },
              { id: 'congestion', label: 'Port Congestion', icon: '⚠️' },
              { id: 'typhoon', label: 'Typhoon Event', icon: '🌀' },
              { id: 'crane_failure', label: 'Crane Failure', icon: '🔧' },
              { id: 'humanitarian', label: 'Humanitarian Emergency', icon: '❤️' },
            ].map(m => (
              <button
                key={m.id}
                className={`btn btn-sm ${simMode === m.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => {
                  setSimMode(m.id);
                  if (m.id === 'typhoon') {
                    fetch('/api/disaster/typhoon', { method: 'POST' }).catch(() => {});
                  } else if (m.id === 'normal') {
                    fetch('/api/disaster/reset', { method: 'POST' }).catch(() => {});
                  }
                }}
              >
                <span>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tagline section */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ fontSize: '28px' }}>🏗️</div>
          <div>
            <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent)', fontWeight: 700 }}>Feature 12 — Smart Berth Allocation & Port Slot Intelligence</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>"Every arriving vessel knows exactly where to dock before reaching the port."</div>
          </div>
        </div>

        {/* Dashboard Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
          {[
            { title: 'Avg Berth Utilization', val: sc.metrics.utilization, icon: '📊' },
            { title: 'Avg Waiting Time', val: sc.metrics.waitingTime, icon: '⏳' },
            { title: 'Processed Today', val: sc.metrics.processed, icon: '🚢' },
            { title: 'Berth Assignment Accuracy', val: sc.metrics.accuracy, icon: '🎯' },
            { title: 'Congestion Reduction', val: sc.metrics.reduction, icon: '📉' },
            { title: 'Docking Efficiency', val: sc.metrics.efficiency, icon: '⚡' },
          ].map((m, i) => (
            <div key={i} className="kpi-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{m.title}</span>
                <span style={{ fontSize: '16px' }}>{m.icon}</span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{m.val}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Port Overview & Berth Visualization */}
            <div className="panel">
              <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="section-title">Port Operations Overview: {sc.overview.portName}</span>
                <span className={`badge ${sc.overview.status.includes('Optimal') ? 'badge-green' : sc.overview.status.includes('Congested') ? 'badge-amber' : 'badge-red'}`}>
                  {sc.overview.status}
                </span>
              </div>
              <div className="panel-body">
                {/* Stats sub-row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {[
                    { label: 'Total Berths', val: sc.overview.totalBerths },
                    { label: 'Available', val: sc.overview.availableBerths, color: 'var(--green-500)' },
                    { label: 'Occupied', val: sc.overview.occupiedBerths, color: 'var(--red-500)' },
                    { label: 'Reserved', val: sc.overview.reservedBerths, color: 'var(--accent)' },
                    { label: 'Port Capacity', val: `${sc.overview.portCapacityPct}%`, color: sc.overview.portCapacityPct > 80 ? 'var(--red-500)' : '#fff' },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{s.label}</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: s.color || '#fff' }}>{s.val}</div>
                    </div>
                  ))}
                </div>

                {/* Berth Cards Visualization */}
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Berth Allocation Grid</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {sc.berths.map((b, i) => {
                    const statusColor = b.color === 'green' ? 'var(--green-500)' : b.color === 'red' ? 'var(--red-500)' : b.color === 'orange' ? 'var(--accent)' : 'var(--text-muted)';
                    const statusBg = b.color === 'green' ? 'rgba(34,197,94,0.1)' : b.color === 'red' ? 'rgba(239,68,68,0.1)' : b.color === 'orange' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)';
                    return (
                      <div key={i} className="card" style={{ padding: '16px', background: statusBg, borderColor: `rgba(255,255,255,0.08)`, transition: 'all 0.3s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{b.name}</span>
                          <span className="badge" style={{ background: statusColor, color: '#111', fontWeight: 700, fontSize: '10px', padding: '2px 8px' }}>
                            {b.status.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Current Vessel:</span>
                            <span style={{ fontWeight: 600, color: b.vessel !== '-' ? '#fff' : 'rgba(255,255,255,0.3)' }}>{b.vessel}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Release Time:</span>
                            <span style={{ fontWeight: 600, color: b.release !== '-' ? 'var(--accent)' : 'rgba(255,255,255,0.3)' }}>{b.release}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Incoming Vessel Queue */}
            <div className="panel">
              <div className="panel-header">
                <span className="section-title">Incoming Vessel Queue (Next 12 Hours)</span>
              </div>
              <div className="panel-body" style={{ padding: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Vessel Name</th>
                      <th>ETA</th>
                      <th>Cargo Type</th>
                      <th>Priority</th>
                      <th>Assigned Berth</th>
                      <th>Est. Dock Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sc.queue.map((q, i) => {
                      const priorityBadge = q.priority === 'Critical' ? 'badge-red' : q.priority === 'High' ? 'badge-amber' : q.priority === 'Normal' ? 'badge-blue' : 'badge-gray';
                      return (
                        <tr key={i}>
                          <td style={{ fontWeight: 700, color: '#fff' }}>
                            <span style={{ marginRight: '6px' }}>🚢</span>
                            {q.name}
                          </td>
                          <td>{q.eta}</td>
                          <td style={{ fontSize: '12px' }}>{q.cargo}</td>
                          <td>
                            <span className={`badge ${priorityBadge}`}>{q.priority}</span>
                          </td>
                          <td style={{ fontWeight: 600, color: q.berth.includes('Rerouted') ? 'var(--red-500)' : 'var(--accent)' }}>{q.berth}</td>
                          <td>{q.dockTime}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live AI Decision Panel */}
            <div className="panel" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
              <div className="panel-header" style={{ background: 'rgba(245,158,11,0.03)', borderBottom: '1px solid rgba(245,158,11,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ animation: 'pulse 1.5s infinite' }}>🤖</span>
                  <span className="section-title" style={{ color: 'var(--accent)' }}>Smart Berth Agent</span>
                </div>
              </div>
              <div className="panel-body">
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Autonomous Allocation Decision</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{sc.aiDecision.decision}</div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                  <strong style={{ color: '#fff' }}>Agent Reasoning:</strong> {sc.aiDecision.reason}
                </div>

                {/* Criteria Evaluated checklist */}
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>Evaluation Checklist:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {[
                    { label: 'Cargo Urgency', val: sc.aiDecision.criteria.cargoUrgency },
                    { label: 'Crane Availability', val: sc.aiDecision.criteria.craneAvail },
                    { label: 'Customs Readiness', val: sc.aiDecision.criteria.customsReady },
                    { label: 'Weather Conditions', val: sc.aiDecision.criteria.weather },
                  ].map((cr, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11.5px' }}>
                      <span style={{ color: 'var(--green-500)' }}>✓</span>
                      <div>
                        <span style={{ fontWeight: 600, color: '#fff' }}>{cr.label}:</span>{' '}
                        <span style={{ color: 'var(--text-secondary)' }}>{cr.val}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Confidence Bar */}
                <div>
                  <div style={{ display: 'flex', justifyStyle: 'space-between', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Decision Confidence</span>
                    <span style={{ color: 'var(--accent)' }}>{sc.aiDecision.confidence}%</span>
                  </div>
                  <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${sc.aiDecision.confidence}%`, background: 'linear-gradient(90deg, var(--accent), #D97706)', borderRadius: '3px', transition: 'width 0.5s ease-in-out' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Port Heatmap / Rerouting Animation */}
            <div className="panel">
              <div className="panel-header">
                <span className="section-title">Yokohama Port Utilization Heatmap</span>
              </div>
              <div className="panel-body">
                {simMode === 'typhoon' ? (
                  <div style={{ padding: '4px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '18px', color: 'var(--red-500)', animation: 'pulse 1s infinite' }}>🌀</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>TYPHOON KIRA: ACTIVE REROUTING MAP</span>
                    </div>
                    {/* Beautiful SVG Animation */}
                    <svg viewBox="0 0 300 150" style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {/* Port of Yokohama (Blocked) */}
                      <circle cx="230" cy="45" r="7" fill="#ef4444" style={{ animation: 'pulse 1.5s infinite' }} />
                      <text x="230" y="30" fill="#fca5a5" fontSize="8" fontWeight="800" textAnchor="middle">Yokohama (Closed)</text>
                      
                      {/* Alternate Ports */}
                      <circle cx="50" cy="50" r="5" fill="#22c55e" />
                      <text x="50" y="40" fill="#86efac" fontSize="8" textAnchor="middle">Nagoya</text>
                      
                      {/* Kobe */}
                      <circle cx="90" cy="110" r="5" fill="#22c55e" />
                      <text x="90" y="100" fill="#86efac" fontSize="8" textAnchor="middle">Kobe</text>
                      
                      {/* Osaka */}
                      <circle cx="150" cy="120" r="5" fill="#22c55e" />
                      <text x="150" y="132" fill="#86efac" fontSize="8" textAnchor="middle">Osaka</text>
                      
                      {/* Rerouting paths */}
                      <path d="M 220 48 Q 135 25 58 48" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" strokeDasharray="4,4" />
                      <path d="M 220 48 Q 155 85 96 107" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" strokeDasharray="4,4" />
                      <path d="M 220 48 Q 190 95 155 116" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" strokeDasharray="4,4" />

                      {/* Rerouting ships */}
                      {/* Ship 1 to Nagoya */}
                      <text x="0" y="4" fontSize="11">
                        🚢
                        <animateMotion dur="4.2s" repeatCount="indefinite" path="M 220 48 Q 135 25 58 48" />
                      </text>
                      {/* Ship 2 to Kobe */}
                      <text x="0" y="4" fontSize="11">
                        🚢
                        <animateMotion dur="5.5s" repeatCount="indefinite" path="M 220 48 Q 155 85 96 107" />
                      </text>
                      {/* Ship 3 to Osaka */}
                      <text x="0" y="4" fontSize="11">
                        🚢
                        <animateMotion dur="6.8s" repeatCount="indefinite" path="M 220 48 Q 190 95 155 116" />
                      </text>
                    </svg>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'center', lineHeight: 1.4 }}>
                      Yokohama Terminal operations suspended. Vessels automatically rerouted to Kobe, Nagoya & Osaka ports.
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { zone: 'Anchorage Zone A (Inbound)', status: sc.heatmap.anchorage },
                        { zone: 'Main Shipping Channel', status: sc.heatmap.channel },
                        { zone: 'Terminals 1 & 2 (Berths A-B)', status: sc.heatmap.terminal1 },
                        { zone: 'Terminals 3 & 4 (Berths C-D)', status: sc.heatmap.terminal2 },
                        { zone: 'Storage Yard & Intermodal Slots', status: sc.heatmap.storage },
                      ].map((zn, i) => {
                        const zoneColor = zn.status === 'low' ? 'var(--green-500)' : zn.status === 'medium' ? 'var(--accent)' : 'var(--red-500)';
                        const zoneColorText = zn.status === 'low' ? 'Low Congestion' : zn.status === 'medium' ? 'Medium Congestion' : 'High Congestion';
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: zoneColor }} />
                              <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{zn.zone}</span>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: zoneColor }}>{zoneColorText}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '12px', textAlign: 'center' }}>
                      🟢 Low utilization (&lt;50%) | 🟡 Alert: Moderate volume | 🔴 Delayed: Capacity limit exceeded
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  },

  // ── VESSELS PAGE ───────────────────────────────────────────────────────────
  Vessels: () => {
    return (
      <div className="vessels-grid anim-fade-up">
        {MOCK_VESSELS.map(v => (
          <div key={v.name} className="vessel-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{v.name}</h3>
              <span className="badge badge-teal">{v.status}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Current Route:</span>
                <span>{v.route}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cruising Speed:</span>
                <span>{v.speed}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cargo Load:</span>
                <span>{v.load}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },

  // ── DISRUPTIONS PAGE ───────────────────────────────────────────────────────
  Disruptions: () => {
    return (
      <div className="panel anim-fade-up">
        <div className="panel-header">
          <span className="section-title">Disruption Log & Network Impact</span>
        </div>
        <div className="panel-body" style={{ padding: 24 }}>
          <div className="timeline">
            {MOCK_DISRUPTIONS.map((d, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-line" />
                <div className="timeline-dot" style={{ background: d.severity === 'Critical' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: d.severity === 'Critical' ? 'var(--red-500)' : 'var(--amber-500)' }}>
                  ⚠
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{d.type} ({d.location})</span>
                    <span className={`badge ${d.severity === 'Critical' ? 'badge-red' : 'badge-amber'}`}>{d.severity}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>{d.impact}</p>
                  <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>Status: <strong style={{ color: d.status === 'Resolved' ? 'var(--green-500)' : 'var(--amber-500)' }}>{d.status}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },

  // ── ANALYTICS PAGE ─────────────────────────────────────────────────────────
  Analytics: () => {
    const perfData = [
      { name: 'Jan', target: 98, actual: 97 },
      { name: 'Feb', target: 98, actual: 96 },
      { name: 'Mar', target: 98, actual: 95 },
      { name: 'Apr', target: 98, actual: 98 },
      { name: 'May', target: 98, actual: 99 },
      { name: 'Jun', target: 98, actual: 98.4 },
    ];
    const carbonData = [
      { name: 'Maritime Route', emissions: 1200 },
      { name: 'Hybrid Route', emissions: 750 },
      { name: 'DB Cargo Slot', emissions: 220 },
      { name: 'JR Freight Rail', emissions: 180 },
    ];
    return (
      <div className="anim-fade-up">
        <div className="chart-grid">
          <div className="chart-card">
            <div className="chart-title">On-Time Delivery Performance</div>
            <div className="chart-sub">Operational rate vs SLA targets</div>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={perfData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.2)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'var(--navy-800)', border: '1px solid var(--border)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="var(--teal-500)" strokeWidth={2} name="Actual ETA %" />
                  <Line type="monotone" dataKey="target" stroke="var(--text-muted)" strokeDasharray="3 3" name="SLA Target %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-title">Carbon Footprint Analysis (CO₂ kg/TEU)</div>
            <div className="chart-sub">Emission comparison by logistics mode</div>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carbonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,95,0.2)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'var(--navy-800)', border: '1px solid var(--border)' }} />
                  <Bar dataKey="emissions" fill="var(--blue-500)" radius={[4, 4, 0, 0]} name="CO₂ Emissions">
                    {carbonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--red-500)' : index === 1 ? 'var(--amber-500)' : 'var(--green-500)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  },

  // ── USERS PAGE ─────────────────────────────────────────────────────────────
  Users: () => {
    const [users, setUsers] = useState([
      { id: 1, name: 'Admin User', email: 'admin@cargoverse.io', role: 'Admin', company: 'CARGOVerse HQ' },
      { id: 2, name: 'John Doe', email: 'user@cargoverse.io', role: 'User', company: 'Global Shipping Co.' },
      { id: 3, name: 'Sarah Tanaka', email: 'sarah@maersktanaka.com', role: 'User', company: 'Maersk Tanaka Ltd.' },
      { id: 4, name: 'Marcus Weber', email: 'mweber@hapaglloy.de', role: 'Manager', company: 'Hapag-Lloyd AG' },
    ]);
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [nu, setNu] = useState({ name: '', email: '', role: 'User', company: '' });

    const filtered = users.filter(u =>
      !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.company.toLowerCase().includes(search.toLowerCase())
    );

    const addUser = () => {
      if (!nu.name.trim() || !nu.email.trim()) return;
      setUsers(prev => [...prev, { id: Date.now(), ...nu }]);
      setShowAdd(false);
      setNu({ name: '', email: '', role: 'User', company: '' });
    };

    const saveEdit = () => {
      setUsers(prev => prev.map(u => u.id === editUser.id ? editUser : u));
      setEditUser(null);
    };

    const deleteUser = (id) => {
      if (window.confirm('Delete this user account permanently?'))
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    const UserModal = ({ title, data, setData, onSubmit, onClose }) => (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="panel" style={{ width: 440, animation: 'scaleIn 0.25s ease' }}>
          <div className="panel-header">
            <span className="section-title">{title}</span>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input className="form-input" placeholder="Jane Smith" value={data.name} onChange={e => setData(p => ({...p, name: e.target.value}))} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address *</label>
              <input className="form-input" type="email" placeholder="jane@company.com" value={data.email} onChange={e => setData(p => ({...p, email: e.target.value}))} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Company</label>
              <input className="form-input" placeholder="Acme Shipping Ltd." value={data.company} onChange={e => setData(p => ({...p, company: e.target.value}))} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Platform Role</label>
              <select className="form-input" value={data.role} onChange={e => setData(p => ({...p, role: e.target.value}))}>
                <option>Admin</option><option>Manager</option><option>User</option><option>Viewer</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={onSubmit}>✓ Save</button>
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="anim-fade-up">
        {showAdd && <UserModal title="👤 Add New User" data={nu} setData={setNu} onSubmit={addUser} onClose={() => setShowAdd(false)} />}
        {editUser && <UserModal title="✏ Edit User" data={editUser} setData={setEditUser} onSubmit={saveEdit} onClose={() => setEditUser(null)} />}

        <div className="panel">
          <div className="panel-header">
            <span className="section-title">User Account Directory ({filtered.length} users)</span>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  placeholder="🔍  Search users..."
                  style={{ padding: '7px 14px', width: 200, fontSize: 12 }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14 }}>✕</button>
                )}
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>➕ Add User</button>
            </div>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Full Name</th><th>Email Address</th><th>Company</th><th>Platform Role</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'rgba(255,255,255,0.3)' }}>No users match your search.</td></tr>
                )}
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: u.role === 'Admin' ? 'var(--accent)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: u.role === 'Admin' ? '#111' : '#fff', flexShrink: 0 }}>
                          {u.name[0]}
                        </div>
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'rgba(255,255,255,0.7)' }}>{u.email}</td>
                    <td>{u.company || '—'}</td>
                    <td>
                      <span className={`badge ${u.role === 'Admin' ? 'badge-amber' : u.role === 'Manager' ? 'badge-blue' : 'badge-gray'}`}>{u.role}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', fontSize: 12 }}
                          onClick={() => setEditUser({...u})}>✏ Edit</button>
                        <button className="btn btn-danger btn-sm" style={{ padding: '4px 10px', fontSize: 12 }}
                          onClick={() => deleteUser(u.id)}>🗑 Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  },

  // ── REPORTS PAGE ───────────────────────────────────────────────────────────
  Reports: () => {
    const REPORTS = [
      {
        title: 'Global Carbon Compliance Report (ETS)',
        desc: 'Detailed emissions audit and carbon taxation projection metrics.',
        date: 'Q2 2026',
        icon: '🌿',
        data: [
          ['Vessel','Route','CO2 (kg)','ETS Cost ($ / ₹)','Offset Credits'],
          ['Atlas Mariner','Shanghai→LA','48,200','$10,500 / ₹8,75,000','12 credits'],
          ['Oceanic Pioneer','Singapore→Rotterdam','61,800','$13,400 / ₹11,16,000','18 credits'],
          ['Pacific Sovereign','Busan→Seattle','39,400','$8,600 / ₹7,16,000','10 credits'],
          ['Nova Express','Yokohama→Hamburg','52,100','$11,300 / ₹9,41,000','14 credits'],
          ['Polaris Voyager','Lagos→Rotterdam','44,700','$9,700 / ₹8,08,000','11 credits'],
          ['','TOTAL','246,200 kg','$53,500 / ₹44,56,000','65 credits'],
        ]
      },
      {
        title: 'Network Disruption Resiliency Audit',
        desc: 'Autonomous rerouting performance and downtime recovery timeline analysis.',
        date: 'May 2026',
        icon: '⚡',
        data: [
          ['Event','Type','Vessels Affected','Recovery Time','ETA Accuracy'],
          ['Typhoon Kira','Weather','14','5.9 min','98.4%'],
          ['Rotterdam Strike','Port Closure','22','4.8 min','96.8%'],
          ['Red Sea Crisis','Geopolitical','31','5.4 min','99.1%'],
          ['Yokohama Quake','Earthquake','8','5.4 min','97.2%'],
          ['','AVG / TOTAL','18.75','5.4 min','97.9%'],
        ]
      },
      {
        title: 'Port Congestion & Dwell Optimization',
        desc: 'Throughput optimization metrics for Singapore, Shanghai and LA terminals.',
        date: 'June 2026',
        icon: '🏗',
        data: [
          ['Port','Capacity (TEU)','Utilization','Avg Dwell (hrs)','Congestion Rating'],
          ['Port of Singapore','85,000','72%','18.4 hrs','Normal'],
          ['Port of Shanghai','120,000','81%','22.1 hrs','Normal'],
          ['Port of Rotterdam','95,000','68%','38.2 hrs','Congested'],
          ['Port of Los Angeles','75,000','85%','44.6 hrs','Critical'],
          ['Port of Hamburg','60,000','55%','16.8 hrs','Normal'],
        ]
      },
      {
        title: 'Customs Manifest Pre-Clearance Audit',
        desc: 'Analysis of automated clearance rates, dwell reductions, and AEO performance.',
        date: 'Q1 2026',
        icon: '📋',
        data: [
          ['Container','Route','Cargo','Pre-Cleared','Clearance Time'],
          ['CT-9081','Singapore→Rotterdam','Pharma','Yes','18 min'],
          ['CT-4402','Shanghai→Los Angeles','Electronics','Yes','22 min'],
          ['CT-7731','Yokohama→Hamburg','Hazmat','No (Flagged)','48 hrs'],
          ['CT-2091','Mumbai→Singapore','Textiles','Yes','14 min'],
          ['CT-5510','Lagos→Rotterdam','Produce','Yes','19 min'],
          ['CT-8812','Busan→Los Angeles','Auto Parts','Yes','16 min'],
        ]
      },
      {
        title: 'Network Disruption Resiliency Audit',
        desc: 'Visual logs of AI-driven rerouting during Typhoon Kira and associated port congestion.',
        date: 'June 2026',
        icon: '📸',
        auditImages: true,
        data: [
          ['Zone', 'Original ETA Delay', 'AI Action Taken', 'New ETA (After)'],
          ['Yokohama Approach', '+48 Hours', 'Rerouted 14 vessels to Kobe', 'On Time'],
          ['Singapore Anchorage', '+24 Hours', 'Pre-cleared Customs for 3 vessels', '+2 Hours'],
          ['Rotterdam Terminals', '+72 Hours', 'Activated Rail Cargo Bridge', '+12 Hours'],
        ]
      }
    ];

    const downloadCSV = (report) => {
      const csv = report.data.map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const downloadPDF = (report) => {
      const tableRows = report.data.slice(1).map(row =>
        `<tr>${row.map((cell, i) => `<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:${i===0?700:400};color:${i===0?'#1e293b':'#374151'}">${cell}</td>`).join('')}</tr>`
      ).join('');
      const thead = report.data[0].map(h => `<th style="padding:10px 12px;background:#1e293b;color:#fff;text-align:left;font-size:12px;text-transform:uppercase">${h}</th>`).join('');
      const imageSection = report.auditImages ? `
        <div style="margin: 30px 0;">
          <h2 style="font-size: 18px; color: #1e293b; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Visual Audit Trail: Port Congestion Resolution</h2>
          <div style="display:flex; gap:20px; margin-top:16px;">
            <div style="flex:1;">
              <h3 style="font-size: 14px; margin-bottom: 8px;">Before: Congested Traffic</h3>
              <img src="${window.location.origin}${beforeImg}" style="width:100%; border-radius:8px; border: 1px solid #cbd5e1;" alt="Before" />
            </div>
            <div style="flex:1;">
              <h3 style="font-size: 14px; margin-bottom: 8px;">After: AI Rerouted & Cleared</h3>
              <img src="${window.location.origin}${afterImg}" style="width:100%; border-radius:8px; border: 1px solid #cbd5e1;" alt="After" />
            </div>
          </div>
        </div>
      ` : '';

      const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${report.title}</title>
<style>body{font-family:Arial,sans-serif;margin:40px;color:#1e293b}h1{font-size:22px;margin-bottom:6px}p{color:#6b7280;font-size:14px;margin-bottom:24px}table{width:100%;border-collapse:collapse}th{letter-spacing:0.5px}</style>
</head><body>
<div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
  <span style="font-size:28px">${report.icon}</span>
  <h1>${report.title}</h1>
</div>
<p>${report.desc} &nbsp;|&nbsp; Report Period: ${report.date} &nbsp;|&nbsp; Generated: ${new Date().toLocaleDateString()}</p>
<table><thead><tr>${thead}</tr></thead><tbody>${tableRows}</tbody></table>
${imageSection}
<p style="margin-top:32px;font-size:12px;color:#9ca3af">Generated by CARGOVerse — Autonomous Logistics Intelligence Platform</p>
</body></html>`;
      const blob = new Blob([html], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="panel">
          <div className="panel-header">
            <span className="section-title">Exportable Logistics Reports</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{REPORTS.length} reports available — click to download PDF or CSV</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {REPORTS.map((r, i) => (
            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{r.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{r.title}</span>
                </div>
                <span className="badge badge-teal" style={{ flexShrink: 0 }}>{r.date}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.desc}</p>
              {/* Preview table */}
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 12px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                  <thead>
                    <tr>
                      {r.data[0].map((h, j) => (
                        <th key={j} style={{ textAlign: 'left', padding: '4px 8px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {r.data.slice(1, 4).map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} style={{ padding: '5px 8px', color: ci === 0 ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: ci === 0 ? 600 : 400, borderTop: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Visual Audit Preview */}
              {r.auditImages && (
                <div style={{ marginTop: 8, display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Before</div>
                    <img src={beforeImg} alt="Before" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>After (AI Resolved)</div>
                    <img src={afterImg} alt="After" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }} />
                  </div>
                </div>
              )}
                {r.data.length > 4 && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6, paddingLeft: 8 }}>{r.data.length - 2} rows total in full export</div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => downloadPDF(r)}
                >📄 Download PDF</button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => downloadCSV(r)}
                >📊 Export CSV</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },

  // ── SETTINGS PAGE ──────────────────────────────────────────────────────────
  Settings: () => {
    return (
      <div className="panel anim-fade-up" style={{ maxWidth: 600 }}>
        <div className="panel-header">
          <span className="section-title">Global Platform Settings</span>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input className="form-input" defaultValue="CARGOVerse HQ" />
          </div>
          <div className="form-group">
            <label className="form-label">System Notification Email</label>
            <input className="form-input" defaultValue="ops@cargoverse.io" />
          </div>
          <div className="form-group">
            <label className="form-label">Primary Route Optimization Metric</label>
            <select className="form-input">
              <option>Lowest Total Transit Time</option>
              <option>Lowest CO₂ Emissions (Carbon-Aware)</option>
              <option>Balanced Cost vs Duration</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button className="btn btn-primary" onClick={() => window.alert('✅ Settings saved successfully!')}>Save Changes</button>
            <button className="btn btn-secondary" onClick={() => window.alert('Changes discarded.')}>Discard</button>
          </div>
        </div>
      </div>
    );
  },

  // ── SUPPORT TICKETS PAGE ──────────────────────────────────────────────────
  SupportTickets: () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchTickets = () => {
      fetch('http://localhost:8000/api/support')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setTickets(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch tickets:", err);
          setLoading(false);
        });
    };

    useEffect(() => {
      fetchTickets();
      const interval = setInterval(fetchTickets, 5000);
      return () => clearInterval(interval);
    }, []);

    const toggleResolve = (id) => {
      fetch(`http://localhost:8000/api/support/${id}/resolve`, {
        method: 'POST'
      })
        .then(res => res.json())
        .then(data => {
          fetchTickets();
        })
        .catch(err => console.error("Failed to toggle resolve:", err));
    };

    const filtered = tickets.filter(t => 
      !search || 
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.message.toLowerCase().includes(search.toLowerCase()) ||
      t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.company.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="anim-fade-up">
        <div className="panel">
          <div className="panel-header">
            <span className="section-title">Client Support Tickets ({filtered.length})</span>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                placeholder="🔍 Search tickets..."
                style={{ padding: '7px 14px', width: 220, fontSize: 12 }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14 }}>✕</button>
              )}
            </div>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading tickets database...</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>ID</th>
                    <th style={{ width: 140 }}>User / Company</th>
                    <th>Ticket Details</th>
                    <th style={{ width: 130 }}>Date Raised</th>
                    <th style={{ width: 100 }}>Status</th>
                    <th style={{ width: 120 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'rgba(255,255,255,0.3)' }}>No support tickets found.</td>
                    </tr>
                  )}
                  {filtered.map(t => (
                    <tr key={t.id}>
                      <td><strong style={{ color: 'var(--teal-500)' }}>#{t.id}</strong></td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{t.user}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{t.company}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: '#fff' }}>{t.subject}</div>
                        <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4, margin: 0 }}>{t.message}</p>
                      </td>
                      <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{t.date}</td>
                      <td>
                        <span className={`badge ${t.status === 'Resolved' ? 'badge-green' : 'badge-amber'}`}>{t.status}</span>
                      </td>
                      <td>
                        <button 
                          className={`btn ${t.status === 'Resolved' ? 'btn-secondary' : 'btn-primary'} btn-sm`} 
                          style={{ padding: '4px 10px', fontSize: 12, width: '100%', justifyContent: 'center' }}
                          onClick={() => toggleResolve(t.id)}
                        >
                          {t.status === 'Resolved' ? '🔓 Reopen' : '✓ Resolve'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default AdminPages;
