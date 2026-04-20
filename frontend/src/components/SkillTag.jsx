import React from 'react';

/**
 * Skill pill chip. Pass `matched=true` to highlight skills that match project requirements.
 * Pass `onRemove` to make it removable (e.g. in forms).
 */
export default function SkillTag({ skill, matched = false, onRemove }) {
  return (
    <span
      className={`skill-tag${matched ? ' matched' : ''}`}
    >
      {skill}
      {onRemove && (
        <button
          onClick={() => onRemove(skill)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '2px',
            color: 'inherit',
            fontSize: '0.85rem',
            lineHeight: 1,
            opacity: 0.7,
            padding: 0,
          }}
          aria-label={`Remove ${skill}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
