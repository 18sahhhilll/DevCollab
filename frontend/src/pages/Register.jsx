import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Code2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const ROLES = ['Frontend Developer','Backend Developer','Full Stack Developer','Mobile Developer','DevOps Engineer','Data Scientist','UI/UX Designer','Product Manager','Other'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'Other' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to DevCollab 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', background:'var(--bg-primary)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'5%', right:'15%', width:350, height:350, borderRadius:'50%', background:'rgba(99,102,241,0.07)', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'5%', left:'15%', width:280, height:280, borderRadius:'50%', background:'rgba(6,182,212,0.06)', filter:'blur(60px)', pointerEvents:'none' }} />

      <div className="card animate-fade" style={{ width:'100%', maxWidth:440, padding:'2.5rem' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:52, height:52, borderRadius:'0.875rem', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
            <Code2 size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize:'1.75rem', marginBottom:'0.375rem' }}>Join DevCollab</h1>
          <p style={{ fontSize:'0.9rem' }}>Find your perfect dev team</p>
        </div>

        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'1.125rem' }}>
          <div>
            <label>Full Name</label>
            <div style={{ position:'relative' }}>
              <User size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
              <input name="name" type="text" className="input-field" placeholder="John Doe"
                value={form.name} onChange={handle} required style={{ paddingLeft:'2.5rem' }} />
            </div>
          </div>
          <div>
            <label>Email address</label>
            <div style={{ position:'relative' }}>
              <Mail size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
              <input name="email" type="email" className="input-field" placeholder="you@example.com"
                value={form.email} onChange={handle} required style={{ paddingLeft:'2.5rem' }} />
            </div>
          </div>
          <div>
            <label>Password</label>
            <div style={{ position:'relative' }}>
              <Lock size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
              <input name="password" type={showPw ? 'text' : 'password'} className="input-field"
                placeholder="Min 6 characters" value={form.password} onChange={handle} required style={{ paddingLeft:'2.5rem', paddingRight:'2.5rem' }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label>Your Role</label>
            <select name="role" className="input-field" value={form.role} onChange={handle}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding:'0.75rem', marginTop:'0.25rem' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color:'var(--accent-light)', fontWeight:600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
