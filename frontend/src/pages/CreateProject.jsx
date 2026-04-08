import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SkillTag from '../components/SkillTag';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus } from 'lucide-react';

const CATEGORIES = ['Web', 'Mobile', 'AI/ML', 'DevOps', 'Open Source', 'Startup', 'Research', 'Other'];


const Section = ({ title, children }) => (
  <div className="card" style={{ padding: '1.75rem', marginBottom: '1.25rem' }}>
    <h2 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>{title}</h2>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: '1.125rem' }}><label>{label}</label>{children}</div>
);

export default function CreateProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', requiredSkills: [], teamSize: 3, category: 'Web', status: 'open', githubRepo: '', tags: [] });
  const [skillInput, setSkillInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.requiredSkills.includes(s)) setForm({ ...form, requiredSkills: [...form.requiredSkills, s] });
    setSkillInput('');
  };

  const removeSkill = (s) => setForm({ ...form, requiredSkills: form.requiredSkills.filter(x => x !== s) });

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm({ ...form, tags: [...form.tags, t] });
    setTagInput('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { toast.error('Title and description required'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/projects', { ...form, teamSize: Number(form.teamSize) });
      toast.success('Project created!');
      navigate(`/projects/${data._id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create'); }
    finally { setLoading(false); }
  };



  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }} className="animate-fade">
      <button onClick={() => navigate('/projects')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ArrowLeft size={16} /> Back to Projects
      </button>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Create New Project</h1>

      <form onSubmit={submit}>
        <Section title="Project Details">
          <Field label="Project Title *">
            <input name="title" className="input-field" value={form.title} onChange={handle} required placeholder="e.g. Open Source Task Manager" />
          </Field>
          <Field label="Description *">
            <textarea name="description" className="input-field" value={form.description} onChange={handle} required rows={6} placeholder="Describe your project — what are you building, what's the goal, what kind of team are you looking for?" />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <Field label="Category">
              <select name="category" className="input-field" value={form.category} onChange={handle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Team Size">
              <input type="number" name="teamSize" className="input-field" value={form.teamSize} onChange={handle} min={1} max={20} />
            </Field>
            <Field label="Status">
              <select name="status" className="input-field" value={form.status} onChange={handle}>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </Field>
          </div>
          <Field label="GitHub Repository URL (optional)">
            <input name="githubRepo" className="input-field" value={form.githubRepo} onChange={handle} placeholder="https://github.com/yourname/repo" />
          </Field>
        </Section>

        <Section title="Required Skills">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem' }}>
            <input className="input-field" value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="Add a required skill (e.g. React, Node.js)" />
            <button type="button" className="btn-primary" onClick={addSkill} style={{ padding: '0 1rem' }}>
              <Plus size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {form.requiredSkills.map(s => <SkillTag key={s} skill={s} onRemove={removeSkill} />)}
            {form.requiredSkills.length === 0 && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No skills added yet</span>}
          </div>
        </Section>

        <Section title="Tags">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem' }}>
            <input className="input-field" value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="Add a tag (e.g. beginner-friendly)" />
            <button type="button" className="btn-primary" onClick={addTag} style={{ padding: '0 1rem' }}>
              <Plus size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {form.tags.map(t => (
              <span key={t} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                #{t}
                <button type="button" onClick={() => setForm({ ...form, tags: form.tags.filter(x => x !== t) })} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem' }}>×</button>
              </span>
            ))}
          </div>
        </Section>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn-secondary" onClick={() => navigate('/projects')}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.625rem 2rem' }}>
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
