import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { WEEK_DAYS, WEEKDAYS, WEEKEND, type WeekDay } from '@/utils/time';

import { Chip } from './Chip';
import { ThemedText } from './ThemedText';

const ALL_DAYS: WeekDay[] = [1, 2, 3, 4, 5, 6, 0];

export type WeekDaysPickerProps = {
  value: WeekDay[];
  onChange: (days: WeekDay[]) => void;
  label?: string;
  /** Texto del preset que deja la lista vacia. */
  onceLabel?: string;
};

export function WeekDaysPicker({
  value,
  onChange,
  label = 'Repetir',
  onceLabel = 'Una vez',
}: WeekDaysPickerProps) {
  const presets: { label: string; days: WeekDay[] }[] = [
    { label: onceLabel, days: [] },
    { label: 'Lun a Vie', days: WEEKDAYS },
    { label: 'Fin de semana', days: WEEKEND },
    { label: 'Todos', days: ALL_DAYS },
  ];

  const toggleDay = (day: WeekDay) => {
    onChange(value.includes(day) ? value.filter((item) => item !== day) : [...value, day]);
  };

  const isPresetActive = (days: WeekDay[]) =>
    days.length === value.length && days.every((day) => value.includes(day));

  return (
    <View style={styles.container}>
      <ThemedText type="label" themeColor="textSecondary">
        {label}
      </ThemedText>

      <View style={styles.row}>
        {WEEK_DAYS.map((day) => (
          <Chip
            key={day.value}
            label={day.short}
            selected={value.includes(day.value)}
            onPress={() => toggleDay(day.value)}
          />
        ))}
      </View>

      <View style={styles.row}>
        {presets.map((preset) => (
          <Chip
            key={preset.label}
            label={preset.label}
            tone="neutral"
            selected={isPresetActive(preset.days)}
            onPress={() => onChange(preset.days)}
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
