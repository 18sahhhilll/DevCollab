import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCheck, X } from 'lucide-react';

export default function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const handle = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  const markRead = async () => {
    try { await api.put('/users/notifications/read'); setNotifications((n) => n.map((x) => ({ ...x, read: true }))); } catch {}
  };

  const typeColor = { application: '#6366f1', accepted: '#10b981', rejected: '#ef4444', team: '#f59e0b', chat: '#06b6d4' };

  return (
    <div ref={panelRef} style={{
      position:'absolute', top:'calc(100% + 8px)', right:0,
      width: 340, maxHeight: 420, overflowY:'auto',
      background:'var(--bg-card)', border:'1px solid var(--border)',
      borderRadius:'0.875rem', boxShadow:'0 20px 40px rgba(0,0,0,0.4)',
      zIndex:100,
    }}>
      <div style={{ padding:'1rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:600 }}>
          <Bell size={16} color="var(--accent-light)" /> Notifications
        </div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          <button onClick={markRead} style={{ background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'0.75rem', display:'flex', alignItems:'center', gap:'4px' }}>
            <CheckCheck size={14} /> Mark all read
          </button>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer' }}><X size={16} /></button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding:'2rem', textAlign:'center' }}><div className="spinner" style={{ margin:'0 auto' }} /></div>
      ) : notifications.length === 0 ? (
        <div style={{ padding:'2rem', textAlign:'center', color:'var(--text-muted)' }}>No notifications yet</div>
      ) : (
        notifications.map((n, i) => (
          <div key={i} onClick={() => { if (n.link) navigate(n.link); onClose(); }}
            style={{
              padding:'0.875rem 1rem', borderBottom:'1px solid var(--border)',
              cursor: n.link ? 'pointer' : 'default',
              background: n.read ? 'transparent' : 'rgba(99,102,241,0.05)',
              transition:'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(99,102,241,0.05)'}
          >
            <div style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background: typeColor[n.type] || 'var(--accent)', marginTop:6, flexShrink:0, opacity: n.read ? 0.4 : 1 }} />
              <div>
                <div style={{ fontSize:'0.85rem', color:'var(--text-primary)', lineHeight:1.4 }}>{n.message}</div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:'0.25rem' }}>
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
