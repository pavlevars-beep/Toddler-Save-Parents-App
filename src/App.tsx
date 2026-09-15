/**
 * Livada — app shell.
 *
 * Holds the five activities, the way back to the menu, the parent door and the
 * break reminder. It keeps no other state: each activity owns its own little
 * world and forgets it on the way out, which is also why leaving a screen is
 * always instant and never loses anything a child cares about.
 */

import { useCallback, useEffect, useState } from 'react'
import { stopAll, thud } from './audio/engine'
import { cancelSpeech } from './audio/speech'
import ParentDoor from './components/ui/ParentDoor'
import ParentSheet from './components/ui/ParentSheet'
import PauseScreen from './components/ui/PauseScreen'
import StartGate from './components/ui/StartGate'
import { useWakeLock } from './hooks/useWakeLock'
import BigButtons from './screens/BigButtons'
import Home from './screens/Home'
import Messages from './screens/Messages'
import Peekaboo from './screens/Peekaboo'
import Phone from './screens/Phone'
import Voice from './screens/Voice'
import { useSettings } from './state/settings'
import type { ScreenId } from './types'

export default function App() {
  const { settings, t } = useSettings()
  const [started, setStarted] = useState(false)
  const [screen, setScreen] = useState<ScreenId>('home')
  const [parentOpen, setParentOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const [playedSince, setPlayedSince] = useState(() => Date.now())

  useWakeLock(started && !paused)

  const goHome = useCallback(() => {
    cancelSpeech()
    stopAll()
    thud()
    setScreen('home')
  }, [])

  // Break reminder. Checked on a slow tick rather than one long timeout so a
  // backgrounded tablet cannot "sleep through" the break.
  useEffect(() => {
    if (!started || settings.breakMinutes <= 0 || paused || parentOpen) return
    const id = window.setInterval(() => {
      if (Date.now() - playedSince >= settings.breakMinutes * 60_000) {
        cancelSpeech()
        stopAll()
        setPaused(true)
      }
    }, 10_000)
    return () => window.clearInterval(id)
  }, [parentOpen, paused, playedSince, settings.breakMinutes, started])

  const resume = useCallback(() => {
    setPlayedSince(Date.now())
    setPaused(false)
    setScreen('home')
  }, [])

  // Anything still ringing stops the moment the tablet is put down.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') {
        cancelSpeech()
        stopAll()
      }
    }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [])

  const openParents = useCallback(() => {
    cancelSpeech()
    stopAll()
    setParentOpen(true)
  }, [])

  const closeParents = useCallback(() => {
    setParentOpen(false)
    // A visit to the settings should not immediately trigger a break.
    setPlayedSince((since) => (settings.breakMinutes > 0 ? since : Date.now()))
  }, [settings.breakMinutes])

  return (
    <div className="app">
      {screen === 'home' && <Home onOpen={setScreen} />}
      {screen === 'phone' && <Phone onBack={goHome} />}
      {screen === 'messages' && <Messages onBack={goHome} />}
      {screen === 'voice' && <Voice onBack={goHome} />}
      {screen === 'buttons' && <BigButtons onBack={goHome} />}
      {screen === 'peekaboo' && <Peekaboo onBack={goHome} />}

      {started && !paused && <ParentDoor onOpen={openParents} label={t.common.forParents} />}
      {parentOpen && <ParentSheet onClose={closeParents} />}
      {paused && <PauseScreen onContinue={resume} />}
      {!started && <StartGate onStart={() => { setStarted(true); setPlayedSince(Date.now()) }} />}
    </div>
  )
}
