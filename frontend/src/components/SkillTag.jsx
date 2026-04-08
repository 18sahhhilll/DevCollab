import React from 'react';

export default function SkillTag({ skill, matched = false, onRemove }) {
  return (
    <span className="skill-tag" style={matched ? {
      background: 'rgba(16,185,129,0.15)',
      color: '#10b981',
      borderColor: 'rgba(16,185,129,0.35)',
    } : {}}>
      {skill}
      {onRemove && (
        <button onClick={() => onRemove(skill)}
          style={{ background:'transparent', border:'none', cursor:'pointer', marginLeft:'4px', color:'inherit', fontSize:'0.8rem', lineHeight:1 }}>
          ×
        </button>
      )}
    </span>
  );
}
