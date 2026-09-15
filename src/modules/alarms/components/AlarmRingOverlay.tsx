import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ThemedText } from '@/components/ui/ThemedText';
import { Spacing } from '@/constants/theme';
import { useNow } from '@/hooks/use-now';
import { useTheme } from '@/hooks/use-theme';
import { useMainStore } from '@/modules/configs/stores/main';
import { formatHourMinute, type WeekDay } from '@/utils/time';

import { useAlarmsStore } from '../stores/alarms';
import { SNOOZE_MINUTES } from '../utils/constants';
import { canUseNativeLockScreen } from '../utils/lockScreen';
import { resolveRingtone } from '../utils/ringtones';
import { MathChallenge } from './MathChallenge';

const VIBRATION_PATTERN = [0, 600, 400, 600];
const KEEP_AWAKE_TAG = 'oidalarma-alarm';

const minuteKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;

/**
 * En Android el ring lo dibuja AlarmRingActivity, que funciona con la app
 * muerta. Este overlay es el plan B para las plataformas sin modulo nativo:
 * si existe el nativo, no se monta y no toca audio ni vibracion.
 */
export function AlarmRingOverlay() {
  if (canUseNativeLockScreen()) return null;
  return <JsAlarmRingOverlay />;
}

function JsAlarmRingOverlay() {
  const theme = useTheme();
  const now = useNow(1000);
  const timeFormat = useMainStore((state) => state.timeFormat);

  const alarms = useAlarmsStore((state) => state.alarms);
  const ringingId = useAlarmsStore((state) => state.ringingId);
  const ring = useAlarmsStore((state) => state.ring);
  const dismiss = useAlarmsStore((state) => state.dismiss);
  const snooze = useAlarmsStore((state) => state.snooze);

  const firedRef = useRef<Set<string>>(new Set());
  const playerRef = useRef<AudioPlayer | null>(null);
  const alarm = alarms.find((item) => item.id === ringingId) ?? null;
  const ringtone = resolveRingtone(alarm?.ringtone);

  useEffect(() => {
    if (ringingId) return;

    const key = minuteKey(now);
    const due = alarms.find(
      (item) =>
        item.enabled &&
        item.hour === now.getHours() &&
        item.minute === now.getMinutes() &&
        (item.days.length === 0 || item.days.includes(now.getDay() as WeekDay)) &&
        !firedRef.current.has(`${item.id}@${key}`),
    );

    if (!due) return;

    firedRef.current.add(`${due.id}@${key}`);
    ring(due.id);
  }, [alarms, now, ring, ringingId]);

  useEffect(() => {
    const current = playerRef.current;
    if (!alarm) {
      current?.pause();
      return;
    }

    let cancelled = false;
    const player = current ?? createAudioPlayer(ringtone.source);
    playerRef.current = player;
    player.replace(ringtone.source);

    void activateKeepAwakeAsync(KEEP_AWAKE_TAG);

    void (async () => {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'doNotMix',
      });
      if (cancelled) return;
      player.loop = true;
      player.play();
    })();

    if (Platform.OS !== 'web') Vibration.vibrate(VIBRATION_PATTERN, true);

    return () => {
      cancelled = true;
      player.pause();
      if (Platform.OS !== 'web') Vibration.cancel();
      void deactivateKeepAwake(KEEP_AWAKE_TAG);
    };
  }, [alarm, ringtone.source]);

  useEffect(() => {
    return () => {
      playerRef.current?.release();
      playerRef.current = null;
    };
  }, []);

  if (!alarm) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: theme.background }]} pointerEvents="auto">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Icon name={alarm.smart ? 'brain' : 'alarm'} size={40} color={theme.secondary} />
              <ThemedText type="display">
                {formatHourMinute(alarm.hour, alarm.minute, timeFormat)}
              </ThemedText>
              <ThemedText type="subtitle" themeColor="textSecondary">
                {alarm.label || 'Alarma'}
              </ThemedText>
            </View>

            {alarm.smart ? <MathChallenge onSolved={dismiss} /> : null}

            <View style={styles.actions}>
              {!alarm.smart ? (
                <Button
                  label="Apagar alarma"
                  icon="alarmOff"
                  size="large"
                  fullWidth
                  onPress={dismiss}
                />
              ) : null}
              <Button
                label={`Aplazar ${SNOOZE_MINUTES} min`}
                icon="clock"
                variant={alarm.smart ? 'primary' : 'secondary'}
                size="large"
                fullWidth
                onPress={snooze}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    elevation: 24,
  },
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.five,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  actions: {
    width: '100%',
    gap: Spacing.three,
  },
});
