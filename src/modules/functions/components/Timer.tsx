import { useEffect } from 'react';
import { Platform, Vibration, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useNow } from '@/hooks/use-now';
import { formatDuration } from '@/utils/time';

import { useTimerStore } from '../stores/timer';
import { functionsStyles as styles } from '../styles/Functions.styles';
import { DurationPicker } from './DurationPicker';
import { FunctionPanel } from './FunctionPanel';

const FINISH_PATTERN = [0, 500, 300, 500];

export type TimerProps = {
  expanded: boolean;
  onToggleExpanded: () => void;
  onExpand: () => void;
};

export function Timer({ expanded, onToggleExpanded, onExpand }: TimerProps) {
  const durationMs = useTimerStore((state) => state.durationMs);
  const status = useTimerStore((state) => state.status);
  const endsAt = useTimerStore((state) => state.endsAt);
  const remainingMs = useTimerStore((state) => state.remainingMs);
  const setDuration = useTimerStore((state) => state.setDuration);
  const start = useTimerStore((state) => state.start);
  const pause = useTimerStore((state) => state.pause);
  const resume = useTimerStore((state) => state.resume);
  const reset = useTimerStore((state) => state.reset);
  const finish = useTimerStore((state) => state.finish);

  const now = useNow(status === 'running' ? 250 : 30_000);
  const remaining =
    status === 'running' && endsAt ? Math.max(0, endsAt - now.getTime()) : remainingMs;

  useEffect(() => {
    if (status !== 'running' || remaining > 0) return;

    finish();
    if (Platform.OS !== 'web') Vibration.vibrate(FINISH_PATTERN);
  }, [finish, remaining, status]);

  const handleStart = () => {
    start();
    onExpand();
  };

  const isConfiguring = status === 'idle' && expanded;

  return (
    <FunctionPanel
      title="Temporizador"
      icon="hourglass"
      subtitle={status === 'finished' ? '¡Terminó!' : undefined}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}>
      {isConfiguring ? (
        <DurationPicker valueMs={durationMs} onChange={setDuration} />
      ) : (
        <ThemedText style={[styles.display, expanded && styles.displayLarge]}>
          {formatDuration(status === 'idle' ? durationMs : remaining, true)}
        </ThemedText>
      )}

      <View style={styles.controls}>
        {status === 'idle' ? (
          <>
            <Button label="Iniciar" icon="play" onPress={handleStart} />
            {expanded ? null : (
              <Button label="Configurar" variant="ghost" onPress={onExpand} />
            )}
          </>
        ) : null}

        {status === 'running' ? (
          <>
            <IconButton
              name="pause"
              variant="soft"
              size={24}
              accessibilityLabel="Pausar temporizador"
              onPress={pause}
            />
            <IconButton
              name="reset"
              variant="soft"
              size={24}
              accessibilityLabel="Reiniciar temporizador"
              onPress={reset}
            />
          </>
        ) : null}

        {status === 'paused' ? (
          <>
            <IconButton
              name="play"
              variant="solid"
              active
              size={24}
              accessibilityLabel="Reanudar temporizador"
              onPress={resume}
            />
            <IconButton
              name="reset"
              variant="soft"
              size={24}
              accessibilityLabel="Reiniciar temporizador"
              onPress={reset}
            />
          </>
        ) : null}

        {status === 'finished' ? (
          <Button label="Reiniciar" icon="reset" onPress={reset} />
        ) : null}
      </View>
    </FunctionPanel>
  );
}
