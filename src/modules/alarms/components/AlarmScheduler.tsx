import { useEffect, useState } from 'react';

import { useAlarmsStore } from '../stores/alarms';
import { useBackgroundAlarms } from '../stores/background';
import { canUseNativeNotifications, subscribeToAlarmNotifications, syncAlarmNotifications } from '../utils/notifications';

/**
 * Programa notificaciones locales del sistema para sonar con la app
 * en segundo plano o el celular bloqueado.
 */
export function AlarmScheduler() {
  const alarms = useAlarmsStore((state) => state.alarms);
  const ring = useAlarmsStore((state) => state.ring);
  const setScheduled = useBackgroundAlarms((state) => state.setScheduled);
  const [hydrated, setHydrated] = useState(() => useAlarmsStore.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) return;
    return useAlarmsStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || !canUseNativeNotifications()) {
      if (hydrated) setScheduled(false);
      return;
    }
    void syncAlarmNotifications(alarms).then((ok) => setScheduled(Boolean(ok)));
  }, [alarms, hydrated, setScheduled]);

  useEffect(() => {
    if (!canUseNativeNotifications()) return;

    let unsubscribe = () => {};
    let cancelled = false;

    void subscribeToAlarmNotifications(ring).then((stop) => {
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
  }, [ring]);

  return null;
}
