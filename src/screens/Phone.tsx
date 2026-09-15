/**
 * Telefon — calling an animal.
 *
 * The pretend phone call is the heart of the app: a child chooses a friend,
 * hears it ring, and someone answers *them*. The whole loop is four beats long
 * so a short attention span can hold all of it: pick, ring, hello, goodbye.
 */

import { useCallback, useEffect, useState } from 'react'
import { breath, stopAll, thud, tone } from '../audio/engine'
import { cancelSpeech, speak } from '../audio/speech'
import { playAnimalGiggle, playAnimalVoice } from '../audio/voices'
import AnimalArt from '../components/art/Animal'
import ScreenHead from '../components/ui/ScreenHead'
import { ANIMALS, animal, type AnimalId } from '../data/animals'
import { useTimers } from '../hooks/useTimers'
import { fill } from '../i18n/strings'
import { useSettings } from '../state/settings'

type CallState = 'picking' | 'ringing' | 'talking' | 'bye'

function pick(lines: string[]): string {
  return lines[Math.floor(Math.random() * lines.length)]
}

/** Two soft rings, the way an old handset sounds through a blanket. */
function ringTone(delay: number): void {
  tone({ freq: 523.25, duration: 0.24, gain: 0.22, delay, warm: true, cutoff: 1800 })
  tone({ freq: 659.25, duration: 0.3, gain: 0.2, delay: delay + 0.22, warm: true, cutoff: 1800 })
}

export default function Phone({ onBack }: { onBack: () => void }) {
  const { t, settings } = useSettings()
  const { after, clearAll } = useTimers()
  const [state, setState] = useState<CallState>('picking')
  const [callee, setCallee] = useState<AnimalId | null>(null)
  const [line, setLine] = useState('')

  useEffect(() => () => {
    cancelSpeech()
    stopAll()
  }, [])

  const call = useCallback(
    (id: AnimalId) => {
      clearAll()
      cancelSpeech()
      setCallee(id)
      setLine('')
      setState('ringing')
      ringTone(0.05)
      ringTone(1.15)
      after(2250, () => {
        setState('talking')
        playAnimalVoice(id)
        const name = animal(id).name[settings.lang]
        const greeting = fill(pick(t.animalLines.greeting), { name })
        setLine(greeting)
        speak(greeting, settings.lang, { delay: 0.9 })
      })
    },
    [after, clearAll, settings.lang, t.animalLines.greeting],
  )

  const poke = useCallback(() => {
    if (state !== 'talking' || !callee) return
    clearAll()
    playAnimalGiggle(callee)
    const said = pick(t.animalLines.chat)
    setLine(said)
    speak(said, settings.lang, { delay: 0.5 })
    after(700, () => playAnimalVoice(callee))
  }, [after, callee, clearAll, settings.lang, state, t.animalLines.chat])

  const hangUp = useCallback(() => {
    if (!callee) return
    clearAll()
    cancelSpeech()
    setState('bye')
    const bye = pick(t.animalLines.bye)
    setLine(bye)
    speak(bye, settings.lang)
    after(900, () => {
      thud()
      breath({ duration: 0.3, gain: 0.08, cutoff: 500, toCutoff: 200 })
    })
    after(1500, () => {
      setState('picking')
      setCallee(null)
      setLine('')
    })
  }, [after, callee, clearAll, settings.lang, t.animalLines.bye])

  const friend = callee ? animal(callee) : null

  return (
    <div className="screen phone" style={friend ? { background: friend.scene } : undefined}>
      <ScreenHead title={t.screens.phone} onBack={onBack} />
      <div className="screen-body">
        {state === 'picking' ? (
          <>
            <div className="call-status">{t.phone.whoToCall}</div>
            <div className="contact-grid">
              {ANIMALS.map((a) => (
                <button key={a.id} className="contact" onClick={() => call(a.id)}>
                  <AnimalArt id={a.id} size="clamp(64px, 18vh, 150px)" />
                  <span className="contact-name">{a.name[settings.lang]}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="call-stage">
            <div className="call-status">
              {state === 'ringing' ? t.phone.ringing : state === 'talking' ? t.phone.talkPrompt : ''}
            </div>
            <button
              className="call-avatar"
              data-state={state}
              onClick={poke}
              aria-label={friend?.name[settings.lang] ?? ''}
            >
              {state === 'ringing' && (
                <>
                  <span className="ring-wave" />
                  <span className="ring-wave" />
                </>
              )}
              {friend && (
                <AnimalArt
                  id={friend.id}
                  size="clamp(120px, 26vh, 220px)"
                  mood={state === 'talking' ? 'talking' : state === 'bye' ? 'happy' : 'calm'}
                />
              )}
            </button>
            {line && (
              <div className="call-bubble" key={line}>
                {line}
              </div>
            )}
            {state !== 'bye' && (
              <button className="hangup" onClick={hangUp}>
                {t.phone.hangUp}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
