/**
 * The break screen.
 *
 * It does not nag and it does not count down in front of the child: the play
 * simply pauses on a quiet picture, and only a grown-up's steady finger starts
 * it again. Turning it off entirely is one tap away in the parent area.
 */

import { useHoldPress } from '../../hooks/useHoldPress'
import AnimalArt from '../art/Animal'
import { useSettings } from '../../state/settings'

export default function PauseScreen({ onContinue }: { onContinue: () => void }) {
  const { t } = useSettings()
  const { progress, handlers } = useHoldPress(onContinue, 2000)

  return (
    <div className="pause">
      <AnimalArt id="ovca" size="clamp(110px, 22vh, 190px)" mood="sleepy" />
      <h2>{t.pause.title}</h2>
      <p>{t.pause.body}</p>
      <button className="pause-hold" {...handlers}>
        <span className="fill" style={{ transform: `scaleX(${progress})` }} />
        <span>{progress > 0 ? t.common.holding : t.pause.holdToContinue}</span>
      </button>
    </div>
  )
}
