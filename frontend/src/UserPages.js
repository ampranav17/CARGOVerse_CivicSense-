import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './App';
import beforeImg from './before.png';
import afterImg from './after.png';

// ── Mock Shipment Data ────────────────────────────────────────────────────────
const USER_SHIPMENTS = [
  { id: 'SH-8201', type: 'Electronics', origin: 'Shanghai, CN', dest: 'Los Angeles, USA', status: 'At Sea', eta: '2026-06-21', vessel: 'Atlas Mariner', speed: '21.5 kts' },
  { id: 'SH-4590', type: 'Medical Equipment', origin: 'Singapore, SG', dest: 'Rotterdam, NL', status: 'In Transit (Rail Bridge)', eta: '2026-06-18', vessel: 'Oceanic Pioneer', speed: 'N/A' },
  { id: 'SH-7721', type: 'Perishables', origin: 'Lagos, NG', dest: 'Hamburg, DE', status: 'Port Cleared', eta: '2026-06-15', vessel: 'Polaris Voyager', speed: '0.0 kts' },
];

const USER_ALERTS = [
  { id: 1, type: 'Weather Delay', text: 'Typhoon Mawar is causing reroutes near South China Sea. SH-8201 ETA adjusted by +12 hours.', time: '10 min ago', critical: true },
  { id: 2, type: 'Customs Pre-Clearance', text: 'Pre-clearance manifest successfully generated for SH-7721. Direct dispatch at Hamburg.', time: '2 hours ago', critical: false },
  { id: 3, type: 'Booking Confirmed', text: 'Intermodal DB Cargo rail slot confirmed for container CT-4590.', time: '1 day ago', critical: false },
];

const USER_DOCS = [
  { name: 'Commercial_Invoice_SH-8201.pdf', type: 'Invoice', date: '2026-06-10', size: '2.4 MB', status: 'Verified' },
  { name: 'Bill_of_Lading_SH-4590.pdf', type: 'Bill of Lading', date: '2026-06-11', size: '1.8 MB', status: 'Verified' },
  { name: 'Customs_Manifest_SH-7721.xml', type: 'Customs Declaration', date: '2026-06-12', size: '420 KB', status: 'Pending Review' },
  { name: 'Disruption_Audit_Visuals.pdf', type: 'Visual Report', date: '2026-06-13', size: '3.1 MB', status: 'Verified' },
];

const UserPages = {
  // ── USER HOME PAGE ─────────────────────────────────────────────────────────
  Home: () => {
    return (
      <div className="anim-fade-up">
        {/* Critical Alerts Banner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {USER_ALERTS.filter(a => a.critical).map(a => (
            <div key={a.id} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '14px 20px', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', fontSize: 13, marginBottom: 2 }}>🚨 {a.type}</strong>
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{a.text}</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{a.time}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          {/* Active Shipments Card */}
          <div className="panel">
            <div className="panel-header">
              <span className="section-title">Active Shipments Overview</span>
              <span className="badge badge-teal">Live tracking</span>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {USER_SHIPMENTS.map(s => (
                <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 18 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, color: 'var(--teal-500)', fontSize: 14 }}>{s.id}</span>
                      <span className="badge badge-gray">{s.type}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {s.origin} ➔ {s.dest}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{s.status}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ETA: {s.eta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="panel">
              <div className="panel-header">
                <span className="section-title">Cargo Status</span>
              </div>
              <div className="panel-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>In Transit</span>
                    <span style={{ fontWeight: 600 }}>2 Containers</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Pending Customs</span>
                    <span style={{ fontWeight: 600 }}>1 Container</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Delivered (Month)</span>
                    <span style={{ fontWeight: 600, color: 'var(--teal-500)' }}>14 TEU</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <span className="section-title">Documents Status</span>
              </div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {USER_DOCS.slice(0, 2).map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }} title={d.name}>{d.name}</span>
                    <span className="badge badge-green">{d.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  // ── MY SHIPMENTS PAGE ──────────────────────────────────────────────────────
  Shipments: () => {
    const navigate = useNavigate();
    return (
      <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {USER_SHIPMENTS.map(s => (
          <div key={s.id} className="shipment-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>SHIPMENT ID</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--teal-500)' }}>{s.id}</div>
              </div>
              <span className="badge badge-teal" style={{ padding: '6px 12px' }}>{s.status}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, padding: '6px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Route:</span>
                <span>{s.origin} ➔ {s.dest}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cargo Class:</span>
                <span>{s.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Vessel / Carrier:</span>
                <span>{s.vessel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Expected Arrival (ETA):</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.eta}</span>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate(`/dashboard/tracking?id=${s.id}`)}>Track Shipment</button>
          </div>
        ))}
      </div>
    );
  },

  // ── TRACKING PAGE ──────────────────────────────────────────────────────────
  Tracking: () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const shipmentId = searchParams.get('id') || 'SH-8201';
    const shipment = USER_SHIPMENTS.find(s => s.id === shipmentId) || USER_SHIPMENTS[0];

    // Detailed coordinates and paths for shipping routes (OpenStreetMap via Leaflet)
    const SHIPMENT_ROUTES = {
      'SH-8201': {
        origin: { lat: 31.23, lng: 121.47, label: 'Shanghai Port, CN' },
        dest: { lat: 33.73, lng: 241.74, label: 'Port of Los Angeles, USA' }, // Wrap longitude to draw across Pacific cleanly
        vesselCoord: { lat: 35.5, lng: 175.0, label: 'Atlas Mariner (At Sea)' },
        path: [
          [31.23, 121.47],   // Shanghai
          [34.5, 139.8],     // Near Tokyo, JP
          [35.5, 175.0],     // Current Location (At Sea)
          [38.0, 190.0],     // Mid Pacific East
          [38.0, 215.0],     // Off West Coast US
          [33.73, 241.74]    // LA Port
        ]
      },
      'SH-4590': {
        origin: { lat: 1.35, lng: 103.82, label: 'Port of Singapore, SG' },
        dest: { lat: 51.92, lng: 4.48, label: 'Port of Rotterdam, NL' },
        vesselCoord: { lat: 30.0, lng: 32.5, label: 'Oceanic Pioneer (Suez Canal)' },
        path: [
          [1.35, 103.82],    // Singapore
          [6.0, 80.0],       // Sri Lanka
          [12.0, 48.0],      // Gulf of Aden
          [30.0, 32.5],      // Suez Canal (Current)
          [36.0, 15.0],      // Mid Mediterranean
          [36.0, -5.3],      // Gibraltar
          [48.0, -5.0],      // Off Brest, FR
          [51.92, 4.48]      // Rotterdam
        ]
      },
      'SH-7721': {
        origin: { lat: 6.45, lng: 3.39, label: 'Port of Lagos, NG' },
        dest: { lat: 53.55, lng: 9.99, label: 'Port of Hamburg, DE' },
        vesselCoord: { lat: 53.55, lng: 9.99, label: 'Polaris Voyager (Port Cleared)' },
        path: [
          [6.45, 3.39],      // Lagos
          [-4.0, -10.0],     // Guinea Basin
          [15.0, -20.0],     // Off Senegal
          [38.0, -12.0],     // Off Portugal
          [48.0, -6.0],      // Bay of Biscay
          [50.5, -1.0],      // English Channel
          [53.55, 9.99]      // Hamburg (Current)
        ]
      }
    };

    const routeData = SHIPMENT_ROUTES[shipment.id] || SHIPMENT_ROUTES['SH-8201'];

    // Create custom Leaflet map HTML content to be loaded inside the iframe
    const mapSrcDoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
        <style>
          html, body, #map {
            height: 100%;
            margin: 0;
            padding: 0;
            background: #ffffff;
          }
          .leaflet-container {
            background: #ffffff !important;
          }
          .custom-div-icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          @keyframes pulse-green {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(20, 184, 166, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(20, 184, 166, 0); }
          }
          @keyframes pulse-vessel {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
          }
          .dest-dot {
            background: #14b8a6;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid #0f172a;
            animation: pulse-green 2s infinite;
          }
          .origin-dot {
            background: #ef4444;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 2px solid #0f172a;
          }
          .vessel-dot {
            background: #f59e0b;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid #0f172a;
            animation: pulse-vessel 1.5s infinite;
          }
          /* Custom style for Leaflet Popups to match a clean light map theme */
          .leaflet-popup-content-wrapper {
            background: #ffffff !important;
            color: #0f172a !important;
            border: 1px solid rgba(15, 23, 42, 0.15);
            border-radius: 8px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .leaflet-popup-tip {
            background: #ffffff !important;
            border: 1px solid rgba(15, 23, 42, 0.15);
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            zoomControl: true,
            attributionControl: false
          });

          // Light Map Tiles
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
          }).addTo(map);

          const origin = [${routeData.origin.lat}, ${routeData.origin.lng}];
          const dest = [${routeData.dest.lat}, ${routeData.dest.lng}];
          const vessel = [${routeData.vesselCoord.lat}, ${routeData.vesselCoord.lng}];

          // 1. Origin Marker
          const originMarker = L.marker(origin, {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: '<div class="origin-dot" title="Origin Port"></div>',
              iconSize: [10, 10],
              iconAnchor: [5, 5]
            })
          }).addTo(map).bindPopup("<b>Origin:</b><br>${routeData.origin.label}");

          // 2. Destination Marker
          const destMarker = L.marker(dest, {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: '<div class="dest-dot" title="Destination Port"></div>',
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            })
          }).addTo(map).bindPopup("<b>Destination:</b><br>${routeData.dest.label}");

          // 3. Current Vessel Marker (Yellow Pulse)
          const vesselMarker = L.marker(vessel, {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: '<div class="vessel-dot" title="Current Vessel Location"></div>',
              iconSize: [14, 14],
              iconAnchor: [7, 7]
            })
          }).addTo(map).bindPopup("<b>Current Location:</b><br>${routeData.vesselCoord.label}<br>Speed: ${shipment.speed || 'N/A'}");

          // 4. Dashed Route Line
          const pathCoords = ${JSON.stringify(routeData.path)};
          const route = L.polyline(pathCoords, {
            color: '#0d9488',
            weight: 3,
            opacity: 0.8,
            dashArray: '5, 8'
          }).addTo(map);

          // Fit view bounds to fit all markers
          const group = L.featureGroup([originMarker, destMarker, vesselMarker]);
          map.fitBounds(group.getBounds(), { padding: [50, 50] });

          // Default popups open based on shipment state
          if ('${shipment.status}' === 'Port Cleared' || '${shipment.status}' === 'Delivered') {
            destMarker.openPopup();
          } else {
            vesselMarker.openPopup();
          }
        </script>
      </body>
      </html>
    `;

    // Dynamic milestones based on shipment ID
    const getSteps = (id) => {
      if (id === 'SH-4590') {
        return [
          { label: 'Origin Received',  desc: 'Singapore Terminal 2 Gate-In',        date: '2026-06-08', done: true,  active: false },
          { label: 'Customs Cleared',  desc: 'EDI Declaration Cleared',              date: '2026-06-09', done: true,  active: false },
          { label: 'Loaded on Vessel', desc: 'Oceanic Pioneer Voy-02',               date: '2026-06-10', done: true,  active: false },
          { label: 'Port Discharge',   desc: 'Port of Rotterdam Terminals',          date: '2026-06-12', done: true,  active: false },
          { label: 'Inland Rail Bridge',desc: 'DB Cargo Slot confirmed, on track',  date: '2026-06-13', done: true,  active: true  },
        ];
      } else if (id === 'SH-7721') {
        return [
          { label: 'Origin Received',  desc: 'Lagos Port Terminal Gate-In',         date: '2026-06-05', done: true,  active: false },
          { label: 'Customs Cleared',  desc: 'Pre-clearance manifest generated',    date: '2026-06-07', done: true,  active: false },
          { label: 'Loaded on Vessel', desc: 'Polaris Voyager Voy-70',              date: '2026-06-08', done: true,  active: false },
          { label: 'Port Discharge',   desc: 'Port of Hamburg Gate-Out',            date: '2026-06-12', done: true,  active: false },
          { label: 'Out for Delivery', desc: 'Last-mile inland transit Hamburg S.', date: '2026-06-13', done: true,  active: true  },
        ];
      } else {
        return [
          { label: 'Origin Received',  desc: 'Shanghai Port Terminal Gate-In',      date: '2026-06-10', done: true,  active: false },
          { label: 'Customs Cleared',  desc: 'Export Declaration Cleared',          date: '2026-06-11', done: true,  active: false },
          { label: 'Loaded on Vessel', desc: 'Atlas Mariner Voy-908',               date: '2026-06-12', done: true,  active: true  },
          { label: 'In Transit at Sea',desc: 'Sailing Pacific Passage',             date: 'Pending',    done: false, active: false },
          { label: 'Port Discharge',   desc: 'Port of Los Angeles Terminal 4',      date: 'Pending',    done: false, active: false },
        ];
      }
    };

    const steps = getSteps(shipment.id);

    return (
      <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Live Map */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: 520 }}>
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="section-title">Live Transit Map — {shipment.id}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#22c55e', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', padding: '2px 8px', borderRadius: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                LIVE
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Track:</span>
              <select
                className="form-input"
                style={{ width: 150, padding: '4px 8px', fontSize: 12, background: 'var(--navy-900)' }}
                value={shipment.id}
                onChange={e => setSearchParams({ id: e.target.value })}
              >
                {USER_SHIPMENTS.map(s => (
                  <option key={s.id} value={s.id}>{s.id} — {s.type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="panel-body" style={{ flex: 1, padding: 0, position: 'relative', overflow: 'hidden', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
            <iframe
              key={shipment.id}
              title={`OSM Map — ${shipment.id}`}
              srcDoc={mapSrcDoc}
              loading="lazy"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
            {/* Vessel info overlay */}
            <div style={{ position: 'absolute', bottom: 14, left: 14, background: 'rgba(6,13,26,0.92)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 12, pointerEvents: 'none', backdropFilter: 'blur(8px)', zIndex: 1000 }}>
              <div style={{ color: 'var(--teal-500)', fontWeight: 700, marginBottom: 5 }}>📍 Current Location: {routeData.vesselCoord.label}</div>
              <div style={{ color: 'var(--text-secondary)', marginBottom: 2 }}><strong style={{color:'#fff'}}>Carrier:</strong> {shipment.vessel}</div>
              <div style={{ color: 'var(--text-secondary)', marginBottom: 2 }}><strong style={{color:'#fff'}}>Speed:</strong> {shipment.speed || 'N/A'}</div>
              <div style={{ color: 'var(--text-secondary)' }}><strong style={{color:'#fff'}}>Route:</strong> {shipment.origin} ➔ {shipment.dest}</div>
            </div>
            {/* Map source badge */}
            <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(6,13,26,0.85)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px', fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
              © OpenStreetMap
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: 520 }}>
          <div className="panel-header">
            <span className="section-title">Milestone Timeline</span>
            <span className="badge badge-teal">ETA: {shipment.eta}</span>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
            {steps.map((s, idx) => (
              <div key={idx} className={`tracking-step ${s.done ? 'done' : s.active ? 'active' : 'pending'}`}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
                    <span style={{ color: s.active ? 'var(--accent)' : s.done ? 'var(--teal-500)' : 'var(--text-muted)' }}>
                      {s.done ? '✓ ' : s.active ? '⚡ ' : '○ '}{s.label}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{s.date}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },

  // ── DOCUMENTS PAGE ─────────────────────────────────────────────────────────
  Documents: () => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchDocs = () => {
      fetch('http://localhost:8000/api/documents')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setDocs(data);
          else setDocs(USER_DOCS);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load documents:", err);
          setDocs(USER_DOCS);
          setLoading(false);
        });
    };

    useEffect(() => {
      fetchDocs();
    }, []);

    const triggerUpload = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:8000/api/documents/upload', {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(data => {
            setUploading(false);
            fetchDocs();
          })
          .catch(err => {
            console.error("Upload failed:", err);
            setUploading(false);
            alert("File upload failed. Please try again.");
          });
      };
      input.click();
    };

    const downloadVisualReport = () => {
      const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Disruption Audit Visuals</title>
<style>body{font-family:Arial,sans-serif;margin:40px;color:#1e293b}h1{font-size:22px;margin-bottom:6px}p{color:#6b7280;font-size:14px;margin-bottom:24px}</style>
</head><body>
<div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
  <span style="font-size:28px">📸</span>
  <h1>Disruption Audit Visuals</h1>
</div>
<p>Visual logs of AI-driven rerouting during Typhoon Kira and associated port congestion. &nbsp;|&nbsp; Generated: ${new Date().toLocaleDateString()}</p>
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
<p style="margin-top:32px;font-size:12px;color:#9ca3af">Generated by CARGOVerse Client Portal</p>
</body></html>`;
      const blob = new Blob([html], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `disruption-audit-visuals.html`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const handleDownload = (d) => {
      if (d.type === 'Visual Report') {
        downloadVisualReport();
      } else {
        window.open(`http://localhost:8000/api/documents/download/${encodeURIComponent(d.name)}`);
      }
    };

    return (
      <div className="panel anim-fade-up">
        <div className="panel-header">
          <span className="section-title">Shipment Documents Locker</span>
          <button className="btn btn-primary btn-sm" onClick={triggerUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : '📤 Upload Document'}
          </button>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading secure documents locker...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Classification</th>
                  <th>Upload Date</th>
                  <th>File Size</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td>{d.type}</td>
                    <td>{d.date}</td>
                    <td>{d.size}</td>
                    <td>
                      <span className={`badge ${d.status === 'Verified' ? 'badge-green' : 'badge-amber'}`}>{d.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} onClick={() => handleDownload(d)}>Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  },

  // ── ALERTS PAGE ────────────────────────────────────────────────────────────
  Alerts: () => {
    return (
      <div className="panel anim-fade-up">
        <div className="panel-header">
          <span className="section-title">Logistics Alerts & Notifications</span>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {USER_ALERTS.map(a => (
            <div key={a.id} style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
              <div style={{ fontSize: 22 }}>{a.critical ? '🚨' : 'ℹ️'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: a.critical ? 'var(--red-500)' : 'var(--text-primary)' }}>{a.type}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.time}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },

  // ── MARKETPLACE PAGE ───────────────────────────────────────────────────────
  Marketplace: () => {
    const [dep, setDep] = useState("Port of Rotterdam");
    const [dest, setDest] = useState("Munich Terminal South");
    const [slots, setSlots] = useState([
      { id: 'SLOT-DB1', carrier: 'DB Cargo Europe', route: 'Port of Rotterdam - Munich Terminal South', slots: '14 Slots Available', price: '$350 / ₹29,200', price_usd: 350, price_inr: 29200, co2: '220 kg CO₂ (-78%)', speed: '14 hrs', origin: 'Port of Rotterdam', destination: 'Munich Terminal South' },
      { id: 'SLOT-JR2', carrier: 'JR Freight Asia', route: 'Port of Yokohama - Tokyo Terminal East', slots: '28 Slots Available', price: '$410 / ₹34,200', price_usd: 410, price_inr: 34200, co2: '180 kg CO₂ (-82%)', speed: '4 hrs', origin: 'Port of Yokohama', destination: 'Tokyo Terminal East' }
    ]);
    const [loading, setLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    const handleSearch = () => {
      setLoading(true);
      fetch(`http://localhost:8000/api/rail/search?origin=${encodeURIComponent(dep)}&destination=${encodeURIComponent(dest)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.slots) setSlots(data.slots);
          setLoading(false);
        })
        .catch(err => {
          console.error("Search failed:", err);
          setLoading(false);
        });
    };

    const handleBook = (slot) => {
      fetch('http://localhost:8000/api/rail/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slot)
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setBookingDetails(data.booking);
            setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, slots: "Booked Successfully!" } : s));
          } else {
            alert("Booking failed. Please try again.");
          }
        })
        .catch(err => {
          console.error("Booking failed:", err);
          alert("Error connecting to booking system.");
        });
    };

    return (
      <div className="anim-fade-up">
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Intermodal Slot Brokerage</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Search and book intermodal rail cargo slots (Deutsche Bahn / JR Freight) directly connected to arrival sea routes.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px', gap: 14, alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Departure Port Terminal</label>
              <select className="form-input" style={{ background: 'var(--navy-900)', height: 42 }} value={dep} onChange={e => setDep(e.target.value)}>
                <option value="Port of Rotterdam">Port of Rotterdam</option>
                <option value="Port of Singapore">Port of Singapore</option>
                <option value="Port of Shanghai">Port of Shanghai</option>
                <option value="Port of Yokohama">Port of Yokohama</option>
                <option value="Port of Hamburg">Port of Hamburg</option>
                <option value="Port of Los Angeles">Port of Los Angeles</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Inland Rail Destination</label>
              <select className="form-input" style={{ background: 'var(--navy-900)', height: 42 }} value={dest} onChange={e => setDest(e.target.value)}>
                <option value="Munich Terminal South">Munich Terminal South</option>
                <option value="Tokyo Terminal East">Tokyo Terminal East</option>
                <option value="Chicago Rail Hub">Chicago Rail Hub</option>
                <option value="Duisburg Intermodal Port">Duisburg Intermodal Port</option>
                <option value="Osaka Terminal West">Osaka Terminal West</option>
                <option value="Frankfurt Gateway">Frankfurt Gateway</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ height: 42, width: '100%', justifyContent: 'center' }} onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        <div className="vessels-grid">
          {slots.map((item, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{item.carrier}</span>
                <span className={`badge ${item.slots === 'Booked Successfully!' ? 'badge-green' : 'badge-teal'}`}>{item.slots}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                <div>Route: <strong>{item.route}</strong></div>
                <div>Transit Speed: <strong>{item.speed}</strong></div>
                <div>Carbon Footprint: <strong style={{ color: 'var(--green-500)' }}>{item.co2}</strong></div>
              </div>
              <div style={{ display: 'flex', justifyStyle: 'space-between', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--teal-500)' }}>{item.price} <span style={{fontSize: 10, color: 'var(--text-muted)'}}>/ TEU</span></div>
                <button 
                  className="btn btn-primary btn-sm" 
                  disabled={item.slots === 'Booked Successfully!'} 
                  onClick={() => handleBook(item)}
                >
                  {item.slots === 'Booked Successfully!' ? 'Booked' : 'Book Slot'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {bookingDetails && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="panel" style={{ width: 420, padding: 24, borderRadius: 'var(--radius-lg)', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: 50, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--teal-500)', marginBottom: 8 }}>Booking Confirmed!</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Your intermodal rail slot has been autonomously locked.</p>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: 16, textAlign: 'left', fontSize: 13, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div><strong>Booking ID:</strong> <span style={{ color: 'var(--accent)' }}>{bookingDetails.booking_id}</span></div>
                <div><strong>Carrier:</strong> {bookingDetails.carrier}</div>
                <div><strong>Route:</strong> {bookingDetails.route}</div>
                <div><strong>Transit Time:</strong> {bookingDetails.speed}</div>
                <div><strong>Booking Date:</strong> {bookingDetails.date}</div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setBookingDetails(null)}>Close Window</button>
            </div>
          </div>
        )}
      </div>
    );
  },

  // ── SUPPORT PAGE ───────────────────────────────────────────────────────────
  Support: () => {
    const [subj, setSubj] = useState("");
    const [msg, setMsg] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = () => {
      if (!subj.trim() || !msg.trim()) {
        alert("Please enter subject and details.");
        return;
      }
      setSending(true);
      fetch('http://localhost:8000/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subj, message: msg })
      })
        .then(res => res.json())
        .then(data => {
          setSending(false);
          setSubj("");
          setMsg("");
          alert('Support ticket submitted successfully!');
        })
        .catch(err => {
          console.error("Support ticket submission failed:", err);
          setSending(false);
          alert('Error connecting to support system.');
        });
    };

    return (
      <div className="panel anim-fade-up" style={{ maxWidth: 600 }}>
        <div className="panel-header">
          <span className="section-title">Submit Support Request</span>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input className="form-input" placeholder="e.g. Customs manifest delay at Rotterdam" value={subj} onChange={e => setSubj(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Message Details</label>
            <textarea className="form-input" rows={5} placeholder="Describe your request..." style={{ resize: 'none' }} value={msg} onChange={e => setMsg(e.target.value)} />
          </div>
          <button className="btn btn-primary" style={{ width: 'fit-content' }} onClick={handleSubmit} disabled={sending}>
            {sending ? 'Sending...' : 'Send Ticket'}
          </button>
        </div>
      </div>
    );
  },

  // ── PROFILE PAGE ───────────────────────────────────────────────────────────
  Profile: () => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || "John Doe");
    const [phone, setPhone] = useState(user?.phone || "+1 (555) 123-4567");

    const handleSave = () => {
      const updatedUser = { ...user, name, phone };
      localStorage.setItem('cv_user', JSON.stringify(updatedUser));
      alert('Profile settings saved successfully! Please refresh or navigate to see changes in sidebar.');
    };

    return (
      <div className="panel anim-fade-up" style={{ maxWidth: 600 }}>
        <div className="panel-header">
          <span className="section-title">Client Profile Settings</span>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Company</label>
            <input className="form-input" defaultValue={user?.company || "Global Shipping Co."} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" defaultValue={user?.email || "user@cargoverse.io"} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <button className="btn btn-primary" style={{ width: 'fit-content' }} onClick={handleSave}>Save Profile</button>
        </div>
      </div>
    );
  }
};

export default UserPages;
