import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import ProjectCard from '../components/ProjectCard';
import MatchBadge from '../components/MatchBadge';
import { FolderGit2, Users, Send, Zap, Plus, ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// const [isSidebarOpen, setIsSidebarOpen] = useState(true);
const STATUS_ICON = { accepted: <CheckCircle size={14} color="#10b981" />, rejected: <XCircle size={14} color="#ef4444" />, pending: <Clock size={14} color="#f59e0b" /> };
const STATUS_COLOR = { accepted: '#10b981', rejected: '#ef4444', pending: '#f59e0b' };

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ ownProjects: [], applications: [] });
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
      } catch { toast.error('Failed to load dashboard'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>;

  const pendingApps = data.applications.filter(a => a.status === 'pending').length;
  const acceptedApps = data.applications.filter(a => a.status === 'accepted').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade">
      {/* Hero greeting */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '1rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', marginBottom: '0.375rem' }}>
              Hey, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p style={{ fontSize: '0.95rem' }}>
              {user?.skills?.length > 0
                ? `You have ${user.skills.length} skills listed — let's find your next project!`
                : 'Complete your profile to start matching with projects.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={() => navigate('/profile/edit')}>Edit Profile</button>
            <button className="btn-primary" onClick={() => navigate('/projects/new')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> New Project
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <StatsCard icon={FolderGit2} label="My Projects" value={data.ownProjects.length} color="#6366f1" />
        <StatsCard icon={Send} label="Applications" value={data.applications.length} color="#8b5cf6" />
        <StatsCard icon={Clock} label="Pending" value={pendingApps} color="#f59e0b" />
        <StatsCard icon={CheckCircle} label="Accepted" value={acceptedApps} color="#10b981" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Top Matches */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="#f59e0b" /> Top Matches
            </h2>
            <button onClick={() => navigate('/projects')} style={{ background: 'transparent', border: 'none', color: 'var(--accent-light)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          {matched.length === 0 ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Zap size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <p>Add skills to your profile to see matches</p>
              <button className="btn-primary" style={{ marginTop: '1rem', fontSize: '0.85rem' }} onClick={() => navigate('/profile/edit')}>Add Skills</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {matched.map(p => <ProjectCard key={p._id} project={p} />)}
            </div>
          )}
        </div>

        {/* My Projects & Applications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* My Projects */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderGit2 size={18} color="#6366f1" /> My Projects
              </h2>
              <button onClick={() => navigate('/projects/new')} style={{ background: 'transparent', border: 'none', color: 'var(--accent-light)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={13} /> New
              </button>
            </div>
            {data.ownProjects.length === 0 ? (
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No projects yet. <span style={{ color: 'var(--accent-light)', cursor: 'pointer' }} onClick={() => navigate('/projects/new')}>Create one!</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {data.ownProjects.slice(0, 3).map(p => (
                  <div key={p._id} className="card" style={{ padding: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => navigate(`/projects/${p._id}`)}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.members?.length || 1} member{p.members?.length !== 1 ? 's' : ''}</div>
                    </div>
                    <span className={`status-${p.status}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applications */}
          <div>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={18} color="#8b5cf6" /> My Applications
            </h2>
            {data.applications.length === 0 ? (
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                You haven't applied to any projects yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {data.applications.slice(0, 4).map(app => (
                  <div key={app._id} className="card" style={{ padding: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => navigate(`/projects/${app.project?._id}`)}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.project?.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{app.project?.category}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: STATUS_COLOR[app.status], flexShrink: 0 }}>
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
