/**
 * Tiny Web Audio engine.
 *
 * Everything the app makes noise with goes through here, so we can guarantee
 * three things that matter for a 1.5-3 year old:
 *   1. nothing ever plays louder than the master ceiling,
 *   2. every sound has a soft attack and release (no clicks, no startles),
 *   3. all audio stops instantly when a screen is left.
 *
 * No audio files: the whole soundtrack is synthesised, which keeps the app
 * small and fully offline.
 */

export type Wave = OscillatorType

let ctx: AudioContext | null = null
let master: GainNode | null = null
let bus: GainNode | null = null
let noiseBuffer: AudioBuffer | null = null
let volume = 0.7
let muted = false

/** Absolute ceiling. Even at volume 1.0 the app stays gentle. */
const MAX_GAIN = 0.55

function makeContext(): AudioContext | null {
  if (ctx) return ctx
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  master = ctx.createGain()
  master.gain.value = muted ? 0 : volume * MAX_GAIN
  // Soft limiter so overlapping taps never add up into something harsh.
  const limiter = ctx.createDynamicsCompressor()
  limiter.threshold.value = -14
  limiter.knee.value = 24
  limiter.ratio.value = 12
  limiter.attack.value = 0.004
  limiter.release.value = 0.25
  bus = ctx.createGain()
  bus.connect(limiter)
  limiter.connect(master)
  master.connect(ctx.destination)
  return ctx
}

/** Must be called from inside a user gesture the first time. */
export function unlockAudio(): void {
  const c = makeContext()
  if (c && c.state === 'suspended') void c.resume()
}

export function setVolume(v: number): void {
  volume = Math.min(1, Math.max(0, v))
  if (master && ctx) {
    master.gain.setTargetAtTime(muted ? 0 : volume * MAX_GAIN, ctx.currentTime, 0.05)
  }
}

export function setMuted(m: boolean): void {
  muted = m
  if (master && ctx) {
    master.gain.setTargetAtTime(muted ? 0 : volume * MAX_GAIN, ctx.currentTime, 0.05)
  }
}

export function audioContext(): AudioContext | null {
  return makeContext()
}

/** Destination every voice/effect connects to. */
export function output(): GainNode | null {
  makeContext()
  return bus
}

/** Cuts anything still ringing — used when leaving a screen. */
export function stopAll(): void {
  if (!ctx || !bus) return
  const limiterInput = bus
  limiterInput.gain.setValueAtTime(0, ctx.currentTime)
  limiterInput.gain.setTargetAtTime(1, ctx.currentTime + 0.06, 0.02)
}

function noise(c: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer
  const len = Math.floor(c.sampleRate * 1.5)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    // Brown-ish noise: softer and warmer than white.
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.5
  }
  noiseBuffer = buf
  return buf
}

export interface ToneOptions {
  freq: number
  /** Optional end frequency — the tone glides there over its duration. */
  toFreq?: number
  duration?: number
  type?: Wave
  gain?: number
  attack?: number
  release?: number
  delay?: number
  /** Low-pass cutoff in Hz; keeps every sound rounded. */
  cutoff?: number
  vibratoHz?: number
  vibratoDepth?: number
  /** Slight detuned second oscillator for a warmer, choir-like body. */
  warm?: boolean
}

/** Plays a single soft tone. Returns when it was scheduled, not when it ends. */
export function tone(options: ToneOptions): void {
  const c = makeContext()
  const out = bus
  if (!c || !out) return
  if (c.state === 'suspended') void c.resume()

  const {
    freq,
    toFreq,
    duration = 0.4,
    type = 'sine',
    gain = 0.5,
    attack = 0.02,
    release = 0.18,
    delay = 0,
    cutoff = 2600,
    vibratoHz = 0,
    vibratoDepth = 0,
    warm = false,
  } = options

  const t0 = c.currentTime + delay
  const env = c.createGain()
  env.gain.setValueAtTime(0.0001, t0)
  env.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t0 + attack)
  env.gain.setValueAtTime(Math.max(0.0002, gain), t0 + Math.max(attack, duration - release))
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = cutoff
  filter.Q.value = 0.6

  env.connect(filter)
  filter.connect(out)

  const oscs: OscillatorNode[] = []
  const build = (detune: number, level: number) => {
    const osc = c.createOscillator()
    osc.type = type
    osc.detune.value = detune
    osc.frequency.setValueAtTime(freq, t0)
    if (toFreq && toFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, toFreq), t0 + duration)
    }
    const lvl = c.createGain()
    lvl.gain.value = level
    osc.connect(lvl)
    lvl.connect(env)
    osc.start(t0)
    osc.stop(t0 + duration + 0.05)
    oscs.push(osc)
  }

  build(0, 1)
  if (warm) build(7, 0.45)

  if (vibratoHz > 0 && vibratoDepth > 0) {
    const lfo = c.createOscillator()
    lfo.frequency.value = vibratoHz
    const depth = c.createGain()
    depth.gain.value = vibratoDepth
    lfo.connect(depth)
    oscs.forEach((o) => depth.connect(o.frequency))
    lfo.start(t0)
    lfo.stop(t0 + duration + 0.05)
  }
}

export interface BreathOptions {
  duration?: number
  gain?: number
  cutoff?: number
  toCutoff?: number
  delay?: number
}

/** Filtered noise: wind, water, a paper rustle, a soft "puf". */
export function breath(options: BreathOptions = {}): void {
  const c = makeContext()
  const out = bus
  if (!c || !out) return
  if (c.state === 'suspended') void c.resume()

  const { duration = 0.5, gain = 0.25, cutoff = 900, toCutoff, delay = 0 } = options
  const t0 = c.currentTime + delay

  const src = c.createBufferSource()
  src.buffer = noise(c)
  src.loop = true

  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(cutoff, t0)
  if (toCutoff) filter.frequency.exponentialRampToValueAtTime(Math.max(60, toCutoff), t0 + duration)
  filter.Q.value = 0.9

  const env = c.createGain()
  env.gain.setValueAtTime(0.0001, t0)
  env.gain.exponentialRampToValueAtTime(gain, t0 + duration * 0.3)
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

  src.connect(filter)
  filter.connect(env)
  env.connect(out)
  src.start(t0)
  src.stop(t0 + duration + 0.05)
}

/* ---------------------------------------------------------------- */
/* Shared little sounds                                             */
/* ---------------------------------------------------------------- */

/** Pentatonic scale — any combination of these sounds pleasant. */
const SCALE = [392, 440, 523.25, 587.33, 659.25, 783.99, 880]

export function noteFromScale(index: number): number {
  return SCALE[Math.abs(index) % SCALE.length]
}

/** The everyday "you touched something" sound. */
export function tap(index = 0): void {
  tone({ freq: noteFromScale(index), duration: 0.3, type: 'sine', gain: 0.32, warm: true, cutoff: 2200 })
}

/** A warm two-note confirmation. */
export function chime(base = 2): void {
  tone({ freq: noteFromScale(base), duration: 0.45, gain: 0.3, warm: true })
  tone({ freq: noteFromScale(base + 2), duration: 0.6, gain: 0.26, delay: 0.12, warm: true })
}

/** Soft rounded knock, for "closed", "back", "hide". */
export function thud(): void {
  tone({ freq: 180, toFreq: 110, duration: 0.24, type: 'sine', gain: 0.36, cutoff: 700 })
  breath({ duration: 0.16, gain: 0.1, cutoff: 320 })
}

/** Three rising notes — used sparingly, for a real little success. */
export function sparkle(): void {
  ;[2, 4, 5].forEach((n, i) => {
    tone({ freq: noteFromScale(n) * 2, duration: 0.35, gain: 0.18, delay: i * 0.1, warm: true })
  })
}
