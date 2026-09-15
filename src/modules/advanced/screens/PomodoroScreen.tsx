import { useEffect } from 'react';
import { Platform, Vibration, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/hooks/use-theme';
import { useNow } from '@/hooks/use-now';
import { formatDuration } from '@/utils/time';

import { PHASE_LABELS, usePomodoroStore } from '../stores/pomodoro';
import { pomodoroStyles as styles } from '../styles/Advanced.styles';

const PHASE_PATTERN = [0, 400, 200, 400];

const FOCUS_OPTIONS = [15, 25, 45, 50];
const SHORT_BREAK_OPTIONS = [3, 5, 10];
const LONG_BREAK_OPTIONS = [15, 20, 30];
const ROUND_OPTIONS = [2, 3, 4, 5];

export function PomodoroScreen() {
  const theme = useTheme();

  const phase = usePomodoroStore((state) => state.phase);
  const status = usePomodoroStore((state) => state.status);
  const endsAt = usePomodoroStore((state) => state.endsAt);
  const remainingMs = usePomodoroStore((state) => state.remainingMs);
  const completedRounds = usePomodoroStore((state) => state.completedRounds);
  const focusMinutes = usePomodoroStore((state) => state.focusMinutes);
  const shortBreakMinutes = usePomodoroStore((state) => state.shortBreakMinutes);
  const longBreakMinutes = usePomodoroStore((state) => state.longBreakMinutes);
  const roundsBeforeLongBreak = usePomodoroStore((state) => state.roundsBeforeLongBreak);
  const setConfig = usePomodoroStore((state) => state.setConfig);
  const start = usePomodoroStore((state) => state.start);
  const pause = usePomodoroStore((state) => state.pause);
  const resume = usePomodoroStore((state) => state.resume);
  const reset = usePomodoroStore((state) => state.reset);
  const advance = usePomodoroStore((state) => state.advance);

  const now = useNow(status === 'running' ? 250 : 30_000);
  const remaining =
    status === 'running' && endsAt ? Math.max(0, endsAt - now.getTime()) : remainingMs;

  useEffect(() => {
    if (status !== 'running' || remaining > 0) return;

    advance();
    if (Platform.OS !== 'web') Vibration.vibrate(PHASE_PATTERN);
  }, [advance, remaining, status]);

  const configRows = [
    {
      label: 'Foco',
      options: FOCUS_OPTIONS,
      value: focusMinutes,
      apply: (minutes: number) => setConfig({ focusMinutes: minutes }),
    },
    {
      label: 'Descanso corto',
      options: SHORT_BREAK_OPTIONS,
      value: shortBreakMinutes,
      apply: (minutes: number) => setConfig({ shortBreakMinutes: minutes }),
    },
    {
      label: 'Descanso largo',
      options: LONG_BREAK_OPTIONS,
      value: longBreakMinutes,
      apply: (minutes: number) => setConfig({ longBreakMinutes: minutes }),
    },
    {
      label: 'Rondas antes del descanso largo',
      options: ROUND_OPTIONS,
      value: roundsBeforeLongBreak,
      apply: (rounds: number) => setConfig({ roundsBeforeLongBreak: rounds }),
    },
  ];

  return (
    <ScreenContainer scroll edges={[]} withTabInset={false}>
      <Card>
        <View style={styles.hero}>
          <ThemedText type="label" themeColor={phase === 'focus' ? 'accent' : 'success'}>
            {PHASE_LABELS[phase]}
          </ThemedText>
          <ThemedText style={styles.display}>{formatDuration(remaining, true)}</ThemedText>

          <View style={styles.rounds}>
            {Array.from({ length: roundsBeforeLongBreak }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index < completedRounds % roundsBeforeLongBreak ||
                      (completedRounds > 0 && completedRounds % roundsBeforeLongBreak === 0)
                        ? theme.accent
                        : theme.backgroundSelected,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.controls}>
            {status === 'running' ? (
              <IconButton
                name="pause"
                variant="soft"
                size={24}
                accessibilityLabel="Pausar pomodoro"
                onPress={pause}
              />
            ) : (
              <Button
                label={status === 'paused' ? 'Reanudar' : 'Iniciar'}
                icon="play"
                onPress={status === 'paused' ? resume : start}
              />
            )}
            <IconButton
              name="chevronRight"
              variant="soft"
              size={24}
              accessibilityLabel="Saltar a la siguiente fase"
              onPress={advance}
            />
            <IconButton
              name="reset"
              variant="soft"
              size={24}
              accessibilityLabel="Reiniciar pomodoro"
              onPress={reset}
            />
          </View>
        </View>
      </Card>

      <Card>
        <View style={styles.config}>
          {configRows.map((row) => (
            <View key={row.label} style={styles.configRow}>
              <ThemedText type="label" themeColor="textSecondary">
                {row.label}
              </ThemedText>
              <View style={styles.chips}>
                {row.options.map((option) => (
                  <Chip
                    key={option}
                    label={`${option}`}
                    selected={row.value === option}
                    onPress={() => row.apply(option)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </Card>
    </ScreenContainer>
  );
}
