import React, { useState, useCallback, useEffect } from 'react';
import { useSound } from '../../hooks/useSound';

interface Props {
  soundEnabled: boolean;
}

const COLORS = [
  { id: 'red', name: 'Red', value: '#e85555', light: '#fde8e8' },
  { id: 'blue', name: 'Blue', value: '#5588e8', light: '#e8effe' },
  { id: 'yellow', name: 'Yellow', value: '#e8c820', light: '#fffbe0' },
  { id: 'green', name: 'Green', value: '#55b870', light: '#e8f8ee' },
] as const;

type ColorId = typeof COLORS[number]['id'];

// Simple shapes for visual variety
type Shape = 'circle' | 'square' | 'star' | 'heart';
const SHAPES: Shape[] = ['circle', 'square', 'star', 'heart'];

function ColorShape({ color, shape, size = 90 }: { color: string; shape: Shape; size?: number }) {
  const s = size;
  if (shape === 'circle') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="44" fill={color} />
      </svg>
    );
  }
  if (shape === 'square') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
        <rect x="8" y="8" width="84" height="84" rx="18" fill={color} />
      </svg>
    );
  }
  if (shape === 'star') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
        <polygon
          points="50,8 61,35 90,35 67,54 76,82 50,65 24,82 33,54 10,35 39,35"
          fill={color}
        />
      </svg>
    );
  }
  // heart
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 80 C50 80 10 55 10 30 C10 18 20 10 30 10 C38 10 45 16 50 22 C55 16 62 10 70 10 C80 10 90 18 90 30 C90 55 50 80 50 80Z" fill={color} />
    </svg>
  );
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildRound() {
  const shuffledColors = shuffle([...COLORS]);
  const targetColor = shuffledColors[0];
  // Pick 3 options that include the target
  const options = shuffle([
    shuffledColors[0],
    shuffledColors[1],
    shuffledColors[2],
  ]);
  const targetShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const optionShapes = options.map(() => SHAPES[Math.floor(Math.random() * SHAPES.length)]);
  return { targetColor, options, targetShape, optionShapes };
}

export function ColorMatching({ soundEnabled }: Props) {
  const sound = useSound(soundEnabled);
  const [round, setRound] = useState(() => buildRound());
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [wrongId, setWrongId] = useState<ColorId | null>(null);

  const nextRound = useCallback(() => {
    setResult(null);
    setWrongId(null);
    setRound(buildRound());
  }, []);

  useEffect(() => {
    if (result === 'correct') {
      const t = setTimeout(nextRound, 2000);
      return () => clearTimeout(t);
    }
  }, [result, nextRound]);

  const handleChoice = useCallback((colorId: ColorId) => {
    if (result) return;
    if (colorId === round.targetColor.id) {
      setResult('correct');
      sound.success();
    } else {
      setWrongId(colorId);
      sound.tap();
      setTimeout(() => setWrongId(null), 600);
    }
  }, [result, round.targetColor.id, sound]);

  const target = round.targetColor;

  return (
    <div style={styles.container}>
      <div style={styles.prompt}>
        Find the <span style={{ color: target.value, fontWeight: 800 }}>{target.name}</span> one!
      </div>

      {/* Target object */}
      <div style={{ ...styles.targetCard, background: target.light }}>
        <ColorShape color={target.value} shape={round.targetShape} size={100} />
        {result === 'correct' && (
          <div style={styles.successOverlay}>
            <div style={styles.successText}>Well done! 🌟</div>
          </div>
        )}
      </div>

      {/* Choices */}
      <div style={styles.choicesRow}>
        {round.options.map((c, i) => {
          const isWrong = wrongId === c.id;
          const isCorrect = result === 'correct' && c.id === target.id;
          return (
            <button
              key={`${c.id}-${i}`}
              style={{
                ...styles.choiceBtn,
                background: c.light,
                transform: isWrong ? 'scale(0.92)' : isCorrect ? 'scale(1.1)' : 'scale(1)',
                boxShadow: isCorrect
                  ? `0 0 0 6px ${c.value}55, 0 8px 24px ${c.value}44`
                  : '0 4px 16px rgba(0,0,0,0.08)',
                transition: 'transform 0.25s, box-shadow 0.3s',
              }}
              onClick={() => handleChoice(c.id as ColorId)}
              aria-label={`Tap for ${c.name}`}
            >
              <ColorShape color={c.value} shape={round.optionShapes[i]} size={80} />
            </button>
          );
        })}
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
    gap: '20px',
    padding: '20px',
  },
  prompt: {
    fontSize: 'clamp(1.5rem, 5.5vw, 2.2rem)',
    fontWeight: 600,
    color: '#5a4a6a',
    textAlign: 'center',
  },
  targetCard: {
    position: 'relative',
    width: '72vmin',
    height: '72vmin',
    maxWidth: 260,
    maxHeight: 260,
    borderRadius: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 24px rgba(100,80,140,0.12)',
  },
  successOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: 40,
    background: 'rgba(255,255,255,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.3s ease',
  },
  successText: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#6a9a50',
    animation: 'successBounce 0.5s ease',
  },
  choicesRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  choiceBtn: {
    width: '26vmin',
    height: '26vmin',
    maxWidth: 110,
    maxHeight: 110,
    minWidth: 80,
    minHeight: 80,
    borderRadius: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
  },
};
