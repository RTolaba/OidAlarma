import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistedStorage } from '@/modules/configs/stores/storage';
import { createId } from '@/utils/id';

import type { Alarm, AlarmDraft } from '../types/alarm';
import { reconcileAlarms, type NativeAlarmState } from '../utils/reconcile';
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
  /** Cierra el overlay sin apagar ni cambiar la alarma. */
  snooze: () => void;
  /** Apaga una alarma concreta (p. ej. desde la activity nativa). */
  dismissById: (id: string) => void;
  /** Adopta lo que decidio el lado nativo mientras JS no estaba vivo. */
  reconcileWithNative: (native: NativeAlarmState, now?: number) => void;
};

const byTime = (a: Alarm, b: Alarm) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute);

const normalize = (alarm: Alarm): Alarm => ({
  ...alarm,
  ringtone: resolveRingtone(alarm.ringtone).id,
});

/** Una alarma sin repeticion se apaga sola cuando suena y se descarta. */
const disableIfOneShot = (alarms: Alarm[], id: string | null) => {
  const alarm = alarms.find((item) => item.id === id);
  if (!alarm || alarm.days.length > 0) return alarms;
  return alarms.map((item) => (item.id === alarm.id ? { ...item, enabled: false } : item));
};

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
        set((state) => ({
          alarms: disableIfOneShot(state.alarms, state.ringingId),
          ringingId: null,
        })),
      snooze: () => set({ ringingId: null }),
      dismissById: (id) =>
        set((state) => ({
          alarms: disableIfOneShot(state.alarms, id),
          ringingId: state.ringingId === id ? null : state.ringingId,
        })),
      reconcileWithNative: (native, now) =>
        set((state) => {
          const alarms = reconcileAlarms(state.alarms, native, now);
          return alarms === state.alarms ? state : { alarms };
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
