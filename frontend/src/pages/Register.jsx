import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Code2, Mail, Lock, User, Eye, EyeOff, ChevronDown } from 'lucide-react';

const ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Mobile Developer', 'DevOps Engineer', 'Data Scientist',
  'UI/UX Designer', 'Product Manager', 'Other',
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'Other' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]  = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Welcome to DevCollab! 🎉');
      navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
      {/* Decorative bg */}
      <div style={{ position: 'fixed', top: '5%', right: '12%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(37,99,235,0.04)', filter: 'blur(90px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '5%', left: '12%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(124,58,237,0.04)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div className="card animate-fade" style={{ width: '100%', maxWidth: 440, padding: '2.5rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Code2 size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.625rem', marginBottom: '0.3rem' }}>Join DevCollab</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Find your perfect dev team</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {/* Name */}
          <div>
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input name="name" type="text" className="input-field" placeholder="Jane Smith"
                value={form.name} onChange={handle} required style={{ paddingLeft: '2.25rem' }} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label>Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input name="email" type="email" className="input-field" placeholder="you@example.com"
                value={form.email} onChange={handle} required style={{ paddingLeft: '2.25rem' }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input name="password" type={showPw ? 'text' : 'password'} className="input-field"
                placeholder="Min 6 characters" value={form.password} onChange={handle} required
                style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label>Your Role</label>
            <select name="role" className="input-field" value={form.role} onChange={handle}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}
            style={{ padding: '0.75rem', justifyContent: 'center', marginTop: '0.25rem' }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
