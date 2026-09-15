import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { useAlarmsStore } from '../stores/alarms';
import { useBackgroundAlarms } from '../stores/background';
import {
  canUseNativeNotifications,
  pullAlarmState,
  subscribeToAlarmNotifications,
  syncAlarmNotifications,
} from '../utils/notifications';

/**
 * Puente entre Zustand y el sistema operativo.
 *
 * El orden importa: primero se adopta lo que decidio el lado nativo
 * mientras la app no existia (un one-shot apagado, un snooze vigente) y
 * recien despues se sincroniza. Al reves, el sync revive alarmas apagadas.
 */
export function AlarmScheduler() {
  const alarms = useAlarmsStore((state) => state.alarms);
  const ring = useAlarmsStore((state) => state.ring);
  const snooze = useAlarmsStore((state) => state.snooze);
  const dismissById = useAlarmsStore((state) => state.dismissById);
  const reconcileWithNative = useAlarmsStore((state) => state.reconcileWithNative);
  const setScheduled = useBackgroundAlarms((state) => state.setScheduled);

  const [hydrated, setHydrated] = useState(() => useAlarmsStore.persist.hasHydrated());
  const [reconciled, setReconciled] = useState(false);

  useEffect(() => {
    if (hydrated) return;
    return useAlarmsStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  const reconcile = useCallback(async () => {
    const native = await pullAlarmState();
    if (native) reconcileWithNative(native);
  }, [reconcileWithNative]);

  useEffect(() => {
    if (!hydrated) return;

    let cancelled = false;
    void reconcile()
      .catch((error) => console.warn('[alarms] no se pudo leer el estado nativo', error))
      .finally(() => {
        if (!cancelled) setReconciled(true);
      });

    return () => {
      cancelled = true;
    };
  }, [hydrated, reconcile]);

  // Volver a la app es la otra oportunidad de enterarse de lo que pasó afuera.
  useEffect(() => {
    if (!reconciled) return;

    const subscription = AppState.addEventListener('change', (status) => {
      if (status !== 'active') return;
      void reconcile().catch(() => {});
    });

    return () => subscription.remove();
  }, [reconciled, reconcile]);

  useEffect(() => {
    if (!hydrated || !reconciled) return;
    if (!canUseNativeNotifications()) {
      setScheduled(false);
      return;
    }

    void syncAlarmNotifications(alarms)
      .then((ok) => setScheduled(Boolean(ok)))
      .catch((error) => {
        console.warn('[alarms] fallo la programacion de alarmas', error);
        setScheduled(false);
      });
  }, [alarms, hydrated, reconciled, setScheduled]);

  useEffect(() => {
    if (!canUseNativeNotifications()) return;

    let unsubscribe = () => {};
    let cancelled = false;

    void subscribeToAlarmNotifications(ring, (event) => {
      if (event.action === 'snooze') snooze();
      else if (event.alarmId) dismissById(event.alarmId);
    }).then((stop) => {
      if (cancelled) {
        stop();
        return;
      }
      unsubscribe = stop;
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [ring, snooze, dismissById]);

  return null;
}
