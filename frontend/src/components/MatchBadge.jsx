import React from 'react';
import { Zap } from 'lucide-react';

export default function MatchBadge({ score }) {
  const cls = score >= 70 ? 'match-high' : score >= 40 ? 'match-mid' : 'match-low';
  return (
    <span className={`match-badge ${cls}`}>
      <Zap size={11} />
      {score}% match
    </span>
  );
}
