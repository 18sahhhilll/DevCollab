import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Code2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', background:'var(--bg-primary)', position:'relative', overflow:'hidden' }}>
      {/* Background blobs */}
      <div style={{ position:'absolute', top:'10%', left:'20%', width:400, height:400, borderRadius:'50%', background:'rgba(99,102,241,0.07)', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'20%', width:300, height:300, borderRadius:'50%', background:'rgba(139,92,246,0.07)', filter:'blur(60px)', pointerEvents:'none' }} />

      <div className="card animate-fade" style={{ width:'100%', maxWidth:420, padding:'2.5rem' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:52, height:52, borderRadius:'0.875rem', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
            <Code2 size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize:'1.75rem', marginBottom:'0.375rem' }}>Welcome back</h1>
          <p style={{ fontSize:'0.9rem' }}>Sign in to your DevCollab account</p>
        </div>

        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
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
                placeholder="••••••••" value={form.password} onChange={handle} required style={{ paddingLeft:'2.5rem', paddingRight:'2.5rem' }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding:'0.75rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.875rem' }}>
          Don't have an account? <Link to="/register" style={{ color:'var(--accent-light)', fontWeight:600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
