import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistedStorage } from '@/modules/configs/stores/storage';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

type TimerState = {
  /** Duracion configurada por el usuario. */
  durationMs: number;
  status: TimerStatus;
  /** Momento en el que termina, mientras corre. */
  endsAt: number | null;
  /** Tiempo restante congelado cuando esta en pausa. */
  remainingMs: number;
  setDuration: (ms: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  finish: () => void;
};

const DEFAULT_DURATION = 5 * 60 * 1000;

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      durationMs: DEFAULT_DURATION,
      status: 'idle',
      endsAt: null,
      remainingMs: DEFAULT_DURATION,
      setDuration: (ms) => set({ durationMs: ms, remainingMs: ms, status: 'idle', endsAt: null }),
      start: () => {
        const { durationMs } = get();
        if (durationMs <= 0) return;
        set({ status: 'running', endsAt: Date.now() + durationMs, remainingMs: durationMs });
      },
      pause: () => {
        const { endsAt } = get();
        set({
          status: 'paused',
          remainingMs: Math.max(0, (endsAt ?? Date.now()) - Date.now()),
          endsAt: null,
        });
      },
      resume: () => {
        const { remainingMs } = get();
        set({ status: 'running', endsAt: Date.now() + remainingMs });
      },
      reset: () => {
        const { durationMs } = get();
        set({ status: 'idle', endsAt: null, remainingMs: durationMs });
      },
      finish: () => set({ status: 'finished', endsAt: null, remainingMs: 0 }),
    }),
    {
      name: 'oidalarma:timer',
      storage: persistedStorage,
      partialize: (state) => ({ durationMs: state.durationMs }),
    },
  ),
);

/** Tiempo restante para un instante dado. */
export function selectRemaining(state: TimerState, now: number) {
  if (state.status === 'running' && state.endsAt) return Math.max(0, state.endsAt - now);
  return state.remainingMs;
}
