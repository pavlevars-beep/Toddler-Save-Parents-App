/**
 * The menu.
 *
 * Five doors, always in the same places, always the same colours. Children this
 * age navigate by position and colour long before they read, so the grid never
 * reorders itself and never hides anything behind scrolling.
 */

import { chime, noteFromScale, tone } from '../audio/engine'
import { speak } from '../audio/speech'
import { MessageIcon, MicIcon, PadsIcon, PeekIcon, PhoneIcon } from '../components/art/Icons'
import { useSettings } from '../state/settings'
import type { ScreenId } from '../types'

interface Tile {
  id: Exclude<ScreenId, 'home'>
  color: string
  art: JSX.Element
}

const TILES: Tile[] = [
  { id: 'phone', color: '#93aa84', art: <PhoneIcon size="clamp(56px, 13vh, 112px)" /> },
  { id: 'messages', color: '#7fa1b6', art: <MessageIcon size="clamp(56px, 13vh, 112px)" /> },
  { id: 'voice', color: '#c4816f', art: <MicIcon size="clamp(56px, 13vh, 112px)" /> },
  { id: 'buttons', color: '#cfa94f', art: <PadsIcon size="clamp(56px, 13vh, 112px)" /> },
  { id: 'peekaboo', color: '#a9c3d4', art: <PeekIcon size="clamp(56px, 13vh, 112px)" /> },
]

export default function Home({ onOpen }: { onOpen: (id: ScreenId) => void }) {
  const { t, settings } = useSettings()

  const open = (tile: Tile, index: number) => {
    tone({ freq: noteFromScale(index + 1), duration: 0.32, gain: 0.3, warm: true })
    const label = t.screens[tile.id]
    speak(label, settings.lang, { delay: 0.1 })
    // A short pause lets the tap sound land before the screen changes.
    window.setTimeout(() => onOpen(tile.id), 180)
  }

  return (
    <div className="screen home">
      <div className="home-head">
        <div className="home-title">{t.appName}</div>
        <div className="home-tagline">{t.tagline}</div>
      </div>
      <div className="tile-grid">
        {TILES.map((tile, i) => (
          <button
            key={tile.id}
            className="tile"
            style={{ ['--tile-color' as string]: tile.color }}
            onClick={() => open(tile, i)}
          >
            <div className="tile-art" style={{ animationDelay: `${i * 400}ms` }}>
              {tile.art}
            </div>
            <div className="tile-label">{t.screens[tile.id]}</div>
            <div className="tile-hint">{t.screenHints[tile.id]}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

/** Played once when the app returns to the menu. */
export function homeChime(): void {
  chime(1)
}
