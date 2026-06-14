import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './App';

// ── Left Panel Illustration ───────────────────────────────────────────────────
function AuthLeft({ mode }) {
  const content = {
    login:    { title: 'Welcome back to CARGOVerse', sub: 'Monitor global cargo, manage disruptions, and optimize routes — all from one intelligent platform.' },
    register: { title: 'Join the logistics revolution', sub: 'Thousands of shipping professionals use CARGOVerse to run smarter, more resilient supply chains.' },
    forgot:   { title: 'We\'ve got you covered', sub: 'Enter your email and we\'ll send you a secure link to reset your password immediately.' },
  };
  const c = content[mode] || content.login;
  return (
    <div className="auth-left">
      <div className="auth-left-bg" />
      <div className="hero-glow-1" style={{ width: 400, height: 400 }} />
      <div className="auth-left-content">
        {/* Vessel illustration */}
        <div style={{ fontSize: 80, marginBottom: 24, animation: 'float 4s ease-in-out infinite' }}>🚢</div>
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--accent)', padding: '6px 16px', borderRadius: 40, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'inline-block', marginBottom: 22 }}>
          Enterprise Platform
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 14, lineHeight: 1.3 }}>{c.title}</h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 36 }}>{c.sub}</p>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          {[['284K+', 'Containers'], ['47', 'Ports'], ['98.4%', 'Uptime']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>{v}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Login Form ────────────────────────────────────────────────────────────────
function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError(result.error);
    }
  };

  const hint = (email, pw) => { setForm(f => ({ ...f, email, password: pw })); };

  return (
    <div className="auth-form-box">
      <div className="auth-logo">
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,var(--accent),#D97706)', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: 18, color: '#111', fontWeight: 800 }}>🌐</div>
        <span className="auth-logo-text">CARGOVerse</span>
      </div>
      <h1 className="auth-title">Sign in to your account</h1>
      <p className="auth-subtitle">Enter your credentials to access the platform</p>

      {/* Demo hint */}
      <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 20, fontSize: 12 }}>
        <div style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: 6 }}>Demo Credentials</div>
        <button onClick={() => hint('admin@containerverse.io', 'admin123')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', padding: 0, display: 'block', marginBottom: 3 }}>
          👤 Admin: admin@containerverse.io / admin123
        </button>
        <button onClick={() => hint('user@containerverse.io', 'user1234')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', padding: 0 }}>
          👤 User: user@containerverse.io / user1234
        </button>
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>⚠ {error}</div>}

      <form className="auth-form" onSubmit={handle}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        </div>
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label className="form-label">Password</label>
            <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--teal-500)' }}>Forgot password?</Link>
          </div>
          <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.remember} onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))} />
          Remember me for 30 days
        </label>
        <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
          {loading ? '⏳ Signing in…' : '→ Sign In'}
        </button>
      </form>
      <div className="auth-divider" style={{ margin: '20px 0' }}>or</div>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--teal-500)', fontWeight: 600 }}>Create account</Link>
      </p>
    </div>
  );
}

// ── Register Form ─────────────────────────────────────────────────────────────
function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handle = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = register(form);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  return (
    <div className="auth-form-box" style={{ maxWidth: 420 }}>
      <div className="auth-logo">
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,var(--accent),#D97706)', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: 18, color: '#111', fontWeight: 800 }}>🌐</div>
        <span className="auth-logo-text">CARGOVerse</span>
      </div>
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-subtitle">Start your 14-day free trial. No credit card required.</p>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>⚠ {error}</div>}

      <form className="auth-form" onSubmit={handle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Jane Smith" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Company</label>
            <input className="form-input" placeholder="Acme Shipping Ltd." value={form.company} onChange={e => set('company', e.target.value)} required />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Work Email</label>
          <input className="form-input" type="email" placeholder="jane@company.com" value={form.email} onChange={e => set('email', e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input className="form-input" type="tel" placeholder="+1 555 000 0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min 6 chars" value={form.password} onChange={e => set('password', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => set('confirm', e.target.value)} required />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
          {loading ? '⏳ Creating account…' : '✓ Create Account'}
        </button>
      </form>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginTop: 20 }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--teal-500)', fontWeight: 600 }}>Sign in</Link>
      </p>
    </div>
  );
}

// ── Forgot Password Form ──────────────────────────────────────────────────────
function ForgotForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const handle = (e) => { e.preventDefault(); setSent(true); };
  return (
    <div className="auth-form-box">
      <div className="auth-logo">
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,var(--accent),#D97706)', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: 18, color: '#111', fontWeight: 800 }}>🌐</div>
        <span className="auth-logo-text">CARGOVerse</span>
      </div>
      {sent ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Check your inbox</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>We've sent a password reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong></p>
          <Link to="/login" className="btn btn-secondary" style={{ marginTop: 24, display: 'inline-flex', justifyContent: 'center' }}>← Back to Login</Link>
        </div>
      ) : (
        <>
          <h1 className="auth-title">Forgot your password?</h1>
          <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>
          <form className="auth-form" onSubmit={handle}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>Send Reset Link</button>
          </form>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginTop: 20 }}>
            <Link to="/login" style={{ color: 'var(--teal-500)', fontWeight: 600 }}>← Back to Sign In</Link>
          </p>
        </>
      )}
    </div>
  );
}

// ── Page Export ───────────────────────────────────────────────────────────────
export default function AuthPage({ mode }) {
  return (
    <div className="auth-layout">
      <AuthLeft mode={mode} />
      <div className="auth-right">
        {mode === 'login' && <LoginForm />}
        {mode === 'register' && <RegisterForm />}
        {mode === 'forgot' && <ForgotForm />}
      </div>
    </div>
  );
}
