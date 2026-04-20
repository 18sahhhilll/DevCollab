import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCheck, X } from 'lucide-react';

const TYPE_COLOR = {
  application: '#2563eb',
  accepted:    '#16a34a',
  rejected:    '#dc2626',
  team:        '#d97706',
  chat:        '#0891b2',
};

export default function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const panelRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const { data } = await api.get('/users/notifications');
        setNotifications(data);
      } catch { /* ignore */ } finally { setLoading(false); }
    };
    fetchNotifs();
  }, []);

  // Click outside to close
  useEffect(() => {
    const handle = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  const markRead = async () => {
    try {
      await api.put('/users/notifications/read');
      setNotifications((n) => n.map((x) => ({ ...x, read: true })));
    } catch {}
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
        width: 340, maxHeight: 420, overflowY: 'auto',
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)',
        zIndex: 100,
      }}
    >
      {/* Header */}
      <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
          <Bell size={15} style={{ color: 'var(--text-secondary)' }} /> Notifications
        </div>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <button onClick={markRead}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'Inter, sans-serif' }}>
            <CheckCheck size={13} /> Mark read
          </button>
          <button onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No notifications yet
        </div>
      ) : (
        notifications.map((n, i) => (
          <div
            key={i}
            onClick={() => { if (n.link) navigate(n.link); onClose(); }}
            style={{
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--border)',
              cursor: n.link ? 'pointer' : 'default',
              background: n.read ? 'transparent' : '#f8f9ff',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-muted)'}
            onMouseLeave={(e) => e.currentTarget.style.background = n.read ? 'transparent' : '#f8f9ff'}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: TYPE_COLOR[n.type] || 'var(--accent-blue)', marginTop: 6, flexShrink: 0, opacity: n.read ? 0.3 : 1 }} />
              <div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>{n.message}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
