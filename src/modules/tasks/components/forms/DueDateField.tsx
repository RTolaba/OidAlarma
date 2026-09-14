import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { TextField } from '@/components/ui/TextField';
import { ThemedText } from '@/components/ui/ThemedText';
import { Spacing } from '@/constants/theme';
import { formatDateInDays } from '@/utils/time';

const PRESETS: { label: string; days: number | null }[] = [
  { label: 'Sin límite', days: null },
  { label: '1 semana', days: 7 },
  { label: '1 mes', days: 30 },
  { label: '3 meses', days: 90 },
];

export type DueDateFieldProps = {
  /** Cantidad de dias que dura la tarea. `null` = sin fecha limite. */
  value: number | null;
  onChange: (days: number | null) => void;
};

/**
 * Fecha limite expresada en dias para no depender de un date picker nativo.
 */
export function DueDateField({ value, onChange }: DueDateFieldProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="label" themeColor="textSecondary">
        Hasta cuándo
      </ThemedText>

      <View style={styles.row}>
        {PRESETS.map((preset) => (
          <Chip
            key={preset.label}
            label={preset.label}
            tone="neutral"
            selected={preset.days === value}
            onPress={() => onChange(preset.days)}
          />
        ))}
      </View>

      <TextField
        label="O en cuántos días termina"
        value={value === null ? '' : String(value)}
        onChangeText={(text) => {
          const days = Number(text.replace(/\D/g, ''));
          onChange(Number.isFinite(days) && days > 0 ? days : null);
        }}
        keyboardType="number-pad"
        placeholder="Sin fecha límite"
        hint={value ? `Termina el ${formatDateInDays(value)}` : undefined}
      />
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
