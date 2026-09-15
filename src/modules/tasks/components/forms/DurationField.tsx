import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { ThemedText } from '@/components/ui/ThemedText';
import { Spacing } from '@/constants/theme';
import { formatMinutes } from '@/utils/time';

const PRESETS = [15, 30, 45, 60, 90, 120];

export type DurationFieldProps = {
  value: number | null;
  onChange: (minutes: number | null) => void;
};

export function DurationField({ value, onChange }: DurationFieldProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="label" themeColor="textSecondary">
        Duración
      </ThemedText>

      <View style={styles.row}>
        <Chip
          label="Sin estimar"
          tone="neutral"
          selected={value === null}
          onPress={() => onChange(null)}
        />
        {PRESETS.map((minutes) => (
          <Chip
            key={minutes}
            label={formatMinutes(minutes)}
            selected={value === minutes}
            onPress={() => onChange(minutes)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one + 2,
  },
});
