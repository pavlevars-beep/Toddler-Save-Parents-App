/**
 * Moj glas — record yourself, hear yourself back, squeaky.
 *
 * This is the loudest laugh in the app and also the simplest loop: one giant
 * circle. Tap it, talk, and a moment later a tiny voice says exactly what you
 * said. The ring around the circle fills up so a child can see the recording
 * ending before it ends, and the halo breathes with their own loudness, which
 * is often the first time they notice that *they* are making something happen.
 *
 * Nothing is stored: the recording lives in memory and dies with the screen.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { chime, sparkle, stopAll, thud, unlockAudio } from '../audio/engine'
import { cancelSpeech } from '../audio/speech'
import {
  MAX_SECONDS,
  closeMic,
  playRecording,
  startRecording,
  stopPlayback,
  stopRecording,
  type MicError,
  type VoiceStyle,
} from '../audio/recorder'
import AnimalArt from '../components/art/Animal'
import { MicIcon } from '../components/art/Icons'
import ScreenHead from '../components/ui/ScreenHead'
import { useTimers } from '../hooks/useTimers'
import { useSettings } from '../state/settings'

type VoiceState = 'idle' | 'recording' | 'playing' | 'ready'

export default function Voice({ onBack }: { onBack: () => void }) {
  const { t } = useSettings()
  const { after, clearAll } = useTimers()
  const [state, setState] = useState<VoiceState>('idle')
  const [error, setError] = useState<MicError | null>(null)
  const [level, setLevel] = useState(0)
  const [progress, setProgress] = useState(0)
  const buffer = useRef<AudioBuffer | null>(null)
  const frame = useRef(0)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      cancelAnimationFrame(frame.current)
      stopPlayback()
      // Releases the microphone so the device's recording dot disappears and
      // the buffer with the child's voice is dropped.
      closeMic()
      buffer.current = null
      cancelSpeech()
      stopAll()
    }
  }, [])

  const play = useCallback(
    (style: VoiceStyle) => {
      if (!buffer.current) return
      clearAll()
      setState('playing')
      const seconds = playRecording(buffer.current, style, () => {
        if (alive.current) setState('ready')
      })
      // A safety net in case `onended` never fires in an odd WebView.
      after(Math.ceil(seconds * 1000) + 600, () => {
        if (alive.current) setState((s) => (s === 'playing' ? 'ready' : s))
      })
    },
    [after, clearAll],
  )

  const finish = useCallback(() => {
    cancelAnimationFrame(frame.current)
    setLevel(0)
    setProgress(0)
    const recorded = stopRecording()
    if (!recorded) {
      // Too short or silent — say nothing, just go back to waiting.
      setState('idle')
      thud()
      return
    }
    buffer.current = recorded
    sparkle()
    after(420, () => play('squeaky'))
  }, [after, play])

  const begin = useCallback(async () => {
    unlockAudio()
    stopPlayback()
    clearAll()
    setError(null)
    try {
      const handle = await startRecording()
      if (!alive.current) {
        stopRecording()
        return
      }
      setState('recording')
      chime(0)
      const loop = () => {
        if (!alive.current) return
        setLevel(handle.level())
        const p = Math.min(1, handle.elapsed() / MAX_SECONDS)
        setProgress(p)
        if (p >= 1) {
          finish()
          return
        }
        frame.current = requestAnimationFrame(loop)
      }
      frame.current = requestAnimationFrame(loop)
    } catch (err) {
      setError((err as MicError) ?? 'denied')
      setState('idle')
    }
  }, [clearAll, finish])

  const onMicTap = useCallback(() => {
    if (state === 'recording') finish()
    else void begin()
  }, [begin, finish, state])

  const status =
    state === 'recording'
      ? t.voice.listening
      : state === 'playing'
        ? t.voice.playing
        : state === 'ready'
          ? t.voice.again
          : t.voice.tapToRecord

  return (
    <div className="screen voice">
      <ScreenHead title={t.screens.voice} onBack={onBack} />
      <div className="screen-body">
        {error ? (
          <div className="voice-stage">
            <div className="notice">
              <strong>{error === 'denied' ? t.voice.micBlocked : t.voice.micMissing}</strong>
              {error === 'denied' ? t.voice.micBlockedHelp : null}
            </div>
          </div>
        ) : (
          <div className="voice-stage">
            <AnimalArt
              id="ptica"
              size="clamp(84px, 18vh, 150px)"
              mood={state === 'playing' ? 'talking' : state === 'recording' ? 'happy' : 'calm'}
            />
            <div className="voice-status">{status}</div>

            <button
              className="mic-btn"
              data-state={state}
              onClick={onMicTap}
              aria-label={t.voice.tapToRecord}
              style={{ ['--level' as string]: String(1 + level * 0.22) }}
            >
              {state === 'recording' && <span className="mic-halo" />}
              <svg className="mic-ring" viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  stroke="#c4816f"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - progress}
                  opacity={state === 'recording' ? 0.9 : 0}
                />
              </svg>
              <MicIcon size="46%" color={state === 'recording' ? '#c4816f' : '#93aa84'} />
            </button>

            {(state === 'ready' || state === 'playing') && buffer.current && (
              <div className="voice-actions">
                <button className="big-btn" onClick={() => play('squeaky')}>
                  <AnimalArt id="maca" size={54} mood="happy" />
                  <span className="btn-label">{t.voice.squeaky}</span>
                </button>
                <button className="big-btn" onClick={() => play('normal')}>
                  <AnimalArt id="ptica" size={54} />
                  <span className="btn-label">{t.voice.normal}</span>
                </button>
                <button className="big-btn" onClick={() => play('deep')}>
                  <AnimalArt id="meda" size={54} />
                  <span className="btn-label">{t.voice.deep}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
