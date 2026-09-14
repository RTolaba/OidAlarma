import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useNow } from '@/hooks/use-now';
import { formatStopwatch } from '@/utils/time';

import { useStopwatchStore } from '../stores/stopwatch';
import { functionsStyles as styles } from '../styles/Functions.styles';
import { FunctionPanel } from './FunctionPanel';
import { LapsList } from './LapsList';

export type StopwatchProps = {
  expanded: boolean;
  onToggleExpanded: () => void;
  onExpand: () => void;
};

export function Stopwatch({ expanded, onToggleExpanded, onExpand }: StopwatchProps) {
  const status = useStopwatchStore((state) => state.status);
  const startedAt = useStopwatchStore((state) => state.startedAt);
  const accumulatedMs = useStopwatchStore((state) => state.accumulatedMs);
  const laps = useStopwatchStore((state) => state.laps);
  const start = useStopwatchStore((state) => state.start);
  const pause = useStopwatchStore((state) => state.pause);
  const reset = useStopwatchStore((state) => state.reset);
  const lap = useStopwatchStore((state) => state.lap);

  const now = useNow(status === 'running' ? 60 : 30_000);
  const elapsed =
    status === 'running' && startedAt ? accumulatedMs + (now.getTime() - startedAt) : accumulatedMs;

  const handleStart = () => {
    start();
    onExpand();
  };

  return (
    <FunctionPanel
      title="Cronómetro"
      icon="stopwatch"
      subtitle={laps.length > 0 ? `${laps.length} vueltas` : undefined}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}>
      <ThemedText style={[styles.display, expanded && styles.displayLarge]}>
        {formatStopwatch(elapsed)}
      </ThemedText>

      <View style={styles.controls}>
        {status === 'running' ? (
          <>
            <IconButton
              name="pause"
              variant="soft"
              size={24}
              accessibilityLabel="Pausar cronómetro"
              onPress={pause}
            />
            <IconButton
              name="lap"
              variant="soft"
              size={24}
              accessibilityLabel="Marcar vuelta"
              onPress={lap}
            />
          </>
        ) : (
          <Button
            label={status === 'paused' ? 'Reanudar' : 'Iniciar'}
            icon="play"
            onPress={handleStart}
          />
        )}

        {status !== 'idle' ? (
          <IconButton
            name="reset"
            variant="soft"
            size={24}
            accessibilityLabel="Reiniciar cronómetro"
            onPress={reset}
          />
        ) : null}
      </View>

      {expanded ? <LapsList laps={laps} /> : null}
    </FunctionPanel>
  );
}
