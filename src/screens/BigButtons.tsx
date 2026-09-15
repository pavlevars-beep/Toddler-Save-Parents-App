/**
 * Dugmići — six big buttons, six different answers.
 *
 * The point of this screen is cause and effect. Every pad does something a
 * child can name afterwards ("the light went on", "the balloon flew away"), so
 * no two feel like the same button in a different colour. Nothing here can be
 * done wrong, and nothing ever disappears from the board.
 */

import { useCallback, useEffect, useState } from 'react'
import { breath, chime, sparkle, stopAll, thud, tone } from '../audio/engine'
import { cancelSpeech, speak } from '../audio/speech'
import { BalloonArt, BellArt, DrumArt, LampArt, StarArt, WaterArt } from '../components/art/Icons'
import ScreenHead from '../components/ui/ScreenHead'
import { useTimers } from '../hooks/useTimers'
import { useSettings } from '../state/settings'
import type { Strings } from '../i18n/strings'

type PadId = 'bell' | 'lamp' | 'balloon' | 'drum' | 'water' | 'star'

interface Pad {
  id: PadId
  color: string
  art: JSX.Element
  /** True when the pad's effect draws an expanding ring. */
  ripple?: boolean
}

const PADS: Pad[] = [
  { id: 'bell', color: '#cfa94f', art: <BellArt size="clamp(56px, 15vh, 128px)" />, ripple: true },
  { id: 'lamp', color: '#e8c97a', art: <LampArt size="clamp(56px, 15vh, 128px)" /> },
  { id: 'balloon', color: '#dda394', art: <BalloonArt size="clamp(56px, 15vh, 128px)" /> },
  { id: 'drum', color: '#a9c3d4', art: <DrumArt size="clamp(56px, 15vh, 128px)" /> },
  { id: 'water', color: '#7fa1b6', art: <WaterArt size="clamp(56px, 15vh, 128px)" />, ripple: true },
  { id: 'star', color: '#e8c97a', art: <StarArt size="clamp(56px, 15vh, 128px)" />, ripple: true },
]

interface Balloon {
  key: number
  left: string
  color: string
}

const BALLOON_COLORS = ['#dda394', '#b7c7a8', '#a9c3d4', '#e8c97a', '#c2b3cd']

export default function BigButtons({ onBack }: { onBack: () => void }) {
  const { t, settings } = useSettings()
  const { after } = useTimers()
  const [active, setActive] = useState<{ id: PadId; nonce: number } | null>(null)
  const [lit, setLit] = useState(false)
  const [balloons, setBalloons] = useState<Balloon[]>([])

  useEffect(() => () => {
    cancelSpeech()
    stopAll()
  }, [])

  const press = useCallback(
    (pad: Pad, index: number) => {
      setActive({ id: pad.id, nonce: Date.now() })
      const label = (t.buttons as Record<string, string>)[pad.id] ?? ''

      switch (pad.id) {
        case 'bell':
          chime(2)
          break
        case 'lamp':
          // The whole screen answers, not just the button.
          setLit((on) => !on)
          tone({ freq: 660, duration: 0.18, gain: 0.22, type: 'triangle', warm: true })
          tone({ freq: 880, duration: 0.35, gain: 0.18, delay: 0.1, warm: true })
          break
        case 'balloon': {
          breath({ duration: 0.7, gain: 0.16, cutoff: 500, toCutoff: 1400 })
          tone({ freq: 392, toFreq: 784, duration: 0.8, gain: 0.16, warm: true })
          const key = Date.now()
          setBalloons((prev) => [
            ...prev.slice(-3),
            {
              key,
              left: `${12 + Math.random() * 70}%`,
              color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
            },
          ])
          after(2800, () => setBalloons((prev) => prev.filter((b) => b.key !== key)))
          break
        }
        case 'drum':
          thud()
          tone({ freq: 96, toFreq: 70, duration: 0.3, gain: 0.3, type: 'sine', cutoff: 420, delay: 0.02 })
          break
        case 'water':
          // A single droplet: a fast downward blip into a soft splash.
          tone({ freq: 1400, toFreq: 520, duration: 0.16, gain: 0.2, type: 'sine' })
          breath({ duration: 0.4, gain: 0.12, cutoff: 1800, toCutoff: 600, delay: 0.1 })
          break
        case 'star':
          sparkle()
          break
      }

      speak(label, settings.lang, { delay: index === 3 ? 0.25 : 0.4 })
    },
    [after, settings.lang, t.buttons],
  )

  return (
    <div className="screen board" data-lit={lit ? 'on' : 'off'}>
      <ScreenHead title={t.screens.buttons} onBack={onBack} />
      <div className="screen-body">
        <div className="board-grid">
          {PADS.map((pad, i) => (
            <button
              key={pad.id}
              className="pad"
              style={{ ['--pad-color' as string]: pad.color }}
              data-active={active?.id === pad.id}
              onClick={() => press(pad, i)}
            >
              {pad.ripple && active?.id === pad.id && <span className="pad-ripple" key={active.nonce} />}
              <span className="pad-art" style={pad.id === 'lamp' && lit ? { filter: 'brightness(1.12)' } : undefined}>
                {pad.art}
              </span>
              <span className="pad-label">{(t.buttons as Strings['buttons'])[pad.id]}</span>
            </button>
          ))}
        </div>
      </div>
      {balloons.map((b) => (
        <span className="balloon-fly" key={b.key} style={{ left: b.left }}>
          <BalloonArt size="clamp(60px, 12vh, 110px)" color={b.color} />
        </span>
      ))}
    </div>
  )
}
