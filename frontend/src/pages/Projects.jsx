import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import { Search, Filter, SlidersHorizontal, Zap, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Web', 'Mobile', 'AI/ML', 'DevOps', 'Open Source', 'Startup', 'Research', 'Other'];
const STATUSES = ['All', 'open', 'closed', 'in-progress'];

export default function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchMode, setMatchMode] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    loadProjects();
    loadBookmarks();
  }, [matchMode]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const url = matchMode ? '/projects/match' : '/projects';
      const { data } = await api.get(url);
      setProjects(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  const loadBookmarks = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setBookmarks(data.bookmarks?.map(b => b._id || b) || []);
    } catch { }
  };

  const handleBookmark = async (pid) => {
    try {
      const { data } = await api.post(`/users/bookmark/${pid}`);
      setBookmarks(data.bookmarks);
    } catch { toast.error('Failed to bookmark'); }
  };

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    const matchStat = status === 'All' || p.status === status;
    return matchSearch && matchCat && matchStat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Projects</h1>
          <p style={{ fontSize: '0.9rem' }}>Discover projects and find your teammates</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/projects/new')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input-field" placeholder="Search projects..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }} />
        </div>
        <select className="input-field" style={{ width: 'auto', padding: '0.5rem 1rem' }} value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="input-field" style={{ width: 'auto', padding: '0.5rem 1rem' }} value={status} onChange={e => setStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => setMatchMode(!matchMode)}
          className={matchMode ? 'btn-primary' : 'btn-secondary'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', padding: '0.5rem 1rem' }}>
          <Zap size={15} /> {matchMode ? 'Skill Match ON' : 'Skill Match'}
        </button>
      </div>

      {/* Count */}
      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        {loading ? 'Loading...' : `${filtered.length} project${filtered.length !== 1 ? 's' : ''} found`}
        {matchMode && <span style={{ marginLeft: '0.5rem', color: 'var(--accent-light)' }}>• Sorted by skill match</span>}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
          <SlidersHorizontal size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <h3>No projects found</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Try adjusting your filters or create the first one!</p>
          <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/projects/new')}>Create Project</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filtered.map(p => (
            <ProjectCard key={p._id} project={p}
              onBookmark={handleBookmark}
              isBookmarked={bookmarks.map(String).includes(String(p._id))} />
          ))}
        </div>
      )}
    </div>
  );
}
