import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FolderGit2, User, MessageSquare,
  LogOut, Menu, X, Plus, Bell, ChevronRight, Code2,
  Home, Send,
} from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const NAV = [
  { to: '/feed',         icon: Home,            label: 'Feed' },
  { to: '/dashboard',    icon: LayoutDashboard,  label: 'Dashboard' },
  { to: '/projects',     icon: FolderGit2,       label: 'Projects' },
  { to: '/applications', icon: Send,             label: 'Applications' },
  { to: '/profile',      icon: User,             label: 'My Profile' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotif, setShowNotif]     = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 40, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className="lg-sidebar"
        style={{
          width: 256,
          flexShrink: 0,
          background: '#ffffff',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Code2 size={18} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>DevCollab</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '-1px' }}>Collaboration Hub</div>
          </div>
          {/* Close button — mobile only */}
          <button onClick={closeSidebar} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.875rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.125rem', overflowY: 'auto' }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={closeSidebar}
            >
              <Icon size={16} />
              <span style={{ flex: 1 }}>{label}</span>
            </NavLink>
          ))}

          <div style={{ margin: '0.875rem 0 0.375rem', height: '1px', background: 'var(--border)' }} />

          <button
            className="btn-primary"
            style={{ justifyContent: 'center', fontSize: '0.82rem', padding: '0.55rem 1rem', width: '100%' }}
            onClick={() => { navigate('/projects/new'); closeSidebar(); }}
          >
            <Plus size={15} /> New Project
          </button>
        </nav>

        {/* User footer */}
        <div style={{ padding: '0.875rem 0.75rem', borderTop: '1px solid var(--border)' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem', padding: '0.5rem 0.625rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
            onClick={() => { navigate('/profile'); closeSidebar(); }}
          >
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-muted)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0, color: 'var(--text-secondary)' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.825rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', padding: '0.5rem' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="lg-main-offset" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          height: 56,
          background: '#ffffff',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.25rem',
          gap: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          {/* Hamburger — always show; on desktop it stays dimmed */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
          >
            <Menu size={20} />
          </button>

          {/* Brand name — topbar (visible when sidebar is hidden) */}
          <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
            DevCollab
          </span>

          <div style={{ flex: 1 }} />

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', position: 'relative' }}
            >
              <Bell size={18} />
              {/* Dot indicator (always show; real unread count could be fetched) */}
            </button>
            {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
          </div>

          {/* Avatar */}
          <div
            style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--bg-muted)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
            onClick={() => navigate('/profile')}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '1.75rem 1.5rem', maxWidth: 1160, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
