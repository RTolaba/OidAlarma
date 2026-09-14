import { Platform } from 'react-native';

import type { Alarm } from '../types/alarm';
import {
  canUseNativeLockScreen,
  subscribeToNativeLockScreen,
  syncNativeLockScreenAlarms,
} from './lockScreen';

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
    try {
      const permissions = await loadNative();
      if (permissions) {
        const allowed = await permissions.requestAlarmPermissions();
        if (!allowed) return false;
      }
      return await syncNativeLockScreenAlarms(alarms);
    } catch {
      return false;
    }
  }

  const native = await loadNative();
  if (!native) return false;
  try {
    return await native.syncAlarmNotifications(alarms);
  } catch {
    return false;
  }
}

export async function subscribeToAlarmNotifications(onAlarm: (alarmId: string) => void) {
  if (canUseNativeLockScreen()) {
    return subscribeToNativeLockScreen(onAlarm);
  }

  const native = await loadNative();
  if (!native) return () => {};
  try {
    return native.subscribeToAlarmNotifications(onAlarm);
  } catch {
    return () => {};
  }
}
