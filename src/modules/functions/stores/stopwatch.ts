import { create } from 'zustand';

export type StopwatchStatus = 'idle' | 'running' | 'paused';

export type Lap = {
  index: number;
  /** Tiempo total en el momento de la vuelta. */
  totalMs: number;
  /** Tiempo de esta vuelta. */
  splitMs: number;
};

type StopwatchState = {
  status: StopwatchStatus;
  /** Momento del ultimo start/resume. */
  startedAt: number | null;
  /** Tiempo acumulado en pausas anteriores. */
  accumulatedMs: number;
  laps: Lap[];
  start: () => void;
  pause: () => void;
  reset: () => void;
  lap: () => void;
};

const elapsedOf = (state: Pick<StopwatchState, 'status' | 'startedAt' | 'accumulatedMs'>) =>
  state.accumulatedMs + (state.status === 'running' && state.startedAt
    ? Date.now() - state.startedAt
    : 0);

export const useStopwatchStore = create<StopwatchState>()((set, get) => ({
  status: 'idle',
  startedAt: null,
  accumulatedMs: 0,
  laps: [],
  start: () => set({ status: 'running', startedAt: Date.now() }),
  pause: () =>
    set((state) => ({
      status: 'paused',
      accumulatedMs: elapsedOf(state),
      startedAt: null,
    })),
  reset: () => set({ status: 'idle', startedAt: null, accumulatedMs: 0, laps: [] }),
  lap: () => {
    const state = get();
    const totalMs = elapsedOf(state);
    const previous = state.laps[0]?.totalMs ?? 0;

    set({
      laps: [
        { index: state.laps.length + 1, totalMs, splitMs: totalMs - previous },
        ...state.laps,
      ],
    });
  },
}));

/** Tiempo transcurrido para un instante dado. */
export function selectElapsed(state: StopwatchState, now: number) {
  if (state.status === 'running' && state.startedAt) {
    return state.accumulatedMs + (now - state.startedAt);
  }
  return state.accumulatedMs;
}
