import React from 'react';
import { AppSettings, SessionLength, ActivityMode } from '../../types';

interface Props {
  settings: AppSettings;
  onClose: () => void;
  onSoundToggle: (v: boolean) => void;
  onActivityModeChange: (v: ActivityMode) => void;
  onSessionLengthChange: (v: SessionLength) => void;
  onCalmEndingToggle: (v: boolean) => void;
  onRestaurantModeToggle: (v: boolean) => void;
  onStartSession: () => void;
}

const SESSION_LENGTHS: SessionLength[] = [5, 10, 15, 20];

const ACTIVITY_MODES: { id: ActivityMode; label: string; icon: string }[] = [
  { id: 'mixed', label: 'Mixed', icon: '🎲' },
  { id: 'animals', label: 'Animals', icon: '🐱' },
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'bigsmall', label: 'Big & Small', icon: '🔍' },
  { id: 'explorer', label: 'Explorer', icon: '🌸' },
];

export function ParentPanel({
  settings,
  onClose,
  onSoundToggle,
  onActivityModeChange,
  onSessionLengthChange,
  onCalmEndingToggle,
  onRestaurantModeToggle,
  onStartSession,
}: Props) {
  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <div style={styles.title}>👋 Parent Settings</div>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close parent panel">✕</button>
        </div>

        <div style={styles.content}>
          {/* Session length */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>⏱ Session length</div>
            <div style={styles.pillRow}>
              {SESSION_LENGTHS.map(len => (
                <button
                  key={len}
                  style={{
                    ...styles.pill,
                    ...(settings.sessionLength === len ? styles.pillActive : {}),
                  }}
                  onClick={() => onSessionLengthChange(len)}
                >
                  {len} min
                </button>
              ))}
            </div>
          </div>

          {/* Activity mode */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>🎮 Activity</div>
            <div style={styles.pillRow}>
              {ACTIVITY_MODES.map(m => (
                <button
                  key={m.id}
                  style={{
                    ...styles.pill,
                    ...(settings.activityMode === m.id ? styles.pillActive : {}),
                  }}
                  onClick={() => onActivityModeChange(m.id)}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>⚙️ Options</div>
            <div style={styles.toggleList}>
              <ToggleRow
                label="🔊 Sound"
                value={settings.soundEnabled}
                onChange={onSoundToggle}
              />
              <ToggleRow
                label="🌅 Calm ending screen"
                value={settings.calmEnding}
                onChange={onCalmEndingToggle}
              />
              <ToggleRow
                label="🍽 Restaurant mode (extra quiet, no sound)"
                value={settings.restaurantMode}
                onChange={v => {
                  onRestaurantModeToggle(v);
                  if (v) onSoundToggle(false);
                }}
              />
            </div>
          </div>
        </div>

        <button style={styles.startBtn} onClick={() => { onStartSession(); onClose(); }}>
          ▶ Start Session
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={toggleStyles.row}>
      <span style={toggleStyles.label}>{label}</span>
      <button
        role="switch"
        aria-checked={value}
        style={{
          ...toggleStyles.toggle,
          background: value ? '#c8a8e9' : '#ddd',
        }}
        onClick={() => onChange(!value)}
      >
        <div style={{
          ...toggleStyles.thumb,
          transform: value ? 'translateX(22px)' : 'translateX(2px)',
        }} />
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(60,40,90,0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 100,
    animation: 'fadeIn 0.2s ease',
  },
  panel: {
    background: 'white',
    borderRadius: '32px 32px 0 0',
    width: '100%',
    maxWidth: 520,
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 -8px 40px rgba(60,40,90,0.2)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px 8px',
    position: 'sticky',
    top: 0,
    background: 'white',
    borderBottom: '1px solid #f0eaf8',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#5a4a6a',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#f0eaf8',
    fontSize: '1rem',
    color: '#8a7a9a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 600,
  },
  content: {
    padding: '16px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionLabel: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#8a7a9a',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  pillRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  pill: {
    padding: '10px 18px',
    borderRadius: 24,
    background: '#f4f0f9',
    border: '2px solid transparent',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#7a6a8a',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pillActive: {
    background: '#ede0fa',
    border: '2px solid #c8a8e9',
    color: '#6040a0',
  },
  toggleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  startBtn: {
    margin: '8px 24px 24px',
    padding: '18px',
    borderRadius: 24,
    background: 'linear-gradient(135deg, #c8a8e9 0%, #a8d8ea 100%)',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: 700,
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 4px 16px rgba(170,130,220,0.35)',
    letterSpacing: '0.03em',
  },
};

const toggleStyles: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  label: {
    fontSize: '1rem',
    color: '#5a4a6a',
    fontWeight: 500,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    flexShrink: 0,
    transition: 'background 0.25s',
    padding: 0,
  },
  thumb: {
    position: 'absolute',
    top: 3,
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
  },
};
