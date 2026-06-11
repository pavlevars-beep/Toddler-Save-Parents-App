import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSession } from './hooks/useSession';
import { AnimalSounds } from './components/activities/AnimalSounds';
import { ColorMatching } from './components/activities/ColorMatching';
import { BigSmall } from './components/activities/BigSmall';
import { PictureExplorer } from './components/activities/PictureExplorer';
import { ParentPanel } from './components/parent/ParentPanel';
import { ActivitySelector } from './components/ui/ActivitySelector';
import { SessionEndScreen } from './components/ui/SessionEndScreen';
import { ActivityMode } from './types';

// Activities available for "mixed" rotation
const MIXED_ORDER: Exclude<ActivityMode, 'mixed'>[] = ['animals', 'colors', 'bigsmall', 'explorer'];

// Long-press duration to open parent panel (ms)
const LONG_PRESS_MS = 1800;

function getActivityForMixed(index: number): Exclude<ActivityMode, 'mixed'> {
  return MIXED_ORDER[index % MIXED_ORDER.length];
}

export default function App() {
  const {
    settings,
    sessionActive,
    sessionEnded,
    timeRemaining,
    startSession,
    resetSession,
    setSoundEnabled,
    setActivityMode,
    setSessionLength,
    setCalmEnding,
    setRestaurantMode,
  } = useSession();

  const [showParent, setShowParent] = useState(false);
  const [mixedIndex, setMixedIndex] = useState(0);

  // Effective display mode (resolve 'mixed' to an actual activity)
  const [currentMode, setCurrentMode] = useState<Exclude<ActivityMode, 'mixed'>>('animals');

  useEffect(() => {
    if (settings.activityMode === 'mixed') {
      setCurrentMode(getActivityForMixed(mixedIndex));
    } else {
      setCurrentMode(settings.activityMode as Exclude<ActivityMode, 'mixed'>);
    }
  }, [settings.activityMode, mixedIndex]);

  // Long-press handler for the parent button
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLongPressStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setShowParent(true);
    }, LONG_PRESS_MS);
  }, []);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleActivityChange = useCallback((mode: ActivityMode) => {
    if (mode !== 'mixed') {
      setCurrentMode(mode as Exclude<ActivityMode, 'mixed'>);
    }
    setActivityMode(mode);
  }, [setActivityMode]);

  const handleMixedNext = useCallback(() => {
    if (settings.activityMode === 'mixed') {
      setMixedIndex(i => i + 1);
    }
  }, [settings.activityMode]);

  // Format time remaining for display
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Session ended — show calm end screen
  if (sessionEnded && settings.calmEnding) {
    return (
      <SessionEndScreen
        soundEnabled={settings.soundEnabled}
        onReset={resetSession}
      />
    );
  }

  // Home / not started state
  if (!sessionActive && !sessionEnded) {
    return (
      <div style={appStyles.homeScreen}>
        <div style={appStyles.homeContent}>
          <div style={appStyles.logo}>🌸</div>
          <h1 style={appStyles.homeTitle}>Calm Little<br />Learning World</h1>
          <p style={appStyles.homeSubtitle}>A gentle space to explore and learn</p>

          <button
            style={appStyles.startBtn}
            onClick={startSession}
            aria-label="Start"
          >
            Let's Play!
          </button>

          <button
            style={appStyles.parentBtnSmall}
            onPointerDown={handleLongPressStart}
            onPointerUp={handleLongPressEnd}
            onPointerLeave={handleLongPressEnd}
            onClick={() => setShowParent(true)}
            aria-label="Parent settings"
          >
            ⚙️ Parent Settings
          </button>
        </div>

        {showParent && (
          <ParentPanel
            settings={settings}
            onClose={() => setShowParent(false)}
            onSoundToggle={setSoundEnabled}
            onActivityModeChange={setActivityMode}
            onSessionLengthChange={setSessionLength}
            onCalmEndingToggle={setCalmEnding}
            onRestaurantModeToggle={setRestaurantMode}
            onStartSession={startSession}
          />
        )}
      </div>
    );
  }

  // Active session
  return (
    <div style={appStyles.appWrapper}>
      {/* Top bar */}
      <div style={appStyles.topBar}>
        {/* Long-press this bar to open parent panel */}
        <div
          style={appStyles.timeDisplay}
          onPointerDown={handleLongPressStart}
          onPointerUp={handleLongPressEnd}
          onPointerLeave={handleLongPressEnd}
          aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
        >
          {sessionActive ? formatTime(timeRemaining) : '—'}
        </div>

        <div style={appStyles.appName}>🌸 Calm World</div>

        {!settings.restaurantMode && (
          <button
            style={appStyles.soundBtn}
            onClick={() => setSoundEnabled(!settings.soundEnabled)}
            aria-label={settings.soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {settings.soundEnabled ? '🔊' : '🔇'}
          </button>
        )}

        {settings.restaurantMode && (
          <div style={appStyles.restaurantBadge}>🍽</div>
        )}
      </div>

      {/* Activity area */}
      <div style={appStyles.activityArea}>
        {currentMode === 'animals' && (
          <AnimalSounds
            soundEnabled={settings.soundEnabled}
            restaurantMode={settings.restaurantMode}
          />
        )}
        {currentMode === 'colors' && (
          <ColorMatching soundEnabled={settings.soundEnabled} />
        )}
        {currentMode === 'bigsmall' && (
          <BigSmall soundEnabled={settings.soundEnabled} />
        )}
        {currentMode === 'explorer' && (
          <PictureExplorer
            soundEnabled={settings.soundEnabled}
            restaurantMode={settings.restaurantMode}
          />
        )}
      </div>

      {/* Bottom nav */}
      <div style={appStyles.bottomBar}>
        {settings.activityMode === 'mixed' ? (
          <div style={appStyles.mixedBar}>
            <button style={appStyles.nextActivityBtn} onClick={handleMixedNext}>
              Next activity →
            </button>
          </div>
        ) : (
          <ActivitySelector
            current={currentMode}
            onChange={handleActivityChange}
          />
        )}
      </div>

      {/* Parent panel overlay (reachable by long-pressing the timer) */}
      {showParent && (
        <ParentPanel
          settings={settings}
          onClose={() => setShowParent(false)}
          onSoundToggle={setSoundEnabled}
          onActivityModeChange={setActivityMode}
          onSessionLengthChange={setSessionLength}
          onCalmEndingToggle={setCalmEnding}
          onRestaurantModeToggle={setRestaurantMode}
          onStartSession={() => { resetSession(); startSession(); }}
        />
      )}
    </div>
  );
}

const appStyles: Record<string, React.CSSProperties> = {
  homeScreen: {
    height: '100%',
    background: 'linear-gradient(160deg, #f0e6ff 0%, #e8f4ff 50%, #fff0e8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    position: 'relative',
  },
  homeContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    textAlign: 'center',
    maxWidth: 380,
    width: '100%',
    animation: 'fadeIn 0.6s ease',
  },
  logo: {
    fontSize: '5rem',
    lineHeight: 1,
    animation: 'gentlePulse 4s ease-in-out infinite',
  },
  homeTitle: {
    fontSize: 'clamp(2rem, 8vw, 3rem)',
    fontWeight: 800,
    color: '#6040a0',
    lineHeight: 1.2,
    margin: 0,
  },
  homeSubtitle: {
    fontSize: 'clamp(1rem, 3.5vw, 1.3rem)',
    color: '#a090b8',
    margin: 0,
    marginBottom: 8,
  },
  startBtn: {
    background: 'linear-gradient(135deg, #c8a8e9 0%, #a8d8ea 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 32,
    padding: '20px 56px',
    fontSize: 'clamp(1.3rem, 5vw, 1.8rem)',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(170,130,220,0.35)',
    letterSpacing: '0.03em',
    marginTop: 8,
    animation: 'softGlow 3s ease-in-out infinite',
  },
  parentBtnSmall: {
    background: 'rgba(200,168,233,0.15)',
    border: '1.5px solid rgba(200,168,233,0.4)',
    borderRadius: 20,
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#9070b0',
    cursor: 'pointer',
    marginTop: 8,
  },
  appWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#fef9f0',
    overflow: 'hidden',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px 8px',
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(200,168,233,0.2)',
    flexShrink: 0,
    height: 56,
  },
  timeDisplay: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#a090c0',
    minWidth: 56,
    cursor: 'default',
    userSelect: 'none',
  },
  appName: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#7a6a8a',
    letterSpacing: '0.03em',
  },
  soundBtn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'rgba(200,168,233,0.15)',
    border: '1.5px solid rgba(200,168,233,0.3)',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  restaurantBadge: {
    fontSize: '1.3rem',
    minWidth: 40,
    textAlign: 'right',
  },
  activityArea: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  bottomBar: {
    flexShrink: 0,
    background: 'rgba(255,255,255,0.9)',
    borderTop: '1px solid rgba(200,168,233,0.2)',
    paddingBottom: 'env(safe-area-inset-bottom, 8px)',
    minHeight: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mixedBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 24px',
  },
  nextActivityBtn: {
    background: 'rgba(200,168,233,0.2)',
    border: '1.5px solid rgba(200,168,233,0.4)',
    borderRadius: 24,
    padding: '10px 24px',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#7050a0',
    cursor: 'pointer',
  },
};
