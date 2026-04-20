import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Code2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]  = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: 'var(--bg-primary)',
    }}>
      {/* Subtle decorative bg shapes */}
      <div style={{ position: 'fixed', top: '8%', left: '15%', width: 480, height: 480, borderRadius: '50%', background: 'rgba(37,99,235,0.04)', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '8%', right: '15%', width: 360, height: 360, borderRadius: '50%', background: 'rgba(124,58,237,0.04)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div className="card animate-fade" style={{ width: '100%', maxWidth: 420, padding: '2.5rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Code2 size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.625rem', marginBottom: '0.3rem' }}>Welcome back</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sign in to your DevCollab account</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {/* Email */}
          <div>
            <label>Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                name="email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={handle}
                required
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={handle}
                required
                style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '0.75rem', justifyContent: 'center', marginTop: '0.25rem' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
