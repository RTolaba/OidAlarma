import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Vibration,
  View,
} from 'react-native';
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
import { activateNativeLockScreen, dismissNativeLockScreen } from '../utils/lockScreen';
import { resolveRingtone } from '../utils/ringtones';
import { MathChallenge } from './MathChallenge';

const VIBRATION_PATTERN = [0, 600, 400, 600];
const KEEP_AWAKE_TAG = 'oidalarma-alarm';

const minuteKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;

/**
 * Overlay a pantalla completa cuando suena una alarma. En Android nativo el
 * full-screen intent también la levanta con el celular bloqueado.
 */
export function AlarmRingOverlay() {
  const theme = useTheme();
  const now = useNow(1000);
  const timeFormat = useMainStore((state) => state.timeFormat);

  const alarms = useAlarmsStore((state) => state.alarms);
  const ringingId = useAlarmsStore((state) => state.ringingId);
  const ring = useAlarmsStore((state) => state.ring);
  const dismiss = useAlarmsStore((state) => state.dismiss);

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

    activateNativeLockScreen();
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

  const handleDismiss = () => {
    void dismissNativeLockScreen();
    dismiss();
  };

  if (!alarm) return null;

  return (
    <Modal
      visible
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent
      navigationBarTranslucent
      hardwareAccelerated
      onRequestClose={() => {}}>
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top', 'bottom', 'left', 'right']}>
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

            {alarm.smart ? (
              <MathChallenge onSolved={handleDismiss} />
            ) : (
              <Button
                label="Apagar alarma"
                icon="alarmOff"
                size="large"
                fullWidth
                onPress={handleDismiss}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
});
