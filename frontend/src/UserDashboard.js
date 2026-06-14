import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './App';
import UserPages from './UserPages';

const USER_NAV = [
  { path: '',            icon: '⊞',  label: 'Dashboard',     badge: null },
  { path: 'shipments',  icon: '📦',  label: 'My Shipments',  badge: '6' },
  { path: 'tracking',   icon: '📍',  label: 'Live Tracking', badge: null },
  { path: 'documents',  icon: '📄',  label: 'Documents',     badge: '2' },
  { path: 'alerts',     icon: '🔔',  label: 'Alerts',        badge: '3' },
  { path: 'marketplace',icon: '🛒',  label: 'Marketplace',   badge: null },
  { path: 'support',    icon: '💬',  label: 'Support',       badge: null },
  { path: 'profile',    icon: '👤',  label: 'Profile',       badge: null },
];

const USER_NOTIFS = [
  { title: '📦 Shipment Departed',  body: 'CT-9081 departed Singapore Terminal 2.',    time: '5 min ago',  priority: 'info' },
  { title: '✅ Customs Cleared',    body: 'CT-4402 pre-cleared for Los Angeles.',       time: '18 min ago', priority: 'success' },
  { title: '⚠️ Delay Notice',       body: 'CT-7731 delayed — Customs hold, Hamburg.', time: '45 min ago', priority: 'high' },
];

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cur = location.pathname.replace('/dashboard', '').replace(/^\//, '');
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

        <div className="sidebar-section-label" style={{ paddingLeft: 20 }}>Client Portal</div>

        <nav className="sidebar-nav">
          {USER_NAV.map(n => (
            <div
              key={n.path}
              className={`sidebar-item${cur === n.path ? ' active' : ''}`}
              onClick={() => navigate(`/dashboard${n.path ? '/' + n.path : ''}`)}
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
              {user?.name?.[0] || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>{user?.name}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{user?.company || 'Client'}</div>
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
        <header className="dash-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Portal</span>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {USER_NAV.find(n => n.path === cur)?.label || 'Dashboard'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                placeholder="Search shipments, B/L..."
                style={{ width: 200, padding: '7px 12px 7px 34px', fontSize: 12, borderRadius: 'var(--radius-md)' }}
              />
              <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>🔍</span>
            </div>

            {/* Bell */}
            <div className="notif-wrapper">
              <button className="btn-icon" style={{ fontSize: 18 }} onClick={openNotif} title="Notifications">
                🔔
              </button>
              {unread > 0 && <div className="notif-dot" />}

              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    Notifications
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12 }} onClick={() => setNotifOpen(false)}>✕</button>
                  </div>
                  {USER_NOTIFS.map((n, i) => (
                    <div key={i} className="notif-item" onClick={() => { setNotifOpen(false); navigate('/dashboard/alerts'); }}>
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-body">{n.body}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                  ))}
                  <div style={{ padding: '12px 18px', textAlign: 'center' }}>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--accent)' }}
                      onClick={() => { setNotifOpen(false); navigate('/dashboard/alerts'); }}>
                      View all alerts →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
              onClick={() => navigate('/dashboard/profile')}
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#111', fontWeight: 800 }}>
                {user?.name?.[0]}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</span>
            </div>
          </div>
        </header>

        <div className="dash-content">
          <Routes>
            <Route index                  element={<UserPages.Home />} />
            <Route path="shipments"       element={<UserPages.Shipments />} />
            <Route path="tracking"        element={<UserPages.Tracking />} />
            <Route path="documents"       element={<UserPages.Documents />} />
            <Route path="alerts"          element={<UserPages.Alerts />} />
            <Route path="marketplace"     element={<UserPages.Marketplace />} />
            <Route path="support"         element={<UserPages.Support />} />
            <Route path="profile"         element={<UserPages.Profile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
