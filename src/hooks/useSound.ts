import { useCallback } from 'react';
import {
  playAnimalSound,
  playSuccessSound,
  playTapSound,
  playNameChime,
  playSessionEndMelody,
} from '../utils/sounds';

export function useSound(enabled: boolean) {
  const animal = useCallback((id: string) => {
    if (enabled) playAnimalSound(id);
  }, [enabled]);

  const success = useCallback(() => {
    if (enabled) playSuccessSound();
  }, [enabled]);

  const tap = useCallback(() => {
    if (enabled) playTapSound();
  }, [enabled]);

  const nameChime = useCallback(() => {
    if (enabled) playNameChime();
  }, [enabled]);

  const sessionEnd = useCallback(() => {
    if (enabled) playSessionEndMelody();
  }, [enabled]);

  return { animal, success, tap, nameChime, sessionEnd };
}
