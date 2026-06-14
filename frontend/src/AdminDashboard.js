import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './App';
import AdminPages from './AdminPages';

const NAV = [
  { path: '',              icon: '⊞',  label: 'Dashboard',         badge: null },
  { path: 'digital-twin', icon: '🖥',  label: 'Digital Twin',      badge: 'LIVE' },
  { path: 'containers',   icon: '📦',  label: 'Containers',        badge: '28K' },
  { path: 'agent',        icon: '🤖',  label: 'Container Agent',   badge: 'AI' },
  { path: 'cargo-health', icon: '🌡',  label: 'Cargo Health',      badge: null },
  { path: 'reputation',   icon: '⭐',  label: 'Reputation Scores', badge: null },
  { path: 'ports',        icon: '🏗',  label: 'Ports',             badge: null },
  { path: 'vessels',      icon: '🚢',  label: 'Vessels',           badge: null },
  { path: 'disruptions',  icon: '⚡',  label: 'Disruptions',       badge: '3' },
  { path: 'analytics',    icon: '📊',  label: 'Analytics',         badge: null },
  { path: 'users',        icon: '👥',  label: 'Users',             badge: null },
  { path: 'reports',      icon: '📄',  label: 'Reports',           badge: null },
  { path: 'support-tickets', icon: '💬',  label: 'Support Tickets',   badge: null },
  { path: 'settings',     icon: '⚙',  label: 'Settings',          badge: null },
];

const NOTIFICATIONS = [
  { title: '🚨 Typhoon Alert',      body: '14 vessels rerouted — South China Sea.',       time: '2 min ago',  priority: 'high' },
  { title: '📦 Container Pre-cleared', body: 'CT-9081 cleared customs at sea.',           time: '8 min ago',  priority: 'info' },
  { title: '⚡ Port Congestion',    body: 'LA port at 85% — rerouting 6 containers.',     time: '15 min ago', priority: 'medium' },
  { title: '✅ Delivery Confirmed', body: 'CT-2091 discharged at Singapore Terminal 3.',   time: '22 min ago', priority: 'success' },
  { title: '🛂 Customs Flag',       body: 'CT-7731 flagged for secondary inspection.',     time: '41 min ago', priority: 'high' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cur = location.pathname.replace('/admin', '').replace(/^\//, '');
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(3);

  const openNotif = () => { setNotifOpen(o => !o); setUnread(0); };

  return (
    <div className="dash-layout">
      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside className="dash-sidebar">
        {/* Logo */}
        <div className="sidebar-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="sidebar-logo-icon">⚓</div>
          <span className="sidebar-logo-text">CARGOVerse</span>
        </div>

        {/* Admin label */}
        <div className="sidebar-section-label" style={{ paddingLeft: 20 }}>Admin Console</div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV.map(n => (
            <div
              key={n.path}
              className={`sidebar-item${cur === n.path ? ' active' : ''}`}
              onClick={() => navigate(`/admin${n.path ? '/' + n.path : ''}`)}
            >
              <span className="sidebar-icon">{n.icon}</span>
              {n.label}
              {n.badge && <span className="sidebar-badge">{n.badge}</span>}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: '14px 14px 18px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.06)', marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#111', fontWeight: 800, flexShrink: 0 }}>
              {user?.name?.[0] || 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>{user?.name}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Administrator</div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            onClick={() => { logout(); navigate('/'); }}
          >
            ← Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="dash-main">
        {/* Topbar */}
        <header className="dash-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Admin</span>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {NAV.find(n => n.path === cur)?.label || 'Dashboard'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                placeholder="Search containers, vessels..."
                style={{ width: 220, padding: '7px 12px 7px 34px', fontSize: 12, borderRadius: 'var(--radius-md)' }}
              />
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>🔍</span>
            </div>

            {/* Bell */}
            <div className="notif-wrapper">
              <button
                className="btn-icon"
                style={{ fontSize: 18 }}
                onClick={openNotif}
                title="Notifications"
              >
                🔔
              </button>
              {unread > 0 && <div className="notif-dot" />}

              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    Notifications
                    <button
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12 }}
                      onClick={() => setNotifOpen(false)}
                    >✕</button>
                  </div>
                  {NOTIFICATIONS.map((n, i) => (
                    <div key={i} className="notif-item" onClick={() => setNotifOpen(false)}>
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-body">{n.body}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                  ))}
                  <div style={{ padding: '12px 18px', textAlign: 'center' }}>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--accent)' }}
                      onClick={() => { setNotifOpen(false); navigate('/admin/disruptions'); }}>
                      View all alerts →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
              onClick={() => navigate('/admin/settings')}
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#111', fontWeight: 800 }}>
                {user?.name?.[0]}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="dash-content">
          <Routes>
            <Route index                   element={<AdminPages.Home />} />
            <Route path="digital-twin"     element={<AdminPages.DigitalTwin />} />
            <Route path="containers"       element={<AdminPages.Containers />} />
            <Route path="agent"            element={<AdminPages.ContainerAgent />} />
            <Route path="cargo-health"     element={<AdminPages.CargoHealth />} />
            <Route path="reputation"       element={<AdminPages.ReputationScore />} />
            <Route path="ports"            element={<AdminPages.Ports />} />
            <Route path="vessels"          element={<AdminPages.Vessels />} />
            <Route path="disruptions"      element={<AdminPages.Disruptions />} />
            <Route path="analytics"        element={<AdminPages.Analytics />} />
            <Route path="users"            element={<AdminPages.Users />} />
            <Route path="reports"          element={<AdminPages.Reports />} />
            <Route path="support-tickets"  element={<AdminPages.SupportTickets />} />
            <Route path="settings"         element={<AdminPages.Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
