import React, { useState, useCallback, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

interface Props {
  soundEnabled: boolean;
}

type Target = 'big' | 'small';

const OBJECT_PAIRS = [
  {
    name: 'Balloon',
    big: (s: number) => (
      <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
        <ellipse cx="50" cy="42" rx="34" ry="40" fill="#f07070" />
        <ellipse cx="38" cy="28" rx="10" ry="7" fill="rgba(255,255,255,0.3)" transform="rotate(-30 38 28)" />
        <line x1="50" y1="82" x2="50" y2="100" stroke="#c05050" strokeWidth="2" />
      </svg>
    ),
    color: '#fde8e8',
  },
  {
    name: 'Star',
    big: (s: number) => (
      <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
        <polygon
          points="50,8 61,35 90,35 67,54 76,82 50,65 24,82 33,54 10,35 39,35"
          fill="#e8c820"
        />
      </svg>
    ),
    color: '#fffbe0',
  },
  {
    name: 'Apple',
    big: (s: number) => (
      <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 20 C50 20 60 5 70 15" stroke="#5a8020" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="50" cy="62" rx="32" ry="35" fill="#c84040" />
        <ellipse cx="35" cy="45" rx="10" ry="8" fill="rgba(255,255,255,0.25)" transform="rotate(-20 35 45)" />
      </svg>
    ),
    color: '#fde8e8',
  },
  {
    name: 'Flower',
    big: (s: number) => (
      <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="30" r="14" fill="#f07898" />
        <circle cx="70" cy="50" r="14" fill="#f07898" />
        <circle cx="50" cy="70" r="14" fill="#f07898" />
        <circle cx="30" cy="50" r="14" fill="#f07898" />
        <circle cx="50" cy="50" r="16" fill="#f8e840" />
      </svg>
    ),
    color: '#fee8f0',
  },
] as const;

function buildRound() {
  const obj = OBJECT_PAIRS[Math.floor(Math.random() * OBJECT_PAIRS.length)];
  const target: Target = Math.random() > 0.5 ? 'big' : 'small';
  const bigOnLeft = Math.random() > 0.5;
  return { obj, target, bigOnLeft };
}

export function BigSmall({ soundEnabled }: Props) {
  const sound = useSound(soundEnabled);
  const [round, setRound] = useState(() => buildRound());
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [tappedSide, setTappedSide] = useState<'big' | 'small' | null>(null);

  const nextRound = useCallback(() => {
    setResult(null);
    setTappedSide(null);
    setRound(buildRound());
  }, []);

  useEffect(() => {
    if (result === 'correct') {
      const t = setTimeout(nextRound, 2200);
      return () => clearTimeout(t);
    }
  }, [result, nextRound]);

  const handleTap = useCallback((which: 'big' | 'small') => {
    if (result) return;
    setTappedSide(which);
    if (which === round.target) {
      setResult('correct');
      sound.success();
    } else {
      sound.tap();
      setTimeout(() => setTappedSide(null), 500);
    }
  }, [result, round.target, sound]);

  const { obj, target, bigOnLeft } = round;

  const bigSize = 160;
  const smallSize = 80;

  const BigBtn = () => (
    <button
      style={{
        ...styles.objectBtn,
        width: bigSize + 24,
        height: bigSize + 24,
        background: obj.color,
        transform:
          tappedSide === 'big' && result === 'correct' ? 'scale(1.1)' :
          tappedSide === 'big' && !result ? 'scale(0.94)' : 'scale(1)',
        boxShadow: result === 'correct' && tappedSide === 'big'
          ? '0 0 0 8px rgba(100,180,100,0.4), 0 8px 24px rgba(0,0,0,0.1)'
          : '0 4px 16px rgba(0,0,0,0.08)',
        transition: 'transform 0.25s, box-shadow 0.3s',
      }}
      onClick={() => handleTap('big')}
      aria-label="Big object"
    >
      {obj.big(bigSize)}
    </button>
  );

  const SmallBtn = () => (
    <button
      style={{
        ...styles.objectBtn,
        width: smallSize + 24,
        height: smallSize + 24,
        background: obj.color,
        transform:
          tappedSide === 'small' && result === 'correct' ? 'scale(1.1)' :
          tappedSide === 'small' && !result ? 'scale(0.94)' : 'scale(1)',
        boxShadow: result === 'correct' && tappedSide === 'small'
          ? '0 0 0 8px rgba(100,180,100,0.4), 0 8px 24px rgba(0,0,0,0.1)'
          : '0 4px 16px rgba(0,0,0,0.08)',
        transition: 'transform 0.25s, box-shadow 0.3s',
      }}
      onClick={() => handleTap('small')}
      aria-label="Small object"
    >
      {obj.big(smallSize)}
    </button>
  );

  return (
    <div style={styles.container}>
      <div style={styles.prompt}>
        Tap the{' '}
        <span style={{ fontWeight: 800, color: target === 'big' ? '#7a50b8' : '#50a870' }}>
          {target === 'big' ? 'BIG' : 'small'}
        </span>{' '}
        {obj.name}!
      </div>

      <div style={styles.objectsRow}>
        {bigOnLeft ? (
          <>
            <BigBtn />
            <SmallBtn />
          </>
        ) : (
          <>
            <SmallBtn />
            <BigBtn />
          </>
        )}
      </div>

      {result === 'correct' && (
        <div style={styles.successBanner} aria-live="polite">
          🌟 Yes! Well done!
        </div>
      )}
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
    gap: '24px',
    padding: '20px',
  },
  prompt: {
    fontSize: 'clamp(1.6rem, 6vw, 2.4rem)',
    fontWeight: 600,
    color: '#5a4a6a',
    textAlign: 'center',
  },
  objectsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  objectBtn: {
    borderRadius: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    padding: 0,
  },
  successBanner: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#6a9a50',
    animation: 'fadeIn 0.3s ease',
  },
};
