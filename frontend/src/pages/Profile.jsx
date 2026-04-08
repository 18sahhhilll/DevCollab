import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SkillTag from '../components/SkillTag';
import { Edit2, Star, GitFork, ExternalLink, Globe, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [github, setGithub] = useState(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile(data);
        if (data.githubUsername) fetchGithub(data._id);
      } catch { toast.error('Failed to load profile'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const fetchGithub = async (uid) => {
    setGithubLoading(true);
    try {
      const { data } = await api.get(`/users/${uid}/github`);
      setGithub(data);
    } catch { /* GitHub data optional */ }
    finally { setGithubLoading(false); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>;
  if (!profile) return null;

  const EXP_COLOR = { Beginner: '#10b981', Intermediate: '#6366f1', Advanced: '#f59e0b', Expert: '#ef4444' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 800, margin: '0 auto' }} className="animate-fade">
      {/* Profile Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.75rem', flexShrink: 0 }}>
              {profile.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{profile.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--accent-light)', fontWeight: 500 }}>{profile.role}</span>
                <span style={{ fontSize: '0.78rem', background: `rgba(${expRgb(profile.experienceLevel)},0.15)`, color: EXP_COLOR[profile.experienceLevel], padding: '0.15rem 0.6rem', borderRadius: '9999px', fontWeight: 600 }}>
                  {profile.experienceLevel}
                </span>
                {profile.availability && (
                  <span style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                    <CheckCircle size={12} /> Available
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }} onClick={() => navigate('/profile/edit')}>
            <Edit2 size={15} /> Edit Profile
          </button>
        </div>

        {profile.bio && <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{profile.bio}</p>}

        {profile.githubUsername && (
          <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '0.375rem 0.875rem', borderRadius: '0.5rem', marginBottom: '1.25rem' }}>
            <Github size={15} /> @{profile.githubUsername} <ExternalLink size={12} />
          </a>
        )}

        {profile.skills?.length > 0 && (
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.625rem' }}>SKILLS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {profile.skills.map(s => <SkillTag key={s} skill={s} />)}
            </div>
          </div>
        )}

        {profile.interests?.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.625rem' }}>INTERESTS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {profile.interests.map(i => <span key={i} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid var(--border)' }}>{i}</span>)}
            </div>
          </div>
        )}
      </div>

      {/* GitHub Repos */}
      {profile.githubUsername && (
        <div>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Github size={18} /> GitHub Repositories
          </h2>
          {githubLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : github ? (
            <>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                {[['Public Repos', github.profile.public_repos], ['Followers', github.profile.followers], ['Following', github.profile.following]].map(([label, val]) => (
                  <div key={label} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{val}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
                  </div>
                ))}
              </div>
              {/* Repos */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {github.repos.map(repo => (
                  <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"
                    className="card" style={{ padding: '1.125rem', display: 'block', textDecoration: 'none' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--accent-light)', marginBottom: '0.375rem' }}>{repo.name}</div>
                    {repo.description && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{repo.description}</p>}
                    <div style={{ display: 'flex', gap: '0.875rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {repo.language && <span style={{ color: 'var(--text-secondary)' }}>⬤ {repo.language}</span>}
                      <span>★ {repo.stargazers_count}</span>
                      <span>⑂ {repo.forks_count}</span>
                    </div>
                  </a>
                ))}
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Could not load GitHub data. Make sure your username is correct.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function expRgb(level) {
  return { Beginner: '16,185,129', Intermediate: '99,102,241', Advanced: '245,158,11', Expert: '239,68,68' }[level] || '99,102,241';
}
