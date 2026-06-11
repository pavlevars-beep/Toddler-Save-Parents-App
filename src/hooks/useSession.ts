import { useState, useEffect, useRef, useCallback } from 'react';
import { AppSettings, SessionLength, ActivityMode } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  activityMode: 'mixed',
  sessionLength: 10,
  calmEnding: true,
  restaurantMode: false,
};

export function useSession() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSession = useCallback(() => {
    setTimeRemaining(settings.sessionLength * 60);
    setSessionActive(true);
    setSessionEnded(false);
  }, [settings.sessionLength]);

  const endSession = useCallback(() => {
    setSessionActive(false);
    setSessionEnded(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const resetSession = useCallback(() => {
    setSessionActive(false);
    setSessionEnded(false);
    setTimeRemaining(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!sessionActive) return;
    intervalRef.current = setInterval(() => {
      setTimeRemaining(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setSessionActive(false);
          setSessionEnded(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionActive]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings(s => ({ ...s, ...patch }));
  }, []);

  const setSoundEnabled = useCallback((v: boolean) => updateSettings({ soundEnabled: v }), [updateSettings]);
  const setActivityMode = useCallback((v: ActivityMode) => updateSettings({ activityMode: v }), [updateSettings]);
  const setSessionLength = useCallback((v: SessionLength) => updateSettings({ sessionLength: v }), [updateSettings]);
  const setCalmEnding = useCallback((v: boolean) => updateSettings({ calmEnding: v }), [updateSettings]);
  const setRestaurantMode = useCallback((v: boolean) => updateSettings({ restaurantMode: v }), [updateSettings]);

  return {
    settings,
    sessionActive,
    sessionEnded,
    timeRemaining,
    startSession,
    endSession,
    resetSession,
    setSoundEnabled,
    setActivityMode,
    setSessionLength,
    setCalmEnding,
    setRestaurantMode,
  };
}
