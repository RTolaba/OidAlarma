import { requireOptionalNativeModule } from 'expo';
import { Platform } from 'react-native';

import type { Alarm } from '../types/alarm';
import type { NativeAlarmState } from './reconcile';
import { resolveRingtone } from './ringtones';

/** Lo que cruza el puente hacia Kotlin, sin campos derivados de JS. */
type NativeAlarmPayload = {
  id: string;
  label: string;
  hour: number;
  minute: number;
  days: number[];
  enabled: boolean;
  smart: boolean;
  ringtone: string;
};

type NativeAlarmLockScreen = {
  syncAlarms: (alarms: NativeAlarmPayload[]) => Promise<void>;
  pullNativeState: () => Promise<NativeAlarmState>;
  presentPendingAlarm: () => void;
  canUseFullScreenIntent: () => boolean;
  requestFullScreenIntentSettings: () => Promise<void>;
  addListener: (
    event: 'onAlarm' | 'onAlarmHandled',
    listener: (event: { alarmId: string; action?: string }) => void,
  ) => { remove: () => void };
};

const native = requireOptionalNativeModule<NativeAlarmLockScreen>('AlarmLockScreen');

/**
 * Android 14+ exige un permiso aparte para la pantalla completa. Se pide una
 * sola vez por sesion: mandar al usuario a Ajustes en cada sync es spam.
 */
let askedForFullScreenIntent = false;

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
      ringtone: resolveRingtone(alarm.ringtone).id,
    })),
  );

  if (!askedForFullScreenIntent && !native.canUseFullScreenIntent()) {
    askedForFullScreenIntent = true;
    await native.requestFullScreenIntentSettings();
  }

  return true;
}

/** Estado real del lado nativo, para reconciliar antes de sincronizar. */
export async function pullNativeAlarmState(): Promise<NativeAlarmState | null> {
  if (!native) return null;
  return native.pullNativeState();
}

export function subscribeToNativeLockScreen(
  onAlarm: (alarmId: string) => void,
  onHandled: (event: { alarmId: string; action: 'dismiss' | 'snooze' }) => void,
) {
  if (!native) return () => {};

  native.presentPendingAlarm();

  const alarmSub = native.addListener('onAlarm', (event) => {
    if (event.alarmId) onAlarm(event.alarmId);
  });
  const handledSub = native.addListener('onAlarmHandled', (event) => {
    if (event.action === 'snooze' || event.action === 'dismiss') {
      onHandled({ alarmId: event.alarmId, action: event.action });
    }
  });

  return () => {
    alarmSub.remove();
    handledSub.remove();
  };
}
