/**
 * Poruke — writing to the animals with pictures.
 *
 * A child of two cannot type, but they can absolutely *send* something and wait
 * for an answer. The keyboard is pictures, every tap posts a real message, and
 * the animal always writes back — with a picture that belongs with the one it
 * received, so the exchange means something instead of being random noise.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { stopAll, tap as tapSound, tone } from '../audio/engine'
import { cancelSpeech, speak } from '../audio/speech'
import { playAnimalVoice } from '../audio/voices'
import AnimalArt from '../components/art/Animal'
import PictoArt, { PICTOS, type PictoId } from '../components/art/Pictos'
import ScreenHead from '../components/ui/ScreenHead'
import { ANIMALS, animal, type AnimalId } from '../data/animals'
import { useTimers } from '../hooks/useTimers'
import { useSettings } from '../state/settings'

interface Bubble {
  key: number
  from: 'child' | 'animal'
  picto: PictoId
  text: string
}

/** What each picture "answers with" — a small, readable conversation logic. */
const REPLIES: Record<PictoId, PictoId> = {
  srce: 'srce',
  sunce: 'cvet',
  lopta: 'ruka',
  jabuka: 'kolac',
  zvezda: 'mesec',
  cvet: 'sunce',
  mesec: 'zvezda',
  auto: 'auto',
  kolac: 'jabuka',
  kisa: 'sunce',
  riba: 'kisa',
  ruka: 'srce',
}

const MAX_BUBBLES = 24

function pictoName(id: PictoId, lang: 'sr' | 'en'): string {
  return PICTOS.find((p) => p.id === id)?.name[lang] ?? ''
}

export default function Messages({ onBack }: { onBack: () => void }) {
  const { t, settings } = useSettings()
  const { after, clearAll } = useTimers()
  const [friend, setFriend] = useState<AnimalId>('maca')
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [typing, setTyping] = useState(false)
  const threadRef = useRef<HTMLDivElement | null>(null)
  const counter = useRef(0)

  useEffect(() => () => {
    cancelSpeech()
    stopAll()
  }, [])

  // Keep the newest message in view without ever showing a scrollbar.
  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [bubbles, typing])

  const push = useCallback((bubble: Omit<Bubble, 'key'>) => {
    counter.current += 1
    const next = { ...bubble, key: counter.current }
    setBubbles((prev) => [...prev, next].slice(-MAX_BUBBLES))
  }, [])

  const send = useCallback(
    (picto: PictoId, index: number) => {
      // A fast drummer gets every bubble, but only one reply — the last one.
      clearAll()
      setTyping(false)
      tapSound(index)
      const name = pictoName(picto, settings.lang)
      push({ from: 'child', picto, text: name })
      speak(name, settings.lang, { delay: 0.15 })

      after(850, () => setTyping(true))
      after(1900, () => {
        setTyping(false)
        const reply = REPLIES[picto]
        const line = t.animalLines.chat[Math.floor(Math.random() * t.animalLines.chat.length)]
        push({ from: 'animal', picto: reply, text: line })
        playAnimalVoice(friend)
        speak(`${line} ${pictoName(reply, settings.lang)}`, settings.lang, { delay: 0.75 })
      })
    },
    [after, clearAll, friend, push, settings.lang, t.animalLines.chat],
  )

  const chooseFriend = useCallback(
    (id: AnimalId) => {
      if (id === friend) return
      clearAll()
      setTyping(false)
      setFriend(id)
      setBubbles([])
      tone({ freq: 587.33, duration: 0.3, gain: 0.26, warm: true })
      playAnimalVoice(id)
      speak(animal(id).name[settings.lang], settings.lang, { delay: 0.8 })
    },
    [clearAll, friend, settings.lang],
  )

  return (
    <div className="screen messages">
      <ScreenHead title={t.screens.messages} onBack={onBack} />
      <div className="screen-body">
        <div className="friend-strip">
          {ANIMALS.map((a) => (
            <button
              key={a.id}
              className="friend-chip"
              data-active={a.id === friend}
              onClick={() => chooseFriend(a.id)}
              aria-label={a.name[settings.lang]}
            >
              <AnimalArt id={a.id} size={58} />
            </button>
          ))}
        </div>

        <div className="thread" ref={threadRef}>
          {bubbles.length === 0 && !typing && (
            <div className="bubble">
              <AnimalArt id={friend} size={44} mood="happy" />
              <span className="bubble-text">{t.messages.tapPicture}</span>
            </div>
          )}
          {bubbles.map((b) => (
            <div className="bubble" data-from={b.from} key={b.key}>
              {b.from === 'animal' && <AnimalArt id={friend} size={44} mood="happy" />}
              <PictoArt id={b.picto} size={44} />
              <span className="bubble-text">{b.text}</span>
            </div>
          ))}
          {typing && (
            <div className="typing">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>

        <div className="keyboard">
          {PICTOS.map((p, i) => (
            <button key={p.id} className="key" onClick={() => send(p.id, i)} aria-label={p.name[settings.lang]}>
              <PictoArt id={p.id} size="72%" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
