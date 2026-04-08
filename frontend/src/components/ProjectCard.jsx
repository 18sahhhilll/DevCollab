import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Zap, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import SkillTag from './SkillTag';
import MatchBadge from './MatchBadge';

export default function ProjectCard({ project, onBookmark, isBookmarked }) {
  const navigate = useNavigate();
  const { _id, title, description, requiredSkills, teamSize, members, status, category, createdBy, matchData, createdAt } = project;

  const statusClass = { open:'status-open', closed:'status-closed', 'in-progress':'status-in-progress' }[status] || 'status-open';

  return (
    <div className="card animate-fade" style={{ padding:'1.5rem', cursor:'pointer', position:'relative' }}
      onClick={() => navigate(`/projects/${_id}`)}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
        <div style={{ flex:1, marginRight:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.35rem' }}>
            <span className={statusClass}>{status}</span>
            {category && <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{category}</span>}
          </div>
          <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:'0.375rem', lineHeight:1.3 }}>{title}</h3>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'0.5rem' }}>
          {matchData && <MatchBadge score={matchData.score} />}
          {onBookmark && (
            <button onClick={(e) => { e.stopPropagation(); onBookmark(_id); }}
              style={{ background:'transparent', border:'none', cursor:'pointer', color: isBookmarked ? '#f59e0b' : 'var(--text-muted)', transition:'color 0.2s' }}>
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize:'0.875rem', color:'var(--text-secondary)', marginBottom:'1rem', lineHeight:1.5,
        overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
        {description}
      </p>

      {/* Skills */}
      {requiredSkills?.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.375rem', marginBottom:'1rem' }}>
          {requiredSkills.slice(0, 5).map((skill) => (
            <SkillTag key={skill} skill={skill}
              matched={matchData?.matchedSkills?.map(s=>s.toLowerCase()).includes(skill.toLowerCase())} />
          ))}
          {requiredSkills.length > 5 && (
            <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', padding:'0.25rem 0.5rem' }}>+{requiredSkills.length - 5} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.8rem', color:'var(--text-muted)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <span style={{ display:'flex', alignItems:'center', gap:'4px' }}>
            <Users size={13} /> {members?.length || 1}/{teamSize}
          </span>
          {createdBy && (
            <span style={{ display:'flex', alignItems:'center', gap:'4px' }}>
              by <span style={{ color:'var(--text-secondary)', fontWeight:500 }}>{createdBy.name}</span>
            </span>
          )}
        </div>
        {createdAt && (
          <span style={{ display:'flex', alignItems:'center', gap:'4px' }}>
            <Calendar size={13} /> {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  );
}
