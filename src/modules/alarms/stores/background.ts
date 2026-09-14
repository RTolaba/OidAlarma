import { create } from 'zustand';

type BackgroundAlarmsState = {
  scheduled: boolean | null;
  setScheduled: (scheduled: boolean) => void;
};

export const useBackgroundAlarms = create<BackgroundAlarmsState>((set) => ({
  scheduled: null,
  setScheduled: (scheduled) => set({ scheduled }),
}));
