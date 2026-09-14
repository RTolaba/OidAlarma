import { ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/hooks/use-theme';
import { formatStopwatch } from '@/utils/time';

import type { Lap } from '../stores/stopwatch';
import { functionsStyles as styles } from '../styles/Functions.styles';

export type LapsListProps = {
  laps: Lap[];
};

export function LapsList({ laps }: LapsListProps) {
  const theme = useTheme();

  if (laps.length === 0) return null;

  return (
    <ScrollView style={styles.laps} showsVerticalScrollIndicator={false}>
      {laps.map((lap, position) => (
        <View
          key={lap.index}
          style={[
            styles.lapRow,
            { backgroundColor: position % 2 === 0 ? theme.backgroundSelected : 'transparent' },
          ]}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Vuelta {lap.index}
          </ThemedText>
          <ThemedText type="small" themeColor="textTertiary">
            +{formatStopwatch(lap.splitMs)}
          </ThemedText>
          <ThemedText type="smallBold">{formatStopwatch(lap.totalMs)}</ThemedText>
        </View>
      ))}
    </ScrollView>
  );
}
