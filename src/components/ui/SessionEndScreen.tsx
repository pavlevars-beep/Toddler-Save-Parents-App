import React, { useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

interface Props {
  soundEnabled: boolean;
  onReset: () => void;
}

const REAL_WORLD_SUGGESTIONS = [
  { emoji: '🧸', text: 'Give your toy a big hug!' },
  { emoji: '👋', text: 'Wave goodbye to the animals!' },
  { emoji: '🔴', text: 'Find something red in the room!' },
  { emoji: '🌿', text: 'Go look out the window!' },
  { emoji: '🤗', text: 'Time for a big cuddle!' },
];

export function SessionEndScreen({ soundEnabled, onReset }: Props) {
  const sound = useSound(soundEnabled);

  useEffect(() => {
    sound.sessionEnd();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const suggestion = REAL_WORLD_SUGGESTIONS[
    Math.floor(Math.random() * REAL_WORLD_SUGGESTIONS.length)
  ];

  return (
    <div style={styles.container}>
      <div style={{ animation: 'fadeIn 0.8s ease' }}>
        <div style={styles.emoji}>🌙</div>
        <div style={styles.title}>All done!</div>
        <div style={styles.subtitle}>Great job today!</div>

        <div style={styles.suggestionCard}>
          <div style={styles.suggestionEmoji}>{suggestion.emoji}</div>
          <div style={styles.suggestionText}>{suggestion.text}</div>
        </div>

        <button
          style={styles.againBtn}
          onClick={onReset}
          aria-label="Play again"
        >
          Play again
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    background: 'linear-gradient(180deg, #e8e0f8 0%, #f8f0ff 100%)',
    padding: '32px 24px',
    textAlign: 'center',
    animation: 'sessionEndFade 1.2s ease',
  },
  emoji: {
    fontSize: '5rem',
    marginBottom: 16,
  },
  title: {
    fontSize: 'clamp(2.5rem, 10vw, 4rem)',
    fontWeight: 800,
    color: '#7050a0',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
    color: '#a090c0',
    marginBottom: 40,
  },
  suggestionCard: {
    background: 'white',
    borderRadius: 32,
    padding: '24px 32px',
    boxShadow: '0 8px 32px rgba(100,80,140,0.12)',
    marginBottom: 40,
    maxWidth: 320,
  },
  suggestionEmoji: {
    fontSize: '3rem',
    marginBottom: 12,
  },
  suggestionText: {
    fontSize: 'clamp(1.2rem, 4.5vw, 1.6rem)',
    fontWeight: 600,
    color: '#5a4a6a',
    lineHeight: 1.4,
  },
  againBtn: {
    background: 'linear-gradient(135deg, #c8a8e9 0%, #a8d8ea 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 32,
    padding: '18px 48px',
    fontSize: '1.3rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(170,130,220,0.35)',
    letterSpacing: '0.03em',
  },
};
