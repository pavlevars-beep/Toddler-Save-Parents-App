import React from 'react';
import { ActivityMode } from '../../types';

interface Props {
  current: ActivityMode;
  onChange: (mode: ActivityMode) => void;
}

const ACTIVITIES: { id: Exclude<ActivityMode, 'mixed'>; label: string; icon: string; color: string }[] = [
  { id: 'animals', label: 'Animals', icon: '🐱', color: '#fde8c0' },
  { id: 'colors', label: 'Colors', icon: '🎨', color: '#e8f0fe' },
  { id: 'bigsmall', label: 'Big & Small', icon: '🔍', color: '#f0fee8' },
  { id: 'explorer', label: 'Explore', icon: '🌸', color: '#fee8f8' },
];

export function ActivitySelector({ current, onChange }: Props) {
  return (
    <div style={styles.container} role="tablist" aria-label="Choose activity">
      {ACTIVITIES.map(a => (
        <button
          key={a.id}
          role="tab"
          aria-selected={current === a.id}
          style={{
            ...styles.tab,
            background: current === a.id ? a.color : 'transparent',
            opacity: current === a.id ? 1 : 0.55,
            transform: current === a.id ? 'scale(1.05)' : 'scale(1)',
          }}
          onClick={() => onChange(a.id)}
          aria-label={a.label}
        >
          <span style={styles.icon}>{a.icon}</span>
          <span style={styles.label}>{a.label}</span>
        </button>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    gap: '8px',
    padding: '8px 16px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    padding: '8px 14px',
    borderRadius: 20,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
    minWidth: 60,
  },
  icon: {
    fontSize: '1.5rem',
    lineHeight: 1.2,
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#5a4a6a',
    whiteSpace: 'nowrap',
  },
};
