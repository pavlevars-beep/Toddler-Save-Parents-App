/**
 * Pictograms — the "alphabet" a child who cannot read yet can write with.
 *
 * Each one is a single, instantly recognisable object with a name the child
 * already knows, so tapping it is genuinely a message and not a decoration.
 */

import { memo } from 'react'
import type { Lang } from '../../i18n/strings'

export type PictoId =
  | 'srce'
  | 'sunce'
  | 'lopta'
  | 'jabuka'
  | 'zvezda'
  | 'cvet'
  | 'mesec'
  | 'auto'
  | 'kolac'
  | 'kisa'
  | 'riba'
  | 'ruka'

export interface Picto {
  id: PictoId
  name: Record<Lang, string>
  color: string
}

export const PICTOS: Picto[] = [
  { id: 'srce', name: { sr: 'srce', en: 'heart' }, color: '#e3948d' },
  { id: 'sunce', name: { sr: 'sunce', en: 'sun' }, color: '#eec368' },
  { id: 'lopta', name: { sr: 'lopta', en: 'ball' }, color: '#8fb0c4' },
  { id: 'jabuka', name: { sr: 'jabuka', en: 'apple' }, color: '#d9877f' },
  { id: 'zvezda', name: { sr: 'zvezda', en: 'star' }, color: '#e8c97a' },
  { id: 'cvet', name: { sr: 'cvet', en: 'flower' }, color: '#ce9fb6' },
  { id: 'mesec', name: { sr: 'mesec', en: 'moon' }, color: '#b3b9cf' },
  { id: 'auto', name: { sr: 'auto', en: 'car' }, color: '#98b58f' },
  { id: 'kolac', name: { sr: 'kolač', en: 'cake' }, color: '#dcae8e' },
  { id: 'kisa', name: { sr: 'kiša', en: 'rain' }, color: '#9db9c9' },
  { id: 'riba', name: { sr: 'riba', en: 'fish' }, color: '#8dbcb5' },
  { id: 'ruka', name: { sr: 'ruka', en: 'hand' }, color: '#dfae8b' },
]

const SHAPES: Record<PictoId, (color: string) => JSX.Element> = {
  srce: (c) => <path d="M50 78 C 18 58 14 36 28 26 C 39 18 50 28 50 34 C 50 28 61 18 72 26 C 86 36 82 58 50 78 Z" fill={c} />,
  sunce: (c) => (
    <g fill={c}>
      <circle cx={50} cy={50} r={20} />
      <g stroke={c} strokeWidth={6} strokeLinecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line key={deg} x1={50} y1={20} x2={50} y2={12} transform={`rotate(${deg} 50 50)`} />
        ))}
      </g>
    </g>
  ),
  lopta: (c) => (
    <g>
      <circle cx={50} cy={50} r={28} fill={c} />
      <path d="M22 50 q 28 -18 56 0" stroke="#fdf7ee" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M22 50 q 28 18 56 0" stroke="#fdf7ee" strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  ),
  jabuka: (c) => (
    <g>
      <path d="M50 30 C 34 20 18 32 22 52 C 26 72 40 82 50 76 C 60 82 74 72 78 52 C 82 32 66 20 50 30 Z" fill={c} />
      <path d="M50 30 q 2 -12 -2 -16" stroke="#8a6b4f" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M52 22 q 12 -8 16 2 q -12 6 -16 -2 Z" fill="#9bb87f" />
    </g>
  ),
  zvezda: (c) => (
    <path
      d="M50 16 L 60 40 L 86 42 L 66 58 L 72 82 L 50 68 L 28 82 L 34 58 L 14 42 L 40 40 Z"
      fill={c}
      strokeLinejoin="round"
      stroke={c}
      strokeWidth={4}
    />
  ),
  cvet: (c) => (
    <g>
      <path d="M50 52 L 50 84" stroke="#93ac7d" strokeWidth={5} strokeLinecap="round" />
      <path d="M50 70 q 14 -4 16 -14 q -14 0 -16 14 Z" fill="#93ac7d" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx={50} cy={32} rx={10} ry={14} fill={c} transform={`rotate(${deg} 50 48)`} />
      ))}
      <circle cx={50} cy={48} r={8} fill="#eec368" />
    </g>
  ),
  mesec: (c) => <path d="M50 20 A 32 32 0 0 0 50 84 A 52 52 0 0 1 50 20 Z" fill={c} />,
  auto: (c) => (
    <g>
      <path d="M16 58 q 2 -14 8 -16 l 12 -10 h 26 l 12 12 q 8 2 10 14 v 8 h -68 Z" fill={c} />
      <rect x={38} y={34} width={18} height={12} rx={3} fill="#e9f0ef" />
      <circle cx={32} cy={70} r={9} fill="#5f5a52" />
      <circle cx={68} cy={70} r={9} fill="#5f5a52" />
    </g>
  ),
  kolac: (c) => (
    <g>
      <rect x={22} y={46} width={56} height={30} rx={8} fill={c} />
      <path d="M22 52 q 14 10 28 0 q 14 -10 28 0 v -6 q -14 -10 -28 0 q -14 10 -28 0 Z" fill="#f3ded0" />
      <rect x={47} y={22} width={6} height={18} rx={3} fill="#e0b8a0" />
      <ellipse cx={50} cy={20} rx={4} ry={6} fill="#eec368" />
    </g>
  ),
  kisa: (c) => (
    <g>
      <path d="M30 48 a 14 14 0 0 1 14 -14 a 18 18 0 0 1 32 6 a 12 12 0 0 1 -4 24 h -40 a 10 10 0 0 1 -2 -16 Z" fill="#dfe6ea" />
      <g stroke={c} strokeWidth={6} strokeLinecap="round">
        <line x1={38} y1={70} x2={34} y2={82} />
        <line x1={52} y1={70} x2={48} y2={82} />
        <line x1={66} y1={70} x2={62} y2={82} />
      </g>
    </g>
  ),
  riba: (c) => (
    <g>
      <ellipse cx={46} cy={50} rx={26} ry={17} fill={c} />
      <path d="M72 50 l 16 -12 v 24 Z" fill={c} />
      <circle cx={34} cy={46} r={3.4} fill="#4a4038" />
      <path d="M50 40 q 6 10 0 20" stroke="#fdf7ee" strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  ),
  ruka: (c) => (
    <g fill={c}>
      <rect x={42} y={22} width={9} height={32} rx={4.5} />
      <rect x={53} y={26} width={9} height={28} rx={4.5} />
      <rect x={31} y={30} width={9} height={26} rx={4.5} />
      <rect x={64} y={34} width={9} height={22} rx={4.5} />
      <path d="M28 48 q 22 -6 46 0 v 10 a 24 24 0 0 1 -46 0 Z" />
    </g>
  ),
}

function PictoArt({ id, size = 64, className }: { id: PictoId; size?: number | string; className?: string }) {
  const picto = PICTOS.find((p) => p.id === id) ?? PICTOS[0]
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label={id} focusable="false">
      {SHAPES[picto.id](picto.color)}
    </svg>
  )
}

export default memo(PictoArt)
