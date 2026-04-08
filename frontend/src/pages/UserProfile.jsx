import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import SkillTag from '../components/SkillTag';
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [github, setGithub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        setProfile(data);
        if (data.githubUsername) {
          try { const g = await api.get(`/users/${id}/github`); setGithub(g.data); } catch { }
        }
      } catch { toast.error('User not found'); navigate('/projects'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>;
  if (!profile) return null;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }} className="animate-fade">
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.75rem', flexShrink: 0 }}>
            {profile.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{profile.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--accent-light)', fontWeight: 500 }}>{profile.role}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{profile.experienceLevel}</span>
              {profile.availability && (
                <span style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                  <CheckCircle size={12} /> Available
                </span>
              )}
            </div>
          </div>
        </div>

        {profile.bio && <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{profile.bio}</p>}

        {profile.githubUsername && (
          <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '0.375rem 0.875rem', borderRadius: '0.5rem', marginBottom: '1.25rem' }}>
            <Github size={15} /> @{profile.githubUsername} <ExternalLink size={12} />
          </a>
        )}

        {profile.skills?.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.5rem' }}>SKILLS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {profile.skills.map(s => <SkillTag key={s} skill={s} />)}
            </div>
          </div>
        )}

        {profile.interests?.length > 0 && (
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.5rem' }}>INTERESTS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {profile.interests.map(i => <span key={i} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid var(--border)' }}>{i}</span>)}
            </div>
          </div>
        )}
      </div>

      {github && (
        <div>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Github size={18} /> GitHub Repositories
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem' }}>
            {github.repos.map(repo => (
              <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"
                className="card" style={{ padding: '1.125rem', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--accent-light)', marginBottom: '0.375rem' }}>{repo.name}</div>
                {repo.description && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{repo.description}</p>}
                <div style={{ display: 'flex', gap: '0.875rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {repo.language && <span>⬤ {repo.language}</span>}
                  <span>★ {repo.stargazers_count}</span>
                  <span>⑂ {repo.forks_count}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
