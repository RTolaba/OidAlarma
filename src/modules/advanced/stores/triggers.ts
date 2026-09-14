import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistedStorage } from '@/modules/configs/stores/storage';
import { createId } from '@/utils/id';

import type { Trigger, TriggerDraft, TriggerKind } from '../types/trigger';

type TriggersState = {
  triggers: Trigger[];
  /** Disparador que acaba de saltar y todavia no se confirmo (no se persiste). */
  firedId: string | null;
  addTrigger: (draft: TriggerDraft) => void;
  toggleTrigger: (id: string) => void;
  removeTrigger: (id: string) => void;
  fireByKind: (kind: TriggerKind) => void;
  acknowledge: () => void;
};

export const useTriggersStore = create<TriggersState>()(
  persist(
    (set) => ({
      triggers: [],
      firedId: null,
      addTrigger: (draft) =>
        set((state) => ({
          triggers: [
            ...state.triggers,
            { ...draft, id: createId('trigger'), enabled: true, lastFiredAt: null, createdAt: Date.now() },
          ],
        })),
      toggleTrigger: (id) =>
        set((state) => ({
          triggers: state.triggers.map((trigger) =>
            trigger.id === id ? { ...trigger, enabled: !trigger.enabled } : trigger,
          ),
        })),
      removeTrigger: (id) =>
        set((state) => ({
          triggers: state.triggers.filter((trigger) => trigger.id !== id),
          firedId: state.firedId === id ? null : state.firedId,
        })),
      fireByKind: (kind) =>
        set((state) => {
          const target = state.triggers.find(
            (trigger) => trigger.enabled && trigger.kind === kind,
          );
          if (!target) return state;

          return {
            firedId: target.id,
            triggers: state.triggers.map((trigger) =>
              trigger.id === target.id ? { ...trigger, lastFiredAt: Date.now() } : trigger,
            ),
          };
        }),
      acknowledge: () => set({ firedId: null }),
    }),
    {
      name: 'oidalarma:triggers',
      storage: persistedStorage,
      partialize: (state) => ({ triggers: state.triggers }),
    },
  ),
);
