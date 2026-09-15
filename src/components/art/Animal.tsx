/**
 * The animal characters, drawn as inline SVG.
 *
 * Vector art instead of images keeps the app tiny and perfectly crisp on any
 * screen, and lets the faces react: they blink slowly, and their mouth moves
 * while they "talk". Everything sits in a 100x100 box so the characters can be
 * dropped into any slot at any size.
 */

import { memo } from 'react'
import { animal, type AnimalId } from '../../data/animals'

export type AnimalMood = 'calm' | 'happy' | 'talking' | 'sleepy'

interface AnimalProps {
  id: AnimalId
  mood?: AnimalMood
  /** Pixel size of the square drawing. */
  size?: number | string
  className?: string
}

interface FaceProps {
  mood: AnimalMood
}

function Eyes({ mood, x1 = 38, x2 = 62, y = 47, r = 4.6 }: FaceProps & { x1?: number; x2?: number; y?: number; r?: number }) {
  if (mood === 'sleepy') {
    return (
      <g stroke="#4a4038" strokeWidth={3} strokeLinecap="round" fill="none">
        <path d={`M ${x1 - r} ${y} q ${r} ${r * 0.9} ${r * 2} 0`} />
        <path d={`M ${x2 - r} ${y} q ${r} ${r * 0.9} ${r * 2} 0`} />
      </g>
    )
  }
  return (
    <g className="eyes" fill="#4a4038">
      <circle cx={x1} cy={y} r={r} />
      <circle cx={x2} cy={y} r={r} />
      <circle cx={x1 + r * 0.35} cy={y - r * 0.35} r={r * 0.32} fill="#fffaf2" />
      <circle cx={x2 + r * 0.35} cy={y - r * 0.35} r={r * 0.32} fill="#fffaf2" />
    </g>
  )
}

function Cheeks({ x1 = 30, x2 = 70, y = 58, color = '#e79b95' }) {
  return (
    <g fill={color} opacity={0.35}>
      <ellipse cx={x1} cy={y} rx={6} ry={4} />
      <ellipse cx={x2} cy={y} rx={6} ry={4} />
    </g>
  )
}

function Mouth({ mood, cx = 50, cy = 62, w = 12 }: FaceProps & { cx?: number; cy?: number; w?: number }) {
  if (mood === 'talking') {
    return <ellipse className="mouth-talk" cx={cx} cy={cy + 2} rx={w * 0.45} ry={w * 0.38} fill="#8d5f56" />
  }
  const drop = mood === 'happy' ? w * 0.6 : w * 0.35
  return (
    <path
      d={`M ${cx - w / 2} ${cy} q ${w / 2} ${drop} ${w} 0`}
      stroke="#8d5f56"
      strokeWidth={2.6}
      strokeLinecap="round"
      fill="none"
    />
  )
}

function Maca({ mood }: FaceProps) {
  const a = animal('maca')
  return (
    <>
      <path d="M 24 38 L 26 16 L 44 28 Z" fill={a.color} />
      <path d="M 76 38 L 74 16 L 56 28 Z" fill={a.color} />
      <path d="M 28 34 L 29 22 L 40 29 Z" fill="#f0c9bd" />
      <path d="M 72 34 L 71 22 L 60 29 Z" fill="#f0c9bd" />
      <ellipse cx={50} cy={52} rx={30} ry={27} fill={a.color} />
      <Cheeks />
      <Eyes mood={mood} />
      <path d="M 46 57 L 54 57 L 50 61 Z" fill="#c9756c" />
      <Mouth mood={mood} cy={64} />
      <g stroke={a.shade} strokeWidth={1.6} strokeLinecap="round" opacity={0.7}>
        <path d="M 22 56 L 8 53" />
        <path d="M 22 60 L 8 62" />
        <path d="M 78 56 L 92 53" />
        <path d="M 78 60 L 92 62" />
      </g>
    </>
  )
}

function Kuca({ mood }: FaceProps) {
  const a = animal('kuca')
  return (
    <>
      <ellipse cx={22} cy={54} rx={11} ry={20} fill={a.shade} />
      <ellipse cx={78} cy={54} rx={11} ry={20} fill={a.shade} />
      <ellipse cx={50} cy={50} rx={29} ry={27} fill={a.color} />
      <ellipse cx={64} cy={38} rx={11} ry={9} fill={a.shade} opacity={0.5} />
      <Cheeks y={56} />
      <Eyes mood={mood} y={45} />
      <ellipse cx={50} cy={60} rx={14} ry={11} fill="#f6ead9" />
      <ellipse cx={50} cy={56} rx={6} ry={4.6} fill="#5c463a" />
      <Mouth mood={mood} cy={63} w={14} />
    </>
  )
}

function Krava({ mood }: FaceProps) {
  const a = animal('krava')
  return (
    <>
      <path d="M 30 26 q -6 -10 -14 -9 q 6 4 6 12 Z" fill="#e6d8c4" />
      <path d="M 70 26 q 6 -10 14 -9 q -6 4 -6 12 Z" fill="#e6d8c4" />
      <ellipse cx={18} cy={46} rx={10} ry={7} fill={a.shade} />
      <ellipse cx={82} cy={46} rx={10} ry={7} fill={a.shade} />
      <ellipse cx={50} cy={48} rx={30} ry={26} fill={a.color} />
      <path d="M 28 34 q 10 -6 16 2 q -6 8 -16 4 Z" fill={a.shade} opacity={0.55} />
      <Eyes mood={mood} y={44} />
      <ellipse cx={50} cy={64} rx={19} ry={13} fill="#e9b7ae" />
      <ellipse cx={43} cy={62} rx={3.2} ry={4} fill="#b8837c" />
      <ellipse cx={57} cy={62} rx={3.2} ry={4} fill="#b8837c" />
      <Mouth mood={mood} cy={70} w={13} />
    </>
  )
}

function Patka({ mood }: FaceProps) {
  const a = animal('patka')
  return (
    <>
      <path d="M 44 20 q 5 -10 11 -4 q -4 3 -3 8 Z" fill={a.shade} />
      <ellipse cx={50} cy={48} rx={28} ry={26} fill={a.color} />
      <Cheeks y={56} color="#dba86a" />
      <Eyes mood={mood} y={44} r={4.2} />
      <path d="M 33 60 q 17 -8 34 0 q -17 7 -34 0 Z" fill="#e79f4e" />
      <path d="M 34 62 q 16 8 32 0 q -16 6 -32 0 Z" fill="#d1873a" className={mood === 'talking' ? 'beak-talk' : undefined} />
    </>
  )
}

function Ovca({ mood }: FaceProps) {
  const a = animal('ovca')
  return (
    <>
      <g fill={a.color}>
        <circle cx={30} cy={36} r={13} />
        <circle cx={50} cy={28} r={14} />
        <circle cx={70} cy={36} r={13} />
        <circle cx={24} cy={54} r={12} />
        <circle cx={76} cy={54} r={12} />
        <circle cx={50} cy={52} r={22} />
      </g>
      <ellipse cx={22} cy={52} rx={8} ry={5.5} fill={a.shade} transform="rotate(-18 22 52)" />
      <ellipse cx={78} cy={52} rx={8} ry={5.5} fill={a.shade} transform="rotate(18 78 52)" />
      <ellipse cx={50} cy={56} rx={18} ry={17} fill="#e4d9cd" />
      <Eyes mood={mood} y={53} x1={43} x2={57} r={3.8} />
      <Mouth mood={mood} cy={64} w={10} />
    </>
  )
}

function Zaba({ mood }: FaceProps) {
  const a = animal('zaba')
  return (
    <>
      <circle cx={31} cy={30} r={13} fill={a.color} />
      <circle cx={69} cy={30} r={13} fill={a.color} />
      <ellipse cx={50} cy={56} rx={31} ry={24} fill={a.color} />
      <ellipse cx={50} cy={66} rx={22} ry={12} fill="#c4d9a9" opacity={0.6} />
      {mood === 'sleepy' ? (
        <g stroke="#4a4038" strokeWidth={3} strokeLinecap="round" fill="none">
          <path d="M 25 31 q 6 5 12 0" />
          <path d="M 63 31 q 6 5 12 0" />
        </g>
      ) : (
        <g className="eyes">
          <circle cx={31} cy={30} r={7} fill="#fffaf2" />
          <circle cx={69} cy={30} r={7} fill="#fffaf2" />
          <circle cx={32} cy={31} r={4} fill="#4a4038" />
          <circle cx={70} cy={31} r={4} fill="#4a4038" />
        </g>
      )}
      <circle cx={44} cy={50} r={1.8} fill={a.shade} />
      <circle cx={56} cy={50} r={1.8} fill={a.shade} />
      {mood === 'talking' ? (
        <ellipse className="mouth-talk" cx={50} cy={64} rx={11} ry={7} fill="#7f9a63" />
      ) : (
        <path d="M 34 60 q 16 10 32 0" stroke={a.shade} strokeWidth={3} strokeLinecap="round" fill="none" />
      )}
    </>
  )
}

function Ptica({ mood }: FaceProps) {
  const a = animal('ptica')
  return (
    <>
      <path d="M 44 18 q 6 -9 12 -2 q -5 3 -4 8 Z" fill={a.shade} />
      <ellipse cx={50} cy={50} rx={27} ry={26} fill={a.color} />
      <ellipse cx={50} cy={60} rx={17} ry={14} fill="#e8f0f4" opacity={0.8} />
      <path d="M 78 52 q 12 6 8 18 q -10 -4 -14 -12 Z" fill={a.shade} opacity={0.75} />
      <Cheeks x1={32} x2={68} y={56} color="#dd9a93" />
      <Eyes mood={mood} y={46} r={4.2} />
      {mood === 'talking' ? (
        <ellipse className="mouth-talk" cx={50} cy={58} rx={5.5} ry={5} fill="#d99a3f" />
      ) : (
        <path d="M 44 56 L 56 56 L 50 64 Z" fill="#e5a94c" />
      )}
    </>
  )
}

function Meda({ mood }: FaceProps) {
  const a = animal('meda')
  return (
    <>
      <circle cx={24} cy={28} r={13} fill={a.color} />
      <circle cx={76} cy={28} r={13} fill={a.color} />
      <circle cx={24} cy={28} r={7} fill="#e3bd9c" />
      <circle cx={76} cy={28} r={7} fill="#e3bd9c" />
      <ellipse cx={50} cy={52} rx={30} ry={28} fill={a.color} />
      <Cheeks y={58} />
      <Eyes mood={mood} y={46} />
      <ellipse cx={50} cy={63} rx={16} ry={12} fill="#e8cfb4" />
      <ellipse cx={50} cy={58} rx={6} ry={4.6} fill="#5c463a" />
      <Mouth mood={mood} cy={66} w={13} />
    </>
  )
}

const FACES: Record<AnimalId, (p: FaceProps) => JSX.Element> = {
  maca: Maca,
  kuca: Kuca,
  krava: Krava,
  patka: Patka,
  ovca: Ovca,
  zaba: Zaba,
  ptica: Ptica,
  meda: Meda,
}

function AnimalArt({ id, mood = 'calm', size = 120, className }: AnimalProps) {
  const Face = FACES[id]
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={id}
      focusable="false"
    >
      <Face mood={mood} />
    </svg>
  )
}

export default memo(AnimalArt)
