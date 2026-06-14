import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import LandingPage from './LandingPage';
import AuthPage from './AuthPage';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

// ── Auth Context ──────────────────────────────────────────────────────────────
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cv_user')); } catch { return null; }
  });

  const login = (email, password) => {
    // Simulate JWT auth — in production replace with real API call
    const mockUsers = [
      { id: 1, name: 'Admin User', email: 'admin@containerverse.io', role: 'admin', company: 'CARGOVerse HQ', token: 'mock-jwt-admin' },
      { id: 2, name: 'John Doe', email: 'user@containerverse.io', role: 'user', company: 'Global Shipping Co.', token: 'mock-jwt-user' },
    ];
    const found = mockUsers.find(u => u.email === email);
    if (found && password.length >= 6) {
      localStorage.setItem('cv_user', JSON.stringify(found));
      setUser(found);
      return { success: true, user: found };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (data) => {
    const newUser = { id: Date.now(), name: data.name, email: data.email, role: 'user', company: data.company, token: 'mock-jwt-new' };
    localStorage.setItem('cv_user', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    localStorage.removeItem('cv_user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

// ── Protected Route ───────────────────────────────────────────────────────────
function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
          <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/*" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
