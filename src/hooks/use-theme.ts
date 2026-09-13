import { AppState } from 'react-native';
import { useEffect, useState } from 'react';

import { Colors } from '@/constants/theme';
import { useMainStore } from '@/modules/configs/stores/main';

/** Oscuro de 19:00 a 07:00, hora local del celular. */
export const NIGHT_START_HOUR = 19;
export const NIGHT_END_HOUR = 7;

export function isNightHour(date = new Date()) {
  const hour = date.getHours();
  return hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;
}

function msUntilNextBoundary(from = new Date()) {
  const next = new Date(from);
  next.setSeconds(0, 0);

  if (from.getHours() >= NIGHT_START_HOUR) {
    next.setDate(next.getDate() + 1);
    next.setHours(NIGHT_END_HOUR, 0, 0, 0);
  } else if (from.getHours() < NIGHT_END_HOUR) {
    next.setHours(NIGHT_END_HOUR, 0, 0, 0);
  } else {
    next.setHours(NIGHT_START_HOUR, 0, 0, 0);
  }

  return Math.max(1000, next.getTime() - from.getTime());
}

/**
 * Resuelve light/dark segun la preferencia: manual o automatico por hora.
 */
export function useResolvedColorScheme(): 'light' | 'dark' {
  const appearance = useMainStore((state) => state.appearance);
  const [autoDark, setAutoDark] = useState(() => isNightHour());

  useEffect(() => {
    if (appearance !== 'auto') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const sync = () => {
      setAutoDark(isNightHour());
      timeoutId = setTimeout(sync, msUntilNextBoundary());
    };

    sync();

    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') setAutoDark(isNightHour());
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.remove();
    };
  }, [appearance]);

  if (appearance === 'light') return 'light';
  if (appearance === 'dark') return 'dark';
  return autoDark ? 'dark' : 'light';
}

export function useTheme() {
  return Colors[useResolvedColorScheme()];
}
