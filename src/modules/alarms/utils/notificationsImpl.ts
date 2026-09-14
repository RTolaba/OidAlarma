import { AppState, Platform } from 'react-native';
import { cancelAllScheduledNotificationsAsync } from 'expo-notifications/build/cancelAllScheduledNotificationsAsync';
import {
  AndroidAudioContentType,
  AndroidAudioUsage,
  AndroidImportance,
  AndroidNotificationVisibility,
} from 'expo-notifications/build/NotificationChannelManager.types';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { IosAuthorizationStatus } from 'expo-notifications/build/NotificationPermissions.types';
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
} from 'expo-notifications/build/NotificationsEmitter';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import {
  AndroidNotificationPriority,
  SchedulableTriggerInputTypes,
} from 'expo-notifications/build/Notifications.types';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';

import { nextOccurrence, type WeekDay } from '@/utils/time';

import type { Alarm } from '../types/alarm';
import { RINGTONE_IDS, resolveRingtone } from './ringtones';

export const ALARM_CHANNEL_PREFIX = 'oidalarma-alarm';

/**
 * Importa APIs locales por archivo, sin el index de expo-notifications.
 * El index dispara un side-effect de push que en Expo Go Android tira error.
 */
setNotificationHandler({
  handleNotification: async () => {
    const inForeground = AppState.currentState === 'active';
    return {
      shouldPlaySound: !inForeground,
      shouldSetBadge: false,
      shouldShowBanner: !inForeground,
      shouldShowList: true,
      priority: AndroidNotificationPriority.MAX,
    };
  },
});

const weekdayForNotification = (day: WeekDay) => day + 1;

const notificationId = (alarmId: string, key: string) => `alarm:${alarmId}:${key}`;

export function alarmIdFromNotification(notification: {
  request: { content: { data?: Record<string, unknown> } };
}) {
  const data = notification.request.content.data;
  return typeof data?.alarmId === 'string' ? data.alarmId : null;
}

async function ensureChannels() {
  if (Platform.OS !== 'android') return;

  for (const id of RINGTONE_IDS) {
    const ringtone = resolveRingtone(id);
    const base = {
      name: `Alarmas · ${ringtone.label}`,
      importance: AndroidImportance.MAX,
      vibrationPattern: [0, 600, 400, 600],
      enableVibrate: true,
      lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
      audioAttributes: {
        usage: AndroidAudioUsage.ALARM,
        contentType: AndroidAudioContentType.SONIFICATION,
      },
    };

    try {
      await setNotificationChannelAsync(`${ALARM_CHANNEL_PREFIX}-${id}`, {
        ...base,
        sound: ringtone.fileName,
        bypassDnd: true,
      });
    } catch {
      await setNotificationChannelAsync(`${ALARM_CHANNEL_PREFIX}-${id}`, {
        ...base,
        sound: 'default',
        bypassDnd: false,
      });
    }
  }
}

export async function requestAlarmPermissions() {
  await ensureChannels();

  const current = await getPermissionsAsync();
  const status = current.granted
    ? current
    : await requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true },
      });

  return status.granted || status.ios?.status === IosAuthorizationStatus.PROVISIONAL;
}

function contentFor(alarm: Alarm) {
  const ringtone = resolveRingtone(alarm.ringtone);

  return {
    title: alarm.label || 'Alarma',
    body: alarm.smart ? 'Resolvé los ejercicios para apagarla.' : 'Tocá para apagar la alarma.',
    sound: ringtone.fileName,
    interruptionLevel: 'critical' as const,
    priority: 'max',
    sticky: true,
    autoDismiss: false,
    color: '#170D38',
    vibrate: [0, 600, 400, 600],
    data: { kind: 'alarm', alarmId: alarm.id },
  };
}

async function scheduleAlarm(alarm: Alarm) {
  const ringtone = resolveRingtone(alarm.ringtone);
  const channelId = `${ALARM_CHANNEL_PREFIX}-${ringtone.id}`;
  const content = contentFor(alarm);

  if (alarm.days.length === 0) {
    const date = nextOccurrence(alarm.hour, alarm.minute, alarm.days);
    await scheduleNotificationAsync({
      identifier: notificationId(alarm.id, 'once'),
      content,
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date,
        channelId,
      },
    });
    return;
  }

  if (alarm.days.length === 7) {
    await scheduleNotificationAsync({
      identifier: notificationId(alarm.id, 'daily'),
      content,
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour: alarm.hour,
        minute: alarm.minute,
        channelId,
      },
    });
    return;
  }

  await Promise.all(
    alarm.days.map((day) =>
      scheduleNotificationAsync({
        identifier: notificationId(alarm.id, `w${day}`),
        content,
        trigger: {
          type: SchedulableTriggerInputTypes.WEEKLY,
          weekday: weekdayForNotification(day),
          hour: alarm.hour,
          minute: alarm.minute,
          channelId,
        },
      }),
    ),
  );
}

export async function syncAlarmNotifications(alarms: Alarm[]) {
  const allowed = await requestAlarmPermissions();
  await cancelAllScheduledNotificationsAsync();
  if (!allowed) return false;
  await Promise.all(alarms.filter((alarm) => alarm.enabled).map(scheduleAlarm));
  return true;
}

export function subscribeToAlarmNotifications(onAlarm: (alarmId: string) => void) {
  const openFromNotification = (notification: Parameters<typeof alarmIdFromNotification>[0]) => {
    const alarmId = alarmIdFromNotification(notification);
    if (alarmId) onAlarm(alarmId);
  };

  const received = addNotificationReceivedListener(openFromNotification);
  const response = addNotificationResponseReceivedListener((event) => {
    openFromNotification(event.notification);
  });

  void getLastNotificationResponseAsync().then((last) => {
    if (last) openFromNotification(last.notification);
  });

  return () => {
    received.remove();
    response.remove();
  };
}
