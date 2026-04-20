import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import ProjectCard from '../components/ProjectCard';
import { FolderGit2, Send, Zap, Plus, ArrowRight, CheckCircle, Clock, XCircle, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_ICON  = {
  accepted: <CheckCircle size={13} color="#16a34a" />,
  rejected: <XCircle    size={13} color="#dc2626" />,
  pending:  <Clock      size={13} color="#d97706" />,
};
const STATUS_LABEL = { accepted: '#16a34a', rejected: '#dc2626', pending: '#d97706' };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData]     = useState({ ownProjects: [], applications: [] });
  const [matched, setMatched] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, matchRes] = await Promise.all([
          api.get('/users/dashboard'),
          api.get('/projects/match'),
        ]);
        setData(dashRes.data);
        setMatched(matchRes.data.slice(0, 3));
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>;

  const pendingApps  = data.applications.filter((a) => a.status === 'pending').length;
  const acceptedApps = data.applications.filter((a) => a.status === 'accepted').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade">

      {/* ── Greeting banner ── */}
      <div className="card" style={{ padding: '1.625rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <LayoutDashboard size={16} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dashboard</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Welcome back, <span style={{ color: 'var(--accent-blue)' }}>{user?.name?.split(' ')[0]}</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {user?.skills?.length > 0
              ? `${user.skills.length} skills listed · Here's your activity overview`
              : 'Complete your profile to start matching with projects.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" style={{ fontSize: '0.825rem' }} onClick={() => navigate('/profile/edit')}>Edit Profile</button>
          <button className="btn-primary"   style={{ fontSize: '0.825rem' }} onClick={() => navigate('/projects/new')}>
            <Plus size={14} /> New Project
          </button>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.875rem' }}>
        <StatsCard icon={FolderGit2}    label="My Projects"   value={data.ownProjects.length}  color="#2563eb" />
        <StatsCard icon={Send}          label="Applications"  value={data.applications.length} color="#7c3aed" />
        <StatsCard icon={Clock}         label="Pending"       value={pendingApps}              color="#d97706" />
        <StatsCard icon={CheckCircle}   label="Accepted"      value={acceptedApps}             color="#16a34a" />
      </div>

      {/* ── Two-column content ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

        {/* Top skill matches */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
            <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <Zap size={16} color="#d97706" /> Top Matches
            </h2>
            <button
              onClick={() => navigate('/feed')}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'Inter, sans-serif' }}
            >
              View feed <ArrowRight size={13} />
            </button>
          </div>

          {matched.length === 0 ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <Zap size={28} style={{ margin: '0 auto 0.75rem', color: 'var(--text-muted)' }} />
              <p style={{ fontSize: '0.875rem', marginBottom: '0.875rem' }}>Add skills to see matched projects</p>
              <button className="btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => navigate('/profile/edit')}>Add Skills</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {matched.map((p) => <ProjectCard key={p._id} project={p} />)}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* My Projects */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
              <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                <FolderGit2 size={16} color="#2563eb" /> My Projects
              </h2>
              <button
                onClick={() => navigate('/projects/new')}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'Inter, sans-serif' }}
              >
                <Plus size={13} /> New
              </button>
            </div>

            {data.ownProjects.length === 0 ? (
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                No projects yet.{' '}
                <span style={{ color: 'var(--accent-blue)', cursor: 'pointer' }} onClick={() => navigate('/projects/new')}>Create one →</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.ownProjects.slice(0, 4).map((p) => (
                  <div
                    key={p._id}
                    className="card card-clickable"
                    style={{ padding: '0.875rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => navigate(`/projects/${p._id}`)}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                        {p.members?.length || 1} member{p.members?.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <span className={`status-${p.status}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
              <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                <Send size={16} color="#7c3aed" /> Applications
              </h2>
              <button
                onClick={() => navigate('/applications')}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'Inter, sans-serif' }}
              >
                View all <ArrowRight size={13} />
              </button>
            </div>

            {data.applications.length === 0 ? (
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                No applications yet.{' '}
                <span style={{ color: 'var(--accent-blue)', cursor: 'pointer' }} onClick={() => navigate('/feed')}>Browse feed →</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.applications.slice(0, 4).map((app) => (
                  <div
                    key={app._id}
                    className="card card-clickable"
                    style={{ padding: '0.875rem 1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => navigate(`/projects/${app.project?._id}`)}
                  >
                    <div style={{ overflow: 'hidden', minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.project?.title}</div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '1px' }}>{app.project?.category}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.775rem', color: STATUS_LABEL[app.status], flexShrink: 0 }}>
                      {STATUS_ICON[app.status]} {app.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
