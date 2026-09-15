/**
 * Parent-owned settings, kept in localStorage.
 *
 * Deliberately small: a toddler app that needs a long options screen has
 * already lost. Everything here exists because a parent asked for it in a
 * real living room — volume, motion, speech, language, break reminder.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setMuted, setVolume } from '../audio/engine'
import { primeSpeech, setSpeechEnabled } from '../audio/speech'
import { STRINGS, type Lang, type Strings } from '../i18n/strings'

export interface Settings {
  lang: Lang
  /** 0..1 — the engine scales this into a safe range. */
  volume: number
  speech: boolean
  /** Slower, smaller movement for children who are easily over-stimulated. */
  calmMode: boolean
  /** Minutes before the break screen appears; 0 turns it off. */
  breakMinutes: number
}

const DEFAULTS: Settings = {
  lang: 'sr',
  volume: 0.7,
  speech: true,
  calmMode: false,
  breakMinutes: 20,
}

const STORAGE_KEY = 'livada.settings.v1'

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw) as Partial<Settings>
    return {
      lang: parsed.lang === 'en' ? 'en' : 'sr',
      volume: typeof parsed.volume === 'number' ? Math.min(1, Math.max(0, parsed.volume)) : DEFAULTS.volume,
      speech: typeof parsed.speech === 'boolean' ? parsed.speech : DEFAULTS.speech,
      calmMode: typeof parsed.calmMode === 'boolean' ? parsed.calmMode : DEFAULTS.calmMode,
      breakMinutes: typeof parsed.breakMinutes === 'number' ? parsed.breakMinutes : DEFAULTS.breakMinutes,
    }
  } catch {
    return DEFAULTS
  }
}

interface SettingsContextValue {
  settings: Settings
  update: (patch: Partial<Settings>) => void
  t: Strings
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load)

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* private mode — settings simply do not persist */
      }
      return next
    })
  }, [])

  useEffect(() => {
    primeSpeech()
  }, [])

  // Push settings into the audio layer and onto the document.
  useEffect(() => {
    setVolume(settings.calmMode ? settings.volume * 0.75 : settings.volume)
    setMuted(settings.volume === 0)
  }, [settings.volume, settings.calmMode])

  useEffect(() => {
    setSpeechEnabled(settings.speech)
  }, [settings.speech])

  useEffect(() => {
    document.documentElement.lang = settings.lang
    document.documentElement.dataset.calm = settings.calmMode ? 'on' : 'off'
  }, [settings.lang, settings.calmMode])

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, update, t: STRINGS[settings.lang] }),
    [settings, update],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>')
  return ctx
}
