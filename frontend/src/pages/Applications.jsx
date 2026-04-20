import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Send, CheckCircle, XCircle, Clock, SlidersHorizontal, ArrowRight, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const STATUSES = ['All', 'pending', 'accepted', 'rejected'];

const STATUS_META = {
  pending:  { label: 'Pending',  badge: 'app-pending',  icon: Clock },
  accepted: { label: 'Accepted', badge: 'app-accepted', icon: CheckCircle },
  rejected: { label: 'Rejected', badge: 'app-rejected', icon: XCircle },
};

export default function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/users/dashboard');
        setApplications(data.applications || []);
      } catch {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = filter === 'All'
    ? applications
    : applications.filter((a) => a.status === filter);

  const counts = {
    pending:  applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade">

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, marginBottom: '0.25rem' }}>My Applications</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Track the status of all your project applications</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
        {[
          { label: 'Pending',  value: counts.pending,  color: 'var(--yellow)', bg: 'var(--yellow-bg)', border: 'var(--yellow-border)', icon: Clock },
          { label: 'Accepted', value: counts.accepted, color: 'var(--green)',  bg: 'var(--green-bg)',  border: 'var(--green-border)',  icon: CheckCircle },
          { label: 'Rejected', value: counts.rejected, color: 'var(--red)',    bg: 'var(--red-bg)',    border: 'var(--red-border)',    icon: XCircle },
        ].map(({ label, value, color, bg, border, icon: Icon }) => (
          <div key={label} className="card" style={{ padding: '1.125rem', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.625rem' }}>
              <Icon size={18} color={color} />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1, color }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {STATUSES.map((s) => {
          const count = s === 'All' ? applications.length : counts[s] ?? 0;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '0.5rem 1.125rem',
                background: 'transparent',
                border: 'none',
                borderBottom: filter === s ? '2px solid var(--accent)' : '2px solid transparent',
                fontSize: '0.875rem',
                fontWeight: filter === s ? 600 : 400,
                color: filter === s ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s',
                fontFamily: 'Inter, sans-serif',
                textTransform: 'capitalize',
              }}
            >
              {s === 'All' ? 'All' : STATUS_META[s]?.label}
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                background: filter === s ? 'var(--accent)' : 'var(--bg-muted)',
                color: filter === s ? '#ffffff' : 'var(--text-muted)',
                borderRadius: '9999px',
                padding: '0 6px',
                minWidth: 18,
                textAlign: 'center',
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Applications list */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
          <Send size={36} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>
            {filter === 'All' ? "You haven't applied to any projects yet" : `No ${filter} applications`}
          </h3>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {filter === 'All' ? 'Browse projects and apply to collaborate.' : 'Your applications will appear here.'}
          </p>
          {filter === 'All' && (
            <button className="btn-primary" onClick={() => navigate('/feed')}>
              Browse Feed
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((app) => {
            const meta = STATUS_META[app.status] || STATUS_META.pending;
            const StatusIcon = meta.icon;
            return (
              <div
                key={app._id}
                className="card card-clickable"
                onClick={() => navigate(`/projects/${app.project?._id}`)}
                style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
              >
                {/* Project icon */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-muted)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  flexShrink: 0,
                  color: 'var(--text-secondary)',
                }}>
                  {app.project?.title?.[0]?.toUpperCase() || '?'}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.925rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {app.project?.title || 'Unknown Project'}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {app.project?.category && <span style={{ marginRight: '0.625rem' }}>{app.project.category}</span>}
                    {app.createdAt && `Applied ${formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}`}
                  </div>
                </div>

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                  <span className={meta.badge}>
                    {meta.label}
                  </span>
                </div>

                <ArrowRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
