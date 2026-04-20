import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Zap, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import SkillTag from './SkillTag';
import MatchBadge from './MatchBadge';

/* Neutral avatar initial — single letter on a muted background */
const Avatar = ({ name, size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: 'var(--bg-muted)', border: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: size * 0.4, flexShrink: 0,
    color: 'var(--text-secondary)',
  }}>
    {name?.[0]?.toUpperCase() || '?'}
  </div>
);

export default function ProjectCard({ project, onBookmark, isBookmarked }) {
  const navigate = useNavigate();
  const { _id, title, description, requiredSkills, teamSize, members, status, category, createdBy, matchData, createdAt } = project;

  const statusCls = { open: 'status-open', closed: 'status-closed', 'in-progress': 'status-in-progress' }[status] || 'status-open';

  return (
    <div
      className="card card-clickable animate-fade"
      style={{ padding: '1.375rem', cursor: 'pointer', position: 'relative' }}
      onClick={() => navigate(`/projects/${_id}`)}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <span className={statusCls}>{status}</span>
            {category && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{category}</span>}
          </div>
          <h3 style={{ fontWeight: 700, fontSize: '0.975rem', lineHeight: 1.3, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
          {matchData && <MatchBadge score={matchData.score} />}
          {onBookmark && (
            <button
              onClick={(e) => { e.stopPropagation(); onBookmark(_id); }}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isBookmarked ? '#d97706' : 'var(--text-muted)', transition: 'color 0.15s', display: 'flex', alignItems: 'center', padding: '2px' }}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              {isBookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.55,
        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>
        {description}
      </p>

      {/* Skills */}
      {requiredSkills?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
          {requiredSkills.slice(0, 5).map((skill) => (
            <SkillTag
              key={skill}
              skill={skill}
              matched={matchData?.matchedSkills?.map((s) => s.toLowerCase()).includes(skill.toLowerCase())}
            />
          ))}
          {requiredSkills.length > 5 && (
            <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)', padding: '0.2rem 0.4rem' }}>
              +{requiredSkills.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Users size={12} /> {members?.length || 1}/{teamSize}
          </span>
          {createdBy && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              by <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{createdBy.name}</span>
            </span>
          )}
        </div>
        {createdAt && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Calendar size={12} /> {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  );
}
