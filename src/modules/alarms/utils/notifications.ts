import { Platform } from 'react-native';

import type { Alarm } from '../types/alarm';
import {
  canUseNativeLockScreen,
  pullNativeAlarmState,
  subscribeToNativeLockScreen,
  syncNativeLockScreenAlarms,
} from './lockScreen';
import type { NativeAlarmState } from './reconcile';

/** En web el SO no programa alarmas locales. En Expo Go sí se puede, sin el módulo de push. */
export function canUseNativeNotifications() {
  return Platform.OS !== 'web';
}

async function loadNative() {
  if (!canUseNativeNotifications()) return null;

  try {
    return await import('./notificationsImpl');
  } catch {
    return null;
  }
}

export async function syncAlarmNotifications(alarms: Alarm[]) {
  if (canUseNativeLockScreen()) {
    const permissions = await loadNative();
    if (permissions) {
      const allowed = await permissions.requestAlarmPermissions();
      if (!allowed) return false;
    }
    return syncNativeLockScreenAlarms(alarms);
  }

  const native = await loadNative();
  if (!native) return false;
  return native.syncAlarmNotifications(alarms);
}

/** Solo hay estado nativo que reconciliar en el camino del modulo Android. */
export async function pullAlarmState(): Promise<NativeAlarmState | null> {
  if (!canUseNativeLockScreen()) return null;
  return pullNativeAlarmState();
}

export async function subscribeToAlarmNotifications(
  onAlarm: (alarmId: string) => void,
  onHandled?: (event: { alarmId: string; action: 'dismiss' | 'snooze' }) => void,
) {
  if (canUseNativeLockScreen()) {
    return subscribeToNativeLockScreen(onAlarm, onHandled ?? (() => {}));
  }

  const native = await loadNative();
  if (!native) return () => {};
  return native.subscribeToAlarmNotifications(onAlarm);
}
