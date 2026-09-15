/**
 * Voice recorder for the "My voice" screen.
 *
 * The microphone is captured straight into an AudioBuffer instead of an encoded
 * file, for three reasons:
 *   - playback can be pitch-shifted instantly (that is the whole game),
 *   - no codec differences between Safari, Chrome and a native WebView,
 *   - nothing is ever a file, so there is nothing to accidentally upload.
 *
 * The recording lives in memory only and is dropped when the screen is left.
 */

import { audioContext, output } from './engine'

export type MicError = 'denied' | 'missing' | 'unsupported'

export const MAX_SECONDS = 5

interface Capture {
  stream: MediaStream
  source: MediaStreamAudioSourceNode
  processor: ScriptProcessorNode
  sink: GainNode
  chunks: Float32Array[]
  frames: number
}

let capture: Capture | null = null
let stream: MediaStream | null = null
let playing: AudioBufferSourceNode | null = null

function micSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
}

/** Asks for the microphone once and keeps the stream for the session. */
export async function openMic(): Promise<MediaStream> {
  if (!micSupported()) throw 'unsupported' as MicError
  if (stream && stream.getAudioTracks().some((t) => t.readyState === 'live')) return stream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: false,
    })
    return stream
  } catch (err) {
    const name = (err as DOMException)?.name
    if (name === 'NotFoundError' || name === 'OverconstrainedError') throw 'missing' as MicError
    throw 'denied' as MicError
  }
}

/** Releases the microphone so the device's recording indicator goes away. */
export function closeMic(): void {
  stopRecording()
  stream?.getTracks().forEach((t) => t.stop())
  stream = null
}

export interface RecordHandle {
  /** Current input loudness, 0..1 — drives the pulsing circle on screen. */
  level: () => number
  elapsed: () => number
}

export async function startRecording(): Promise<RecordHandle> {
  const ctx = audioContext()
  if (!ctx) throw 'unsupported' as MicError
  if (ctx.state === 'suspended') await ctx.resume()
  const s = await openMic()
  stopRecording()

  const source = ctx.createMediaStreamSource(s)
  // ScriptProcessor is the one API available everywhere that hands us raw
  // samples on the spot; for five seconds of speech the main-thread cost is
  // not measurable.
  const processor = ctx.createScriptProcessor(4096, 1, 1)
  // A muted sink keeps the processor running without feeding the mic back
  // into the speakers.
  const sink = ctx.createGain()
  sink.gain.value = 0

  const state: Capture = { stream: s, source, processor, sink, chunks: [], frames: 0 }
  let peak = 0

  processor.onaudioprocess = (e) => {
    const input = e.inputBuffer.getChannelData(0)
    if (state.frames >= ctx.sampleRate * MAX_SECONDS) return
    const copy = new Float32Array(input.length)
    copy.set(input)
    state.chunks.push(copy)
    state.frames += copy.length
    let max = 0
    for (let i = 0; i < copy.length; i += 8) {
      const v = Math.abs(copy[i])
      if (v > max) max = v
    }
    peak = Math.max(max, peak * 0.82)
  }

  source.connect(processor)
  processor.connect(sink)
  sink.connect(ctx.destination)
  capture = state

  return {
    level: () => Math.min(1, peak * 2.4),
    elapsed: () => state.frames / ctx.sampleRate,
  }
}

/** Stops capture and returns what was recorded, or null if it was silent. */
export function stopRecording(): AudioBuffer | null {
  const ctx = audioContext()
  const state = capture
  capture = null
  if (!state || !ctx) return null

  state.processor.onaudioprocess = null
  try {
    state.source.disconnect()
    state.processor.disconnect()
    state.sink.disconnect()
  } catch {
    /* already torn down */
  }

  if (state.frames < ctx.sampleRate * 0.25) return null

  const buffer = ctx.createBuffer(1, state.frames, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let offset = 0
  for (const chunk of state.chunks) {
    data.set(chunk, offset)
    offset += chunk.length
  }
  trimSilence(data)
  return buffer
}

/** Softens the dead air at both ends so playback starts on the child's voice. */
function trimSilence(data: Float32Array): void {
  const fade = Math.min(1200, Math.floor(data.length / 8))
  for (let i = 0; i < fade; i++) {
    const g = i / fade
    data[i] *= g
    data[data.length - 1 - i] *= g
  }
}

export type VoiceStyle = 'squeaky' | 'normal' | 'deep'

const RATES: Record<VoiceStyle, number> = { squeaky: 1.62, normal: 1, deep: 0.74 }

export function stopPlayback(): void {
  if (playing) {
    // Detach the handler first: a replay interrupts the previous one, and its
    // "finished" callback must not land on the screen after the new playback
    // has already been announced.
    playing.onended = null
    try {
      playing.stop()
    } catch {
      /* already stopped */
    }
    playing = null
  }
}

/**
 * Plays the recording back at a new speed. Speeding the buffer up raises the
 * pitch — that is exactly the chipmunk effect toddlers find hilarious — and a
 * gentle filter keeps the bright end from becoming shrill.
 */
export function playRecording(buffer: AudioBuffer, style: VoiceStyle, onEnded?: () => void): number {
  const ctx = audioContext()
  const out = output()
  if (!ctx || !out) return 0
  stopPlayback()

  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.playbackRate.value = RATES[style]

  const shelf = ctx.createBiquadFilter()
  shelf.type = 'lowpass'
  shelf.frequency.value = style === 'squeaky' ? 4200 : 6000
  shelf.Q.value = 0.5

  const gain = ctx.createGain()
  gain.gain.value = style === 'deep' ? 1.15 : 0.95

  src.connect(shelf)
  shelf.connect(gain)
  gain.connect(out)
  src.onended = () => {
    if (playing === src) playing = null
    onEnded?.()
  }
  src.start()
  playing = src
  return buffer.duration / RATES[style]
}
