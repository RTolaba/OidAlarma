import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistedStorage } from '@/modules/configs/stores/storage';
import { createId } from '@/utils/id';

import type { Alarm, AlarmDraft } from '../types/alarm';
import { DEFAULT_RINGTONE, resolveRingtone } from '../utils/ringtones';

type AlarmsState = {
  alarms: Alarm[];
  /** Alarma que esta sonando ahora mismo (no se persiste). */
  ringingId: string | null;
  addAlarm: (draft: AlarmDraft) => void;
  updateAlarm: (id: string, changes: Partial<AlarmDraft>) => void;
  toggleAlarm: (id: string) => void;
  removeAlarm: (id: string) => void;
  ring: (id: string) => void;
  dismiss: () => void;
};

const byTime = (a: Alarm, b: Alarm) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute);

const normalize = (alarm: Alarm): Alarm => ({
  ...alarm,
  ringtone: resolveRingtone(alarm.ringtone).id,
});

export const useAlarmsStore = create<AlarmsState>()(
  persist(
    (set) => ({
      alarms: [],
      ringingId: null,
      addAlarm: (draft) =>
        set((state) => ({
          alarms: [
            ...state.alarms,
            {
              ...draft,
              ringtone: draft.ringtone ?? DEFAULT_RINGTONE,
              id: createId('alarm'),
              enabled: true,
              createdAt: Date.now(),
            },
          ].sort(byTime),
        })),
      updateAlarm: (id, changes) =>
        set((state) => ({
          alarms: state.alarms
            .map((alarm) => (alarm.id === id ? { ...alarm, ...changes } : alarm))
            .sort(byTime),
        })),
      toggleAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm,
          ),
        })),
      removeAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.filter((alarm) => alarm.id !== id),
          ringingId: state.ringingId === id ? null : state.ringingId,
        })),
      ring: (id) => set({ ringingId: id }),
      dismiss: () =>
        set((state) => {
          const alarm = state.alarms.find((item) => item.id === state.ringingId);
          const alarms =
            alarm && alarm.days.length === 0
              ? state.alarms.map((item) =>
                  item.id === alarm.id ? { ...item, enabled: false } : item,
                )
              : state.alarms;

          return { alarms, ringingId: null };
        }),
    }),
    {
      name: 'oidalarma:alarms',
      storage: persistedStorage,
      partialize: (state) => ({ alarms: state.alarms }),
      merge: (persisted, current) => {
        const stored = persisted as Partial<AlarmsState> | undefined;
        return {
          ...current,
          ...stored,
          alarms: (stored?.alarms ?? current.alarms).map(normalize),
        };
      },
    },
  ),
);
