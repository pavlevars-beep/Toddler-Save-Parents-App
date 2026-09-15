/**
 * First tap.
 *
 * Browsers only allow audio after a real gesture, so the app needs one deliberate
 * touch before anything can make a sound. We make that touch useful: it is also
 * where we go full screen and ask the screen to stay awake, so the tablet does
 * not dim halfway through a phone call with a cow.
 */

import { chime, unlockAudio } from '../../audio/engine'
import AnimalArt from '../art/Animal'
import { useSettings } from '../../state/settings'

async function goFullscreen(): Promise<void> {
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen({ navigationUI: 'hide' })
    }
  } catch {
    /* iOS Safari and most WebViews refuse — the app works either way */
  }
}

export default function StartGate({ onStart }: { onStart: () => void }) {
  const { t } = useSettings()

  const start = () => {
    unlockAudio()
    chime(1)
    void goFullscreen()
    onStart()
  }

  return (
    <button className="gate" onClick={start}>
      <div className="gate-art">
        <AnimalArt id="maca" size="clamp(120px, 26vh, 210px)" mood="happy" />
      </div>
      <div className="gate-title">{t.appName}</div>
      <div className="gate-sub">{t.common.tapToStart}</div>
    </button>
  )
}
