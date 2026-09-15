/**
 * Animal voices, built from the same soft oscillators as everything else.
 *
 * They are deliberately stylised rather than realistic: a synthesised "mu" is
 * warm and predictable, while a real recording of a cow is loud, sudden and
 * — for a toddler with a tablet close to their face — often frightening.
 */

import { breath, tone } from './engine'
import type { AnimalId } from '../data/animals'

type VoiceFn = () => void

const voices: Record<AnimalId, VoiceFn> = {
  // Cow: a long low "muuu" that slides down at the end.
  krava: () => {
    tone({ freq: 138, toFreq: 112, duration: 1.1, type: 'sawtooth', gain: 0.3, cutoff: 460, attack: 0.12, release: 0.4, vibratoHz: 4.5, vibratoDepth: 3 })
  },
  // Cat: a two-part "mja-u", bright then falling.
  maca: () => {
    tone({ freq: 620, toFreq: 700, duration: 0.18, type: 'triangle', gain: 0.24, cutoff: 1900, attack: 0.03 })
    tone({ freq: 700, toFreq: 430, duration: 0.5, type: 'triangle', gain: 0.24, cutoff: 1600, delay: 0.17, release: 0.3, vibratoHz: 6, vibratoDepth: 8 })
  },
  // Dog: two rounded barks, never sharp.
  kuca: () => {
    tone({ freq: 330, toFreq: 200, duration: 0.16, type: 'triangle', gain: 0.3, cutoff: 900, attack: 0.012, release: 0.1 })
    tone({ freq: 300, toFreq: 180, duration: 0.2, type: 'triangle', gain: 0.27, cutoff: 850, delay: 0.26, attack: 0.012, release: 0.12 })
  },
  // Duck: nasal, two quacks.
  patka: () => {
    for (let i = 0; i < 2; i++) {
      tone({ freq: 420, toFreq: 330, duration: 0.17, type: 'square', gain: 0.16, cutoff: 1100, delay: i * 0.25, attack: 0.02, release: 0.1, vibratoHz: 28, vibratoDepth: 22 })
    }
  },
  // Sheep: wobbly "beee".
  ovca: () => {
    tone({ freq: 330, toFreq: 300, duration: 0.85, type: 'sawtooth', gain: 0.18, cutoff: 1300, attack: 0.06, release: 0.3, vibratoHz: 13, vibratoDepth: 16 })
  },
  // Frog: low rolling croak.
  zaba: () => {
    for (let i = 0; i < 2; i++) {
      tone({ freq: 150, toFreq: 130, duration: 0.24, type: 'square', gain: 0.14, cutoff: 520, delay: i * 0.32, attack: 0.03, release: 0.14, vibratoHz: 22, vibratoDepth: 26 })
    }
  },
  // Bird: a little rising whistle, twice.
  ptica: () => {
    tone({ freq: 980, toFreq: 1500, duration: 0.14, type: 'sine', gain: 0.16, cutoff: 3200 })
    tone({ freq: 1200, toFreq: 1750, duration: 0.16, type: 'sine', gain: 0.14, delay: 0.19, cutoff: 3200 })
  },
  // Bear: a friendly low rumble, more purr than roar.
  meda: () => {
    tone({ freq: 96, toFreq: 80, duration: 0.9, type: 'sawtooth', gain: 0.26, cutoff: 300, attack: 0.15, release: 0.4, vibratoHz: 17, vibratoDepth: 5 })
    breath({ duration: 0.85, gain: 0.08, cutoff: 260, toCutoff: 160 })
  },
}

export function playAnimalVoice(id: AnimalId): void {
  voices[id]?.()
}

/** A short, friendly acknowledgement in the animal's register. */
export function playAnimalGiggle(id: AnimalId): void {
  const base = id === 'krava' || id === 'meda' ? 220 : id === 'ptica' ? 900 : 520
  ;[0, 1, 0].forEach((step, i) => {
    tone({
      freq: base * (1 + step * 0.12),
      duration: 0.12,
      type: 'triangle',
      gain: 0.16,
      delay: i * 0.13,
      cutoff: 2400,
    })
  })
}
