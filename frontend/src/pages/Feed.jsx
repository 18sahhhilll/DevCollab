import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import SkillTag from '../components/SkillTag';
import toast from 'react-hot-toast';
import {
  Zap, TrendingUp, Search, SlidersHorizontal,
  Plus, ArrowRight, Sparkles, Users, FolderGit2
} from 'lucide-react';

const CATEGORIES = ['All', 'Web', 'Mobile', 'AI/ML', 'DevOps', 'Open Source', 'Startup', 'Research', 'Other'];

export default function Feed() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchMode, setMatchMode] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [bookmarks, setBookmarks] = useState([]);
  const [stats, setStats] = useState({ totalProjects: 0, totalMembers: 0 });

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const url = matchMode ? '/projects/match' : '/projects';
      const [projRes, profileRes] = await Promise.all([
        api.get(url),
        api.get('/users/profile'),
      ]);
      setProjects(Array.isArray(projRes.data) ? projRes.data : []);
      setBookmarks(profileRes.data.bookmarks?.map((b) => b._id || b) || []);
    } catch {
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, [matchMode]);

  useEffect(() => { loadFeed(); }, [loadFeed]);

  const handleBookmark = async (pid) => {
    try {
      const { data } = await api.post(`/users/bookmark/${pid}`);
      setBookmarks(data.bookmarks);
    } catch {
      toast.error('Failed to bookmark');
    }
  };

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const openProjects = projects.filter((p) => p.status === 'open').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade">

      {/* ── Welcome banner ── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', marginBottom: '0.3rem', fontWeight: 800 }}>
            Good {timeOfDay()},{' '}
            <span style={{ color: 'var(--accent-blue)' }}>{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {openProjects > 0
              ? `${openProjects} open project${openProjects !== 1 ? 's' : ''} are looking for collaborators`
              : 'Discover projects and find your next collaboration'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {user?.skills?.length === 0 && (
            <button className="btn-secondary" onClick={() => navigate('/profile/edit')}>
              Complete Profile
            </button>
          )}
          <button className="btn-primary" onClick={() => navigate('/projects/new')}>
            <Plus size={15} /> Post a Project
          </button>
        </div>
      </div>

      {/* ── Quick stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem' }}>
        {[
          { label: 'Open Projects', value: openProjects, icon: FolderGit2, color: '#2563eb' },
          { label: 'Your Skills', value: user?.skills?.length || 0, icon: Sparkles, color: '#16a34a' },
          { label: 'Total Listed', value: projects.length, icon: TrendingUp, color: '#d97706' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Skill highlight ── */}
      {user?.skills?.length > 0 && (
        <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
          <Zap size={16} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0 }}>Your skills:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', flex: 1 }}>
            {user.skills.slice(0, 8).map((s) => (
              <SkillTag key={s} skill={s} />
            ))}
            {user.skills.length > 8 && (
              <button onClick={() => navigate('/profile')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                +{user.skills.length - 8} more
              </button>
            )}
          </div>
          <button className="btn-secondary" style={{ padding: '0.35rem 0.875rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }} onClick={() => setMatchMode(true)}>
            <Zap size={13} /> Filter by match
          </button>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            className="input-field"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: '0.35rem 0.875rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                border: `1px solid ${category === c ? 'var(--accent)' : 'var(--border)'}`,
                background: category === c ? 'var(--accent)' : '#ffffff',
                color: category === c ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.15s',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={() => setMatchMode(!matchMode)}
          className={matchMode ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '0.45rem 1rem', fontSize: '0.825rem', whiteSpace: 'nowrap' }}
        >
          <Zap size={14} /> {matchMode ? 'Matched' : 'Smart Match'}
        </button>
      </div>

      {/* ── Results header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {loading ? 'Loading...' : `${filtered.length} project${filtered.length !== 1 ? 's' : ''}`}
          {matchMode && <span style={{ marginLeft: '0.5rem', color: 'var(--accent-blue)', fontWeight: 600 }}>• Sorted by skill match</span>}
        </span>
        <button onClick={() => navigate('/projects')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Browse all <ArrowRight size={13} />
        </button>
      </div>

      {/* ── Project grid ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
          <SlidersHorizontal size={36} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No projects found</h3>
          <p style={{ fontSize: '0.875rem' }}>Try a different search or category — or create the first one!</p>
          <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/projects/new')}>
            <Plus size={15} /> Post a Project
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filtered.map((p) => (
            <ProjectCard
              key={p._id}
              project={p}
              onBookmark={handleBookmark}
              isBookmarked={bookmarks.map(String).includes(String(p._id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function timeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
