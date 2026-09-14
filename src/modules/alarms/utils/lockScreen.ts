import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

import type { Alarm } from '../types/alarm';

type NativeAlarmLockScreen = {
  syncAlarms: (
    alarms: Array<{
      id: string;
      label: string;
      hour: number;
      minute: number;
      days: number[];
      enabled: boolean;
      smart: boolean;
    }>,
  ) => Promise<void>;
  dismiss: () => Promise<void>;
  consumePendingAlarmId: () => string | null;
  canUseFullScreenIntent: () => boolean;
  requestFullScreenIntentSettings: () => Promise<void>;
  activateLockScreen: () => void;
  deactivateLockScreen: () => void;
  addListener: (
    event: 'onAlarm',
    listener: (event: { alarmId: string }) => void,
  ) => { remove: () => void };
};

const native = requireOptionalNativeModule<NativeAlarmLockScreen>('AlarmLockScreen');

let askedFullScreen = false;

export function canUseNativeLockScreen() {
  return Platform.OS === 'android' && native != null;
}

export async function syncNativeLockScreenAlarms(alarms: Alarm[]) {
  if (!native) return false;
  await native.syncAlarms(
    alarms.map((alarm) => ({
      id: alarm.id,
      label: alarm.label,
      hour: alarm.hour,
      minute: alarm.minute,
      days: alarm.days,
      enabled: alarm.enabled,
      smart: alarm.smart,
    })),
  );
  if (!askedFullScreen && !native.canUseFullScreenIntent()) {
    askedFullScreen = true;
    await native.requestFullScreenIntentSettings();
  }
  return true;
}

export function subscribeToNativeLockScreen(onAlarm: (alarmId: string) => void) {
  if (!native) return () => {};

  const pending = native.consumePendingAlarmId();
  if (pending) onAlarm(pending);

  const subscription = native.addListener('onAlarm', (event) => {
    if (event.alarmId) onAlarm(event.alarmId);
  });

  return () => subscription.remove();
}

export async function dismissNativeLockScreen() {
  if (!native) return;
  native.deactivateLockScreen();
  await native.dismiss();
}

export function activateNativeLockScreen() {
  native?.activateLockScreen();
}
