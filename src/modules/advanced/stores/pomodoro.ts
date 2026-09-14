import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistedStorage } from '@/modules/configs/stores/storage';

export type PomodoroPhase = 'focus' | 'shortBreak' | 'longBreak';
export type PomodoroStatus = 'idle' | 'running' | 'paused';

export const PHASE_LABELS: Record<PomodoroPhase, string> = {
  focus: 'Foco',
  shortBreak: 'Descanso corto',
  longBreak: 'Descanso largo',
};

type PomodoroConfig = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  roundsBeforeLongBreak: number;
};

type PomodoroState = PomodoroConfig & {
  phase: PomodoroPhase;
  /** Rondas de foco completadas en el ciclo actual. */
  completedRounds: number;
  status: PomodoroStatus;
  endsAt: number | null;
  remainingMs: number;
  setConfig: (config: Partial<PomodoroConfig>) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  advance: () => void;
};

const MINUTE = 60 * 1000;

const durationOf = (config: PomodoroConfig, phase: PomodoroPhase) => {
  if (phase === 'focus') return config.focusMinutes * MINUTE;
  if (phase === 'shortBreak') return config.shortBreakMinutes * MINUTE;
  return config.longBreakMinutes * MINUTE;
};

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      focusMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 20,
      roundsBeforeLongBreak: 4,
      phase: 'focus',
      completedRounds: 0,
      status: 'idle',
      endsAt: null,
      remainingMs: 25 * MINUTE,
      setConfig: (config) =>
        set((state) => {
          const next = { ...state, ...config };
          return {
            ...config,
            status: 'idle' as const,
            endsAt: null,
            remainingMs: durationOf(next, state.phase),
          };
        }),
      start: () => {
        const state = get();
        const duration = durationOf(state, state.phase);
        set({ status: 'running', endsAt: Date.now() + duration, remainingMs: duration });
      },
      pause: () => {
        const { endsAt } = get();
        set({
          status: 'paused',
          remainingMs: Math.max(0, (endsAt ?? Date.now()) - Date.now()),
          endsAt: null,
        });
      },
      resume: () => set({ status: 'running', endsAt: Date.now() + get().remainingMs }),
      reset: () => {
        const state = get();
        set({
          phase: 'focus',
          completedRounds: 0,
          status: 'idle',
          endsAt: null,
          remainingMs: durationOf(state, 'focus'),
        });
      },
      advance: () => {
        const state = get();
        const wasFocus = state.phase === 'focus';
        const completedRounds = wasFocus ? state.completedRounds + 1 : state.completedRounds;

        const phase: PomodoroPhase = wasFocus
          ? completedRounds % state.roundsBeforeLongBreak === 0
            ? 'longBreak'
            : 'shortBreak'
          : 'focus';

        const duration = durationOf(state, phase);

        set({
          phase,
          completedRounds: phase === 'focus' && completedRounds >= state.roundsBeforeLongBreak
            ? 0
            : completedRounds,
          status: state.status === 'running' ? 'running' : 'idle',
          endsAt: state.status === 'running' ? Date.now() + duration : null,
          remainingMs: duration,
        });
      },
    }),
    {
      name: 'oidalarma:pomodoro',
      storage: persistedStorage,
      partialize: (state) => ({
        focusMinutes: state.focusMinutes,
        shortBreakMinutes: state.shortBreakMinutes,
        longBreakMinutes: state.longBreakMinutes,
        roundsBeforeLongBreak: state.roundsBeforeLongBreak,
      }),
    },
  ),
);
