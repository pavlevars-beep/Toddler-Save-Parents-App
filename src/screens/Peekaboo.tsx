/**
 * Skrivalice — peekaboo.
 *
 * Object permanence is the big cognitive game of this age, and peekaboo is its
 * purest form. Four hills, someone behind one of them, and the only rule is
 * that touching a hill always brings a friend up. There is no wrong hill.
 */

import { useCallback, useEffect, useState } from 'react'
import { stopAll, thud, tone } from '../audio/engine'
import { cancelSpeech, speak } from '../audio/speech'
import { playAnimalGiggle, playAnimalVoice } from '../audio/voices'
import AnimalArt from '../components/art/Animal'
import ScreenHead from '../components/ui/ScreenHead'
import { ANIMALS, animal, otherAnimal, type AnimalId } from '../data/animals'
import { useTimers } from '../hooks/useTimers'
import { useSettings } from '../state/settings'

interface Mound {
  id: number
  animal: AnimalId | null
  leaving: boolean
}

const HILL_COLORS = ['#b7c7a8', '#c9d3b3', '#aec2c9', '#d3c6ac']

export default function Peekaboo({ onBack }: { onBack: () => void }) {
  const { t, settings } = useSettings()
  const { after } = useTimers()
  const [mounds, setMounds] = useState<Mound[]>(() => [0, 1, 2, 3].map((id) => ({ id, animal: null, leaving: false })))

  useEffect(() => () => {
    cancelSpeech()
    stopAll()
  }, [])

  const hide = useCallback(
    (id: number) => {
      setMounds((prev) => prev.map((m) => (m.id === id ? { ...m, leaving: true } : m)))
      after(420, () => {
        setMounds((prev) => prev.map((m) => (m.id === id ? { ...m, animal: null, leaving: false } : m)))
      })
    },
    [after],
  )

  const touch = useCallback(
    (mound: Mound) => {
      if (mound.animal && !mound.leaving) {
        // Already up: a friendly nudge, then it ducks back down.
        playAnimalGiggle(mound.animal)
        hide(mound.id)
        return
      }
      if (mound.leaving) return

      // Never the same friend twice in a row on the same hill.
      const onStage = mounds.map((m) => m.animal).filter(Boolean) as AnimalId[]
      const pool = ANIMALS.map((a) => a.id).filter((id) => !onStage.includes(id))
      const next = otherAnimal(mound.animal ?? 'maca', pool.length > 0 ? pool : undefined)

      tone({ freq: 392, toFreq: 587.33, duration: 0.3, gain: 0.2, warm: true })
      setMounds((prev) => prev.map((m) => (m.id === mound.id ? { ...m, animal: next, leaving: false } : m)))
      after(260, () => playAnimalVoice(next))
      speak(`${t.peekaboo.here} ${animal(next).name[settings.lang]}`, settings.lang, { delay: 0.95 })
      // Comes back down on its own, so the board never fills up and freezes.
      after(3600, () => {
        setMounds((prev) => {
          const still = prev.find((m) => m.id === mound.id)
          if (!still || still.animal !== next) return prev
          thud()
          return prev.map((m) => (m.id === mound.id ? { ...m, leaving: true } : m))
        })
        after(420, () =>
          setMounds((prev) => prev.map((m) => (m.id === mound.id && m.leaving ? { ...m, animal: null, leaving: false } : m))),
        )
      })
    },
    [after, hide, mounds, settings.lang, t.peekaboo.here],
  )

  return (
    <div className="screen peek">
      <ScreenHead title={t.screens.peekaboo} onBack={onBack} />
      <div className="screen-body">
        <div className="peek-grid">
          {mounds.map((m, i) => (
            <button key={m.id} className="mound" onClick={() => touch(m)} aria-label={t.peekaboo.where}>
              {m.animal && !m.leaving && <span className="peek-word">{t.peekaboo.here}</span>}
              {m.animal && (
                <AnimalArt
                  id={m.animal}
                  size="clamp(110px, 26vh, 230px)"
                  mood="happy"
                  className={`peek-animal${m.leaving ? ' leaving' : ''}`}
                />
              )}
              <span className="mound-hill" style={{ background: HILL_COLORS[i % HILL_COLORS.length] }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
