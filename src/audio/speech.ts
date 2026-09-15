/**
 * Spoken words via the platform speech synthesiser.
 *
 * Speech is a bonus, never a requirement: on devices with no Serbian voice (or
 * no speech support at all) every screen still works, because the meaning is
 * always carried by the picture, the animation and the sound as well.
 */

import type { Lang } from '../i18n/strings'

let enabled = true
let cachedVoice: SpeechSynthesisVoice | null = null
let cachedFor = ''

export function setSpeechEnabled(on: boolean): void {
  enabled = on
  if (!on) cancelSpeech()
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  if (!speechSupported()) return null
  if (cachedFor === lang && cachedVoice) return cachedVoice
  const wanted = lang === 'sr' ? ['sr', 'hr', 'bs', 'sl'] : ['en']
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null
  let found: SpeechSynthesisVoice | undefined
  for (const prefix of wanted) {
    found = voices.find((v) => v.lang.toLowerCase().startsWith(prefix))
    if (found) break
  }
  cachedVoice = found ?? null
  cachedFor = lang
  return cachedVoice
}

/** Warm the voice list up; some browsers populate it asynchronously. */
export function primeSpeech(): void {
  if (!speechSupported()) return
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null
    cachedFor = ''
  }
}

export function cancelSpeech(): void {
  if (!speechSupported()) return
  try {
    window.speechSynthesis.cancel()
  } catch {
    /* some WebViews throw when nothing is queued */
  }
}

/**
 * Says a short phrase slowly and warmly.
 * `delay` lets a screen line speech up behind an animation or a sound.
 */
export function speak(text: string, lang: Lang, options: { delay?: number; pitch?: number; rate?: number } = {}): void {
  if (!enabled || !speechSupported() || !text) return
  const { delay = 0, pitch = 1.15, rate = 0.85 } = options
  const say = () => {
    try {
      cancelSpeech()
      const u = new SpeechSynthesisUtterance(text)
      const voice = pickVoice(lang)
      if (voice) u.voice = voice
      u.lang = voice?.lang ?? (lang === 'sr' ? 'sr-RS' : 'en-US')
      u.pitch = pitch
      u.rate = rate
      u.volume = 0.9
      window.speechSynthesis.speak(u)
    } catch {
      /* speech is optional — never break play */
    }
  }
  if (delay > 0) window.setTimeout(say, delay * 1000)
  else say()
}
