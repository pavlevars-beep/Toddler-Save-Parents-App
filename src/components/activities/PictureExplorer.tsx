import React, { useState, useCallback } from 'react';
import { useSound } from '../../hooks/useSound';

interface Props {
  soundEnabled: boolean;
  restaurantMode: boolean;
}

interface Hotspot {
  id: string;
  label: string;
  x: number; // % of container width
  y: number; // % of container height
  size: number; // px radius of tap target
}

type SceneId = 'garden' | 'farm' | 'sky';

interface Scene {
  id: SceneId;
  name: string;
  hotspots: Hotspot[];
  bg: string;
}

const SCENES: Scene[] = [
  {
    id: 'garden',
    name: 'Garden',
    bg: 'linear-gradient(180deg, #a8d8f0 0%, #c8eaa0 60%, #8ec870 100%)',
    hotspots: [
      { id: 'sun', label: 'Sun ☀️', x: 75, y: 12, size: 44 },
      { id: 'flower', label: 'Flower 🌸', x: 30, y: 68, size: 36 },
      { id: 'tree', label: 'Tree 🌳', x: 72, y: 55, size: 38 },
      { id: 'bird', label: 'Bird 🐦', x: 50, y: 25, size: 30 },
      { id: 'butterfly', label: 'Butterfly 🦋', x: 20, y: 40, size: 28 },
    ],
  },
  {
    id: 'farm',
    name: 'Farm',
    bg: 'linear-gradient(180deg, #b8d8f8 0%, #e8d090 55%, #90c870 100%)',
    hotspots: [
      { id: 'barn', label: 'Barn 🏠', x: 65, y: 55, size: 44 },
      { id: 'hay', label: 'Hay 🌾', x: 30, y: 72, size: 32 },
      { id: 'cloud', label: 'Cloud ☁️', x: 25, y: 15, size: 36 },
      { id: 'fence', label: 'Fence 🪵', x: 55, y: 75, size: 28 },
      { id: 'tractor', label: 'Tractor 🚜', x: 20, y: 60, size: 36 },
    ],
  },
  {
    id: 'sky',
    name: 'Sky',
    bg: 'linear-gradient(180deg, #5090e0 0%, #80c0f0 40%, #c8e8f8 80%, #e8f4d8 100%)',
    hotspots: [
      { id: 'moon', label: 'Moon 🌙', x: 70, y: 18, size: 36 },
      { id: 'star1', label: 'Star ⭐', x: 30, y: 22, size: 28 },
      { id: 'star2', label: 'Star ⭐', x: 55, y: 10, size: 24 },
      { id: 'cloud2', label: 'Cloud ☁️', x: 20, y: 35, size: 36 },
      { id: 'airplane', label: 'Plane ✈️', x: 60, y: 42, size: 30 },
    ],
  },
];

function GardenSVG() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {/* Ground */}
      <rect x="0" y="250" width="400" height="150" fill="#78b848" rx="0" />
      <ellipse cx="200" cy="250" rx="220" ry="18" fill="#90c860" />
      {/* Sun */}
      <circle cx="300" cy="55" r="38" fill="#f8d840" />
      <circle cx="300" cy="55" r="30" fill="#f8e060" />
      {[0,45,90,135,180,225,270,315].map(a => (
        <line key={a}
          x1={300 + 34 * Math.cos(a * Math.PI/180)}
          y1={55 + 34 * Math.sin(a * Math.PI/180)}
          x2={300 + 46 * Math.cos(a * Math.PI/180)}
          y2={55 + 46 * Math.sin(a * Math.PI/180)}
          stroke="#f8d040" strokeWidth="4" strokeLinecap="round"
        />
      ))}
      {/* Tree */}
      <rect x="278" y="190" width="16" height="70" rx="8" fill="#8a5a30" />
      <circle cx="286" cy="185" r="38" fill="#60a840" />
      <circle cx="268" cy="200" r="28" fill="#70b848" />
      <circle cx="304" cy="200" r="28" fill="#70b848" />
      {/* Flower 1 */}
      <rect x="117" y="295" width="8" height="40" rx="4" fill="#68a830" />
      <circle cx="121" cy="276" r="14" fill="#f07898" />
      {[0,72,144,216,288].map(a => (
        <ellipse key={a}
          cx={121 + 14 * Math.cos(a * Math.PI/180)}
          cy={276 + 14 * Math.sin(a * Math.PI/180)}
          rx="8" ry="5"
          fill="#f090a8"
          transform={`rotate(${a} ${121 + 14 * Math.cos(a * Math.PI/180)} ${276 + 14 * Math.sin(a * Math.PI/180)})`}
        />
      ))}
      <circle cx="121" cy="276" r="8" fill="#f8e040" />
      {/* Flower 2 */}
      <rect x="157" y="300" width="8" height="35" rx="4" fill="#68a830" />
      <circle cx="161" cy="282" r="11" fill="#c870f0" />
      <circle cx="161" cy="282" r="7" fill="#f8e040" />
      {/* Bird */}
      <path d="M185 100 Q195 92 205 100 Q195 96 185 100" fill="#5080d0" />
      <circle cx="205" cy="98" r="5" fill="#5080d0" />
      {/* Butterfly */}
      <ellipse cx="70" cy="162" rx="16" ry="10" fill="#f0a040" opacity="0.9" transform="rotate(-30 70 162)" />
      <ellipse cx="82" cy="165" rx="14" ry="9" fill="#f0a040" opacity="0.9" transform="rotate(30 82 165)" />
      <ellipse cx="70" cy="170" rx="12" ry="7" fill="#f8d060" opacity="0.8" transform="rotate(20 70 170)" />
      <ellipse cx="82" cy="173" rx="11" ry="7" fill="#f8d060" opacity="0.8" transform="rotate(-20 82 173)" />
      <line x1="76" y1="160" x2="76" y2="178" stroke="#8a5020" strokeWidth="2" />
    </svg>
  );
}

function FarmSVG() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {/* Ground */}
      <rect x="0" y="270" width="400" height="130" fill="#c8b060" />
      <rect x="0" y="270" width="400" height="20" fill="#d0c070" />
      {/* Cloud */}
      <circle cx="90" cy="62" r="28" fill="white" />
      <circle cx="120" cy="52" r="34" fill="white" />
      <circle cx="152" cy="60" r="26" fill="white" />
      {/* Barn */}
      <rect x="230" y="200" width="110" height="90" rx="6" fill="#c04030" />
      <polygon points="230,200 285,155 340,200" fill="#a03020" />
      <rect x="268" y="240" width="34" height="50" rx="4" fill="#7a3020" />
      <rect x="240" y="210" width="24" height="24" rx="3" fill="#f8e090" />
      <rect x="300" y="210" width="24" height="24" rx="3" fill="#f8e090" />
      {/* Fence */}
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={200 + i * 30} y={295} width="8" height="40" rx="4" fill="#d4a870" />
      ))}
      <rect x="200" y="305" width="180" height="8" rx="4" fill="#d4a870" />
      <rect x="200" y="318" width="180" height="8" rx="4" fill="#d4a870" />
      {/* Tractor */}
      <rect x="40" y="285" width="70" height="45" rx="10" fill="#e87020" />
      <circle cx="60" cy="330" r="20" fill="#3a3030" />
      <circle cx="60" cy="330" r="12" fill="#6a6060" />
      <circle cx="97" cy="328" r="15" fill="#3a3030" />
      <circle cx="97" cy="328" r="9" fill="#6a6060" />
      <rect x="100" y="270" width="30" height="30" rx="8" fill="#c86010" />
      <rect x="44" y="285" width="55" height="12" rx="4" fill="#f09030" />
      {/* Hay bales */}
      <rect x="100" y="285" width="55" height="38" rx="14" fill="#e8c840" />
      <ellipse cx="127" cy="285" rx="27" ry="12" fill="#f0d060" />
      {[105,118,131,144].map(x => (
        <line key={x} x1={x} y1="285" x2={x} y2="323" stroke="#d4a820" strokeWidth="2" />
      ))}
    </svg>
  );
}

function SkySVG() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {/* Stars background */}
      {[[40,60],[120,30],[200,50],[320,20],[360,70],[80,120],[280,90]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="white" opacity="0.7" />
      ))}
      {/* Moon */}
      <circle cx="280" cy="72" r="42" fill="#f8f0d0" />
      <circle cx="302" cy="58" r="36" fill="#7090d0" />
      {/* Big star */}
      <polygon
        points="120,30 126,50 148,50 131,63 137,83 120,70 103,83 109,63 92,50 114,50"
        fill="#f8d840"
      />
      {/* Small star */}
      <polygon
        points="220,15 224,28 238,28 227,37 231,50 220,42 209,50 213,37 202,28 216,28"
        fill="#f8e060"
        opacity="0.9"
      />
      {/* Cloud */}
      <circle cx="70" cy="140" r="28" fill="rgba(255,255,255,0.9)" />
      <circle cx="98" cy="130" r="32" fill="rgba(255,255,255,0.9)" />
      <circle cx="128" cy="138" r="24" fill="rgba(255,255,255,0.9)" />
      {/* Airplane */}
      <ellipse cx="240" cy="168" rx="40" ry="10" fill="white" />
      <polygon points="280,168 300,155 300,180" fill="white" />
      <rect x="220" y="158" width="18" height="10" rx="4" fill="rgba(200,220,255,0.8)" />
      <ellipse cx="250" cy="158" rx="12" ry="5" fill="rgba(200,230,255,0.7)" />
      {/* Horizon glow */}
      <ellipse cx="200" cy="400" rx="250" ry="80" fill="#f8c8a0" opacity="0.5" />
      {/* Hills */}
      <ellipse cx="100" cy="400" rx="160" ry="70" fill="#a0c870" />
      <ellipse cx="320" cy="400" rx="140" ry="65" fill="#90b860" />
    </svg>
  );
}

const SCENE_SVGS: Record<SceneId, React.ComponentType> = {
  garden: GardenSVG,
  farm: FarmSVG,
  sky: SkySVG,
};

export function PictureExplorer({ soundEnabled, restaurantMode }: Props) {
  const sound = useSound(soundEnabled && !restaurantMode);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [activeLabelPos, setActiveLabelPos] = useState({ x: 0, y: 0 });

  const scene = SCENES[sceneIndex];
  const SceneSVG = SCENE_SVGS[scene.id];

  const handleHotspot = useCallback((spot: Hotspot) => {
    setActiveLabel(spot.label);
    setActiveLabelPos({ x: spot.x, y: spot.y });
    sound.nameChime();
    setTimeout(() => setActiveLabel(null), 2000);
  }, [sound]);

  const nextScene = useCallback(() => {
    sound.tap();
    setSceneIndex(i => (i + 1) % SCENES.length);
    setActiveLabel(null);
  }, [sound]);

  return (
    <div style={styles.container}>
      <div style={styles.sceneName}>{scene.name}</div>

      <div style={{ ...styles.sceneCard, background: scene.bg }}>
        <SceneSVG />

        {/* Tap hotspots */}
        {scene.hotspots.map(spot => (
          <button
            key={spot.id}
            style={{
              ...styles.hotspot,
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              width: spot.size * 2,
              height: spot.size * 2,
              marginLeft: -spot.size,
              marginTop: -spot.size,
            }}
            onClick={() => handleHotspot(spot)}
            aria-label={spot.label}
          />
        ))}

        {/* Floating label */}
        {activeLabel && (
          <div
            style={{
              ...styles.floatingLabel,
              left: `${activeLabelPos.x}%`,
              top: `${Math.max(activeLabelPos.y - 12, 8)}%`,
            }}
            aria-live="polite"
          >
            {activeLabel}
          </div>
        )}
      </div>

      <div style={styles.bottomRow}>
        <div style={styles.hint}>Tap anything!</div>
        <button style={styles.nextBtn} onClick={nextScene} aria-label="Next scene">
          Next scene →
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
    gap: '12px',
    padding: '16px',
  },
  sceneName: {
    fontSize: 'clamp(1.4rem, 5vw, 2rem)',
    fontWeight: 700,
    color: '#5a4a6a',
  },
  sceneCard: {
    position: 'relative',
    width: '100%',
    maxWidth: 420,
    height: '55vmin',
    maxHeight: 340,
    minHeight: 220,
    borderRadius: 40,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(60,40,100,0.15)',
  },
  hotspot: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    zIndex: 10,
    WebkitTapHighlightColor: 'transparent',
  },
  floatingLabel: {
    position: 'absolute',
    background: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: '6px 16px',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#5a4a6a',
    pointerEvents: 'none',
    zIndex: 20,
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    animation: 'fadeIn 0.25s ease',
    whiteSpace: 'nowrap',
    transform: 'translate(-50%, -100%)',
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  hint: {
    fontSize: '1rem',
    color: '#b0a0c0',
    fontStyle: 'italic',
  },
  nextBtn: {
    background: 'rgba(200,168,233,0.25)',
    border: '2px solid rgba(200,168,233,0.4)',
    borderRadius: 24,
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#7050a0',
    cursor: 'pointer',
  },
};
