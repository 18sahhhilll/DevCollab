import React from 'react';

export default function StatsCard({ icon: Icon, label, value, color = '#6366f1', sub }) {
  return (
    <div className="card" style={{ padding:'1.5rem', display:'flex', alignItems:'center', gap:'1rem' }}>
      <div style={{ width:48, height:48, borderRadius:'0.75rem', background:`rgba(${hexToRgb(color)},0.15)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:500, marginBottom:'0.25rem' }}>{label}</div>
        <div style={{ fontSize:'1.75rem', fontWeight:800, color:'var(--text-primary)', lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'0.25rem' }}>{sub}</div>}
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}
