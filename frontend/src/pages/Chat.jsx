import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Send, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function Chat() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef();
  const typingTimer = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, msgRes] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/chat/${projectId}`),
        ]);
        setProject(projRes.data);
        setMessages(msgRes.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Cannot access this chat');
        navigate('/projects');
      } finally { setLoading(false); }
    };
    load();
  }, [projectId]);

  useEffect(() => {
    if (!socket || !projectId) return;
    socket.emit('join_project', { projectId });

    socket.on('new_message', (msg) => setMessages(prev => [...prev, msg]));
    socket.on('user_typing', ({ user: u }) => setTyping(prev => [...prev.filter(x => x._id !== u._id), u]));
    socket.on('user_stop_typing', ({ userId }) => setTyping(prev => prev.filter(x => x._id !== userId)));
    socket.on('error', ({ message }) => toast.error(message));

    return () => {
      socket.emit('leave_project', { projectId });
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
      socket.off('error');
    };
  }, [socket, projectId]);

  // Auto-scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    socket.emit('send_message', { projectId, content: input.trim() });
    socket.emit('stop_typing', { projectId });
    setInput('');
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (!socket) return;
    socket.emit('typing', { projectId });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socket.emit('stop_typing', { projectId }), 1500);
  };

  const isMe = (msg) => (msg.sender?._id || msg.sender) === user._id;

  const groupMessages = (msgs) => {
    const grouped = [];
    msgs.forEach((msg, i) => {
      const prev = msgs[i - 1];
      const sameUser = prev && (prev.sender?._id || prev.sender) === (msg.sender?._id || msg.sender);
      const timeDiff = prev && (new Date(msg.createdAt) - new Date(prev.createdAt)) < 60000;
      grouped.push({ ...msg, showHeader: !sameUser || !timeDiff });
    });
    return grouped;
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'4rem' }}><div className="spinner" /></div>;

  const grouped = groupMessages(messages);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 120px)', maxWidth:800, margin:'0 auto' }} className="animate-fade">
      {/* Header */}
      <div className="card" style={{ padding:'1rem 1.25rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'1rem' }}>
        <button onClick={() => navigate(`/projects/${projectId}`)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)' }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ flex:1 }}>
          <h2 style={{ fontSize:'1rem', marginBottom:'2px' }}>{project?.title}</h2>
          <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'4px' }}>
            <Users size={12} /> {project?.members?.length} members
          </div>
        </div>
        <div style={{ display:'flex' }}>
          {project?.members?.slice(0, 4).map((m, i) => (
            <div key={m._id || i} style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:700, marginLeft: i > 0 ? '-6px' : 0, border:'2px solid var(--bg-card)', zIndex: 10-i }}>
              {m.name?.[0]?.toUpperCase() || '?'}
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'0.5rem 0', display:'flex', flexDirection:'column', gap:'0.125rem' }}>
        {messages.length === 0 && (
          <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)', fontSize:'0.875rem' }}>
            No messages yet. Say hi to your team! 👋
          </div>
        )}
        {grouped.map((msg, i) => {
          const me = isMe(msg);
          return (
            <div key={msg._id || i} style={{ display:'flex', flexDirection: me ? 'row-reverse' : 'row', alignItems:'flex-end', gap:'0.5rem', padding:'0 0.25rem', marginTop: msg.showHeader ? '0.875rem' : '0.125rem' }}>
              {!me && msg.showHeader && (
                <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:700, flexShrink:0 }}>
                  {msg.sender?.name?.[0]?.toUpperCase()}
                </div>
              )}
              {!me && !msg.showHeader && <div style={{ width:28, flexShrink:0 }} />}
              <div style={{ maxWidth:'72%' }}>
                {msg.showHeader && !me && (
                  <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:'0.25rem', marginLeft:'0.25rem' }}>
                    {msg.sender?.name} • {format(new Date(msg.createdAt), 'HH:mm')}
                  </div>
                )}
                <div style={{
                  padding:'0.625rem 1rem', borderRadius: me ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                  background: me ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--bg-card)',
                  border: me ? 'none' : '1px solid var(--border)',
                  fontSize:'0.9rem', lineHeight:1.5,
                  color: me ? '#fff' : 'var(--text-primary)',
                  wordBreak:'break-word',
                }}>
                  {msg.content}
                </div>
                {msg.showHeader && me && (
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'0.2rem', textAlign:'right' }}>
                    {format(new Date(msg.createdAt), 'HH:mm')}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing.length > 0 && (
          <div style={{ padding:'0.5rem 1rem', fontSize:'0.78rem', color:'var(--text-muted)', fontStyle:'italic' }}>
            {typing.map(t=>t.name).join(', ')} {typing.length === 1 ? 'is' : 'are'} typing
            <span className="pulse-dot" style={{ display:'inline-block', marginLeft:'4px' }}>...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} style={{ display:'flex', gap:'0.75rem', padding:'1rem 0 0' }}>
        <input className="input-field" value={input} onChange={handleTyping}
          placeholder="Type a message..." style={{ flex:1 }} />
        <button type="submit" className="btn-primary" disabled={!input.trim()} style={{ padding:'0 1.25rem', flexShrink:0 }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
