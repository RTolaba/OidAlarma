import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { TimeFormat } from '@/utils/time';

import { persistedStorage } from './storage';

export type { TimeFormat };
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type AppearanceMode = 'auto' | 'light' | 'dark';

type MainState = {
  timeFormat: TimeFormat;
  temperatureUnit: TemperatureUnit;
  showSeconds: boolean;
  appearance: AppearanceMode;
  setTimeFormat: (format: TimeFormat) => void;
  toggleTimeFormat: () => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  toggleTemperatureUnit: () => void;
  setShowSeconds: (show: boolean) => void;
  setAppearance: (appearance: AppearanceMode) => void;
};

/**
 * Preferencias globales: hora, temperatura y apariencia.
 */
export const useMainStore = create<MainState>()(
  persist(
    (set) => ({
      timeFormat: '24h',
      temperatureUnit: 'celsius',
      showSeconds: true,
      appearance: 'auto',
      setTimeFormat: (timeFormat) => set({ timeFormat }),
      toggleTimeFormat: () =>
        set((state) => ({ timeFormat: state.timeFormat === '24h' ? '12h' : '24h' })),
      setTemperatureUnit: (temperatureUnit) => set({ temperatureUnit }),
      toggleTemperatureUnit: () =>
        set((state) => ({
          temperatureUnit: state.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius',
        })),
      setShowSeconds: (showSeconds) => set({ showSeconds }),
      setAppearance: (appearance) => set({ appearance }),
    }),
    { name: 'oidalarma:main', storage: persistedStorage },
  ),
);
