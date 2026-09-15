/**
 * Interface icons. Drawn in the same soft, rounded language as the animals so
 * the menu feels like part of the same world rather than a settings app.
 */

interface IconProps {
  size?: number | string
  color?: string
}

export function PhoneIcon({ size = 72, color = '#93aa84' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" aria-hidden="true">
      <rect x={28} y={12} width={44} height={76} rx={14} fill={color} />
      <rect x={34} y={22} width={32} height={50} rx={8} fill="#fdf7ee" />
      <circle cx={50} cy={80} r={5} fill="#fdf7ee" opacity={0.85} />
      <path d="M42 36 q 8 -8 16 0" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
      <circle cx={44} cy={50} r={3.4} fill={color} />
      <circle cx={56} cy={50} r={3.4} fill={color} />
      <path d="M44 60 q 6 6 12 0" stroke={color} strokeWidth={3.4} fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function MessageIcon({ size = 72, color = '#7fa1b6' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" aria-hidden="true">
      <path d="M16 26 h 68 a 10 10 0 0 1 10 10 v 30 a 10 10 0 0 1 -10 10 h -34 l -18 14 v -14 h -16 a 10 10 0 0 1 -10 -10 v -30 a 10 10 0 0 1 10 -10 Z" fill={color} />
      <circle cx={36} cy={51} r={6} fill="#fdf7ee" />
      <circle cx={54} cy={51} r={6} fill="#fdf7ee" />
      <circle cx={72} cy={51} r={6} fill="#fdf7ee" />
    </svg>
  )
}

export function MicIcon({ size = 72, color = '#c4816f' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" aria-hidden="true">
      <rect x={38} y={14} width={24} height={44} rx={12} fill={color} />
      <path d="M28 48 a 22 22 0 0 0 44 0" stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" />
      <line x1={50} y1={70} x2={50} y2={82} stroke={color} strokeWidth={7} strokeLinecap="round" />
      <line x1={36} y1={86} x2={64} y2={86} stroke={color} strokeWidth={7} strokeLinecap="round" />
    </svg>
  )
}

export function PadsIcon({ size = 72, color = '#cfa94f' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" aria-hidden="true">
      <rect x={14} y={14} width={34} height={34} rx={11} fill={color} />
      <rect x={54} y={14} width={34} height={34} rx={11} fill="#c2b3cd" />
      <rect x={14} y={54} width={34} height={34} rx={11} fill="#a9c3d4" />
      <rect x={54} y={54} width={34} height={34} rx={11} fill="#dda394" />
    </svg>
  )
}

export function PeekIcon({ size = 72, color = '#93aa84' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" aria-hidden="true">
      <circle cx={50} cy={44} r={20} fill="#e8b98f" />
      <circle cx={43} cy={42} r={3.6} fill="#4a4038" />
      <circle cx={57} cy={42} r={3.6} fill="#4a4038" />
      <path d="M44 52 q 6 6 12 0" stroke="#8d5f56" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M6 88 q 12 -34 44 -34 q 32 0 44 34 Z" fill={color} />
    </svg>
  )
}

export function BackIcon({ size = 34, color = '#7a6d60' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" aria-hidden="true">
      <path
        d="M58 22 L 30 50 L 58 78"
        stroke={color}
        strokeWidth={11}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function LeafIcon({ size = 26, color = '#93aa84' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" aria-hidden="true">
      <path d="M80 18 C 40 18 18 40 18 74 C 52 74 80 52 80 18 Z" fill={color} />
      <path d="M24 78 C 40 58 58 40 76 26" stroke="#fdf7ee" strokeWidth={5} fill="none" strokeLinecap="round" />
    </svg>
  )
}

/* ---- Big-button board art ---- */

export function BellArt({ size = 74, color = '#cfa94f' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" aria-hidden="true">
      <path d="M26 68 q 0 -34 24 -38 q 24 4 24 38 Z" fill={color} />
      <rect x={20} y={68} width={60} height={9} rx={4.5} fill={color} />
      <circle cx={50} cy={84} r={7} fill={color} />
      <circle cx={50} cy={26} r={6} fill={color} />
    </svg>
  )
}

export function LampArt({ size = 74, color = '#e8c97a' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" aria-hidden="true">
      <circle cx={50} cy={44} r={22} fill={color} />
      <rect x={40} y={64} width={20} height={12} rx={4} fill="#b9a88e" />
      <rect x={42} y={78} width={16} height={8} rx={4} fill="#b9a88e" />
      <path d="M50 14 v -8 M 22 24 l -6 -6 M 78 24 l 6 -6" stroke={color} strokeWidth={6} strokeLinecap="round" />
    </svg>
  )
}

export function BalloonArt({ size = 74, color = '#dda394' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" aria-hidden="true">
      <ellipse cx={50} cy={40} rx={24} ry={28} fill={color} />
      <path d="M44 66 h 12 l -6 8 Z" fill={color} />
      <path d="M50 74 q 8 10 -2 18 q -8 6 0 8" stroke="#b9a88e" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <ellipse cx={41} cy={31} rx={6} ry={9} fill="#fdf7ee" opacity={0.5} transform="rotate(-20 41 31)" />
    </svg>
  )
}

export function DrumArt({ size = 74, color = '#a9c3d4' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" aria-hidden="true">
      <rect x={20} y={38} width={60} height={34} rx={10} fill={color} />
      <ellipse cx={50} cy={38} rx={30} ry={11} fill="#f3ece0" />
      <path d="M24 44 l 18 22 M 76 44 l -18 22 M 50 42 v 28" stroke="#fdf7ee" strokeWidth={3} opacity={0.6} />
      <rect x={66} y={12} width={6} height={26} rx={3} fill="#b9a88e" transform="rotate(22 69 25)" />
    </svg>
  )
}

export function WaterArt({ size = 74, color = '#7fa1b6' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" aria-hidden="true">
      <path d="M50 14 C 66 38 76 50 76 62 a 26 26 0 0 1 -52 0 C 24 50 34 38 50 14 Z" fill={color} />
      <ellipse cx={40} cy={58} rx={6} ry={9} fill="#fdf7ee" opacity={0.45} transform="rotate(-18 40 58)" />
    </svg>
  )
}

export function StarArt({ size = 74, color = '#e8c97a' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} focusable="false" aria-hidden="true">
      <path
        d="M50 12 L 61 38 L 88 41 L 68 59 L 74 86 L 50 72 L 26 86 L 32 59 L 12 41 L 39 38 Z"
        fill={color}
        stroke={color}
        strokeWidth={6}
        strokeLinejoin="round"
      />
    </svg>
  )
}
