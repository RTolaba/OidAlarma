import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ThemedText } from '@/components/ui/ThemedText';
import { Routes } from '@/modules/configs/navigation/routes';

import { PHASE_LABELS, usePomodoroStore } from '../stores/pomodoro';
import { advancedStyles as styles } from '../styles/Advanced.styles';

export function PomodoroSection() {
  const phase = usePomodoroStore((state) => state.phase);
  const status = usePomodoroStore((state) => state.status);
  const focusMinutes = usePomodoroStore((state) => state.focusMinutes);
  const shortBreakMinutes = usePomodoroStore((state) => state.shortBreakMinutes);
  const completedRounds = usePomodoroStore((state) => state.completedRounds);

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Pomodoro"
        description="Ciclos de foco y descanso para trabajar sin quemarte."
      />

      <Card>
        <View style={styles.pomodoroRow}>
          <Icon name="pomodoro" size={26} themeColor="accent" />
          <View style={styles.pomodoroTexts}>
            <ThemedText type="smallBold">
              {focusMinutes} min de foco · {shortBreakMinutes} min de pausa
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {status === 'idle'
                ? `${completedRounds} rondas completadas`
                : `${PHASE_LABELS[phase]} en curso`}
            </ThemedText>
          </View>
        </View>
      </Card>

      <Button
        label="Abrir pomodoro"
        icon="play"
        variant="secondary"
        fullWidth
        onPress={() => router.push(Routes.pomodoro)}
      />
    </View>
  );
}
