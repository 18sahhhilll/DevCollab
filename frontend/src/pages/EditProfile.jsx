import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SkillTag from '../components/SkillTag';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus } from 'lucide-react';

const ROLES = ['Frontend Developer','Backend Developer','Full Stack Developer','Mobile Developer','DevOps Engineer','Data Scientist','UI/UX Designer','Product Manager','Other'];
const EXP = ['Beginner','Intermediate','Advanced','Expert'];

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', bio:'', role:'Other', experienceLevel:'Beginner', githubUsername:'', availability:true, skills:[], interests:[] });
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setForm({ name: data.name || '', bio: data.bio || '', role: data.role || 'Other', experienceLevel: data.experienceLevel || 'Beginner', githubUsername: data.githubUsername || '', availability: data.availability ?? true, skills: data.skills || [], interests: data.interests || [] });
      } catch {}
    };
    load();
  }, []);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) setForm({ ...form, skills: [...form.skills, s] });
    setSkillInput('');
  };

  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter(x => x !== s) });

  const addInterest = () => {
    const i = interestInput.trim();
    if (i && !form.interests.includes(i)) setForm({ ...form, interests: [...form.interests, i] });
    setInterestInput('');
  };

  const removeInterest = (i) => setForm({ ...form, interests: form.interests.filter(x => x !== i) });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data);
      toast.success('Profile updated!');
      navigate('/profile');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
    finally { setLoading(false); }
  };

  const Section = ({ title, children }) => (
    <div className="card" style={{ padding:'1.75rem', marginBottom:'1.25rem' }}>
      <h2 style={{ fontSize:'1.05rem', marginBottom:'1.25rem', paddingBottom:'0.75rem', borderBottom:'1px solid var(--border)' }}>{title}</h2>
      {children}
    </div>
  );

  const Field = ({ label, children }) => (
    <div style={{ marginBottom:'1.125rem' }}><label>{label}</label>{children}</div>
  );

  return (
    <div style={{ maxWidth:680, margin:'0 auto' }} className="animate-fade">
      <button onClick={() => navigate('/profile')} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.5rem', fontSize:'0.875rem' }}>
        <ArrowLeft size={16} /> Back to Profile
      </button>
      <h1 style={{ fontSize:'1.75rem', marginBottom:'1.5rem' }}>Edit Profile</h1>

      <form onSubmit={submit}>
        <Section title="Basic Information">
          <Field label="Full Name"><input name="name" className="input-field" value={form.name} onChange={handle} required /></Field>
          <Field label="Bio"><textarea name="bio" className="input-field" value={form.bio} onChange={handle} rows={4} placeholder="Tell developers about yourself..." /></Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <Field label="Role">
              <select name="role" className="input-field" value={form.role} onChange={handle}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Experience Level">
              <select name="experienceLevel" className="input-field" value={form.experienceLevel} onChange={handle}>
                {EXP.map(e => <option key={e}>{e}</option>)}
              </select>
            </Field>
          </div>
          <Field label="GitHub Username">
            <input name="githubUsername" className="input-field" value={form.githubUsername} onChange={handle} placeholder="e.g. torvalds" />
          </Field>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <input type="checkbox" id="availability" name="availability" checked={form.availability} onChange={handle} style={{ width:16, height:16, accentColor:'var(--accent)' }} />
            <label htmlFor="availability" style={{ marginBottom:0, cursor:'pointer', color:'var(--text-primary)' }}>Available for projects</label>
          </div>
        </Section>

        <Section title="Skills">
          <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.875rem' }}>
            <input className="input-field" value={skillInput} onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}}
              placeholder="Add a skill (e.g. React, Python)" />
            <button type="button" className="btn-primary" onClick={addSkill} style={{ padding:'0 1rem', whiteSpace:'nowrap' }}>
              <Plus size={16} />
            </button>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
            {form.skills.map(s => <SkillTag key={s} skill={s} onRemove={removeSkill} />)}
            {form.skills.length === 0 && <span style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>No skills added yet</span>}
          </div>
        </Section>

        <Section title="Interests">
          <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.875rem' }}>
            <input className="input-field" value={interestInput} onChange={e => setInterestInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); }}}
              placeholder="Add an interest (e.g. Machine Learning)" />
            <button type="button" className="btn-primary" onClick={addInterest} style={{ padding:'0 1rem' }}>
              <Plus size={16} />
            </button>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
            {form.interests.map(i => (
              <span key={i} style={{ fontSize:'0.78rem', color:'var(--text-secondary)', background:'rgba(255,255,255,0.05)', padding:'0.25rem 0.75rem', borderRadius:'9999px', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'4px' }}>
                {i}
                <button type="button" onClick={() => removeInterest(i)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:1 }}>×</button>
              </span>
            ))}
            {form.interests.length === 0 && <span style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>No interests added yet</span>}
          </div>
        </Section>

        <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end' }}>
          <button type="button" className="btn-secondary" onClick={() => navigate('/profile')}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding:'0.625rem 2rem' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
