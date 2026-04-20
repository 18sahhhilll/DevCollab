import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import SkillTag from '../components/SkillTag';
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink, CheckCircle, Github, Globe, BookOpen } from "lucide-react";
const EXP_MAP = {
  Beginner: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  Intermediate: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  Advanced: { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  Expert: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
};

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
      } catch {
        toast.error('User not found');
        navigate('/projects');
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>;
  if (!profile) return null;

  const exp = EXP_MAP[profile.experienceLevel] || EXP_MAP.Intermediate;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }} className="animate-fade">
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Profile card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          {/* Avatar */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--bg-muted)', border: '2px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.75rem', flexShrink: 0, color: 'var(--text-secondary)',
          }}>
            {profile.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.375rem', marginBottom: '0.3rem' }}>{profile.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: 500 }}>{profile.role}</span>
              {profile.experienceLevel && (
                <span style={{ fontSize: '0.73rem', background: exp.bg, color: exp.color, border: `1px solid ${exp.border}`, padding: '0.15rem 0.55rem', borderRadius: '9999px', fontWeight: 600 }}>
                  {profile.experienceLevel}
                </span>
              )}
              {profile.availability && (
                <span style={{ fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: '3px', color: '#16a34a' }}>
                  <CheckCircle size={11} /> Available
                </span>
              )}
            </div>
          </div>
        </div>

        {profile.bio && (
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            {profile.bio}
          </p>
        )}

        {/* Social links */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: profile.skills?.length ? '1.25rem' : 0 }}>
          {profile.githubUsername && (
            <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-muted)', textDecoration: 'none' }}>
              <Github size={13} /> @{profile.githubUsername} <ExternalLink size={11} />
            </a>
          )}
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-muted)', textDecoration: 'none' }}>
              <Globe size={13} /> LinkedIn
            </a>
          )}
        </div>

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <div style={{ marginBottom: profile.interests?.length ? '1.25rem' : 0 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {profile.skills.map((s) => <SkillTag key={s} skill={s} />)}
            </div>
          </div>
        )}

        {/* Interests */}
        {profile.interests?.length > 0 && (
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Interests</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {profile.interests.map((i) => (
                <span key={i} style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', background: 'var(--bg-muted)', padding: '0.2rem 0.7rem', borderRadius: '9999px', border: '1px solid var(--border)' }}>
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GitHub repos */}
      {github && (
        <div>
          <h2 style={{ fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Github size={16} style={{ color: 'var(--text-secondary)' }} /> GitHub Repositories
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem' }}>
            {github.repos.map((repo) => (
              <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"
                className="card card-hover" style={{ padding: '1.125rem', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-link)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={12} /> {repo.name}
                </div>
                {repo.description && (
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.75rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {repo.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '0.875rem', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                  {repo.language && <span style={{ color: 'var(--text-secondary)' }}>⬤ {repo.language}</span>}
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
