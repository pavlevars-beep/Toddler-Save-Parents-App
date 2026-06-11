import React, { useState, useRef, useCallback } from 'react';
import { CatSVG, DogSVG, CowSVG, SheepSVG, DuckSVG } from '../animals/AnimalSVGs';
import { useSound } from '../../hooks/useSound';

interface Props {
  soundEnabled: boolean;
  restaurantMode: boolean;
}

const ANIMALS = [
  { id: 'cat', name: 'Cat', emoji: '🐱', color: '#fde8c0', textColor: '#8a6020' },
  { id: 'dog', name: 'Dog', emoji: '🐶', color: '#e8d8c0', textColor: '#7a5030' },
  { id: 'cow', name: 'Cow', emoji: '🐮', color: '#e8f0e0', textColor: '#507040' },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', color: '#f0eee8', textColor: '#7a6858' },
  { id: 'duck', name: 'Duck', emoji: '🐥', color: '#fff8d0', textColor: '#8a7010' },
] as const;

const SOUND_WORDS: Record<string, string> = {
  cat: 'Meow!',
  dog: 'Woof!',
  cow: 'Moo!',
  sheep: 'Baa!',
  duck: 'Quack!',
};

const ANIMAL_SVGS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  cat: CatSVG,
  dog: DogSVG,
  cow: CowSVG,
  sheep: SheepSVG,
  duck: DuckSVG,
};

const SOUND_COOLDOWN_MS = 1200;

export function AnimalSounds({ soundEnabled, restaurantMode }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [soundWord, setSoundWord] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const lastSoundTime = useRef(0);
  const sound = useSound(soundEnabled && !restaurantMode);

  const current = ANIMALS[currentIndex];
  const AnimalSVG = ANIMAL_SVGS[current.id];

  const handleAnimalTap = useCallback(() => {
    const now = Date.now();
    if (now - lastSoundTime.current < SOUND_COOLDOWN_MS) return;
    lastSoundTime.current = now;

    setIsAnimating(true);
    sound.animal(current.id);
    setSoundWord(SOUND_WORDS[current.id]);

    setTimeout(() => setIsAnimating(false), 500);
    setTimeout(() => setSoundWord(null), 1800);
  }, [current.id, sound]);

  const goNext = useCallback(() => {
    sound.tap();
    setCurrentIndex(i => (i + 1) % ANIMALS.length);
    setSoundWord(null);
  }, [sound]);

  const goPrev = useCallback(() => {
    sound.tap();
    setCurrentIndex(i => (i - 1 + ANIMALS.length) % ANIMALS.length);
    setSoundWord(null);
  }, [sound]);

  return (
    <div style={styles.container}>
      <div style={styles.dotsRow}>
        {ANIMALS.map((a, i) => (
          <div
            key={a.id}
            style={{
              ...styles.dot,
              background: i === currentIndex ? current.textColor : '#ddd',
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Animal card */}
      <div
        role="button"
        aria-label={`Tap to hear the ${current.name} sound`}
        tabIndex={0}
        style={{
          ...styles.animalCard,
          background: current.color,
          transform: isAnimating ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), background 0.4s ease',
        }}
        onClick={handleAnimalTap}
        onKeyDown={e => e.key === 'Enter' && handleAnimalTap()}
      >
        <AnimalSVG size={180} />

        {soundWord && (
          <div
            style={{
              ...styles.soundWord,
              color: current.textColor,
              animation: 'floatUp 1.8s ease-out forwards',
            }}
            aria-live="polite"
          >
            {soundWord}
          </div>
        )}
      </div>

      {/* Animal name */}
      <div style={{ ...styles.animalName, color: current.textColor }}>
        {current.name}
      </div>

      {/* Navigation */}
      <div style={styles.navRow}>
        <button
          style={styles.navBtn}
          onClick={goPrev}
          aria-label="Previous animal"
        >
          ‹
        </button>
        <div style={styles.hint}>Tap the animal!</div>
        <button
          style={styles.navBtn}
          onClick={goNext}
          aria-label="Next animal"
        >
          ›
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
    gap: '16px',
    padding: '16px',
  },
  dotsRow: {
    display: 'flex',
    gap: '10px',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    transition: 'background 0.3s ease',
  },
  animalCard: {
    position: 'relative',
    width: '75vmin',
    height: '75vmin',
    maxWidth: 320,
    maxHeight: 320,
    borderRadius: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(100,80,140,0.13)',
    cursor: 'pointer',
    overflow: 'visible',
    WebkitTapHighlightColor: 'transparent',
  },
  soundWord: {
    position: 'absolute',
    top: -10,
    fontSize: '2.2rem',
    fontWeight: 700,
    pointerEvents: 'none',
    letterSpacing: '0.02em',
  },
  animalName: {
    fontSize: 'clamp(2rem, 8vw, 3rem)',
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
  navRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginTop: 4,
  },
  navBtn: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'rgba(200,168,233,0.25)',
    fontSize: '2rem',
    color: '#9070b0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid rgba(200,168,233,0.4)',
    transition: 'background 0.2s',
    lineHeight: 1,
  },
  hint: {
    fontSize: '1rem',
    color: '#b0a0c0',
    fontStyle: 'italic',
  },
};
