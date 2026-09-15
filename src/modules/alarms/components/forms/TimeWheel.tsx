import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { ThemedText } from '@/components/ui/ThemedText';
import { WheelPicker } from '@/components/ui/WheelPicker';
import { Spacing } from '@/constants/theme';
import { useMainStore } from '@/modules/configs/stores/main';
import { to12Hour, to24Hour } from '@/utils/time';

const range = (length: number, from = 0) => Array.from({ length }, (_, index) => index + from);

const HOURS_24 = range(24);
const HOURS_12 = range(12, 1);
const MINUTES = range(60);

export type TimeWheelProps = {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
};

/**
 * Selector de hora que respeta el formato configurado en la app.
 */
export function TimeWheel({ hour, minute, onChange }: TimeWheelProps) {
  const timeFormat = useMainStore((state) => state.timeFormat);
  const is12h = timeFormat === '12h';
  const { hour: hour12, period } = to12Hour(hour);

  const handleHourChange = (value: number) => {
    onChange(is12h ? to24Hour(value, period as 'AM' | 'PM') : value, minute);
  };

  const handlePeriodChange = (next: 'AM' | 'PM') => {
    onChange(to24Hour(hour12, next), minute);
  };

  return (
    <View style={styles.container}>
      <WheelPicker
        key={is12h ? 'hours-12' : 'hours-24'}
        values={is12h ? HOURS_12 : HOURS_24}
        value={is12h ? hour12 : hour}
        onChange={handleHourChange}
        label="Hora"
        loop
        accessibilityLabel="Seleccionar hora"
      />
      <ThemedText type="subtitle" themeColor="textTertiary" style={styles.separator}>
        :
      </ThemedText>
      <WheelPicker
        values={MINUTES}
        value={minute}
        onChange={(value) => onChange(hour, value)}
        label="Minutos"
        loop
        accessibilityLabel="Seleccionar minutos"
      />

      {is12h ? (
        <View style={styles.periods}>
          {(['AM', 'PM'] as const).map((item) => (
            <Chip
              key={item}
              label={item}
              selected={period === item}
              onPress={() => handlePeriodChange(item)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  separator: {
    marginTop: Spacing.three,
  },
  periods: {
    marginLeft: Spacing.two,
    marginTop: Spacing.three,
    gap: Spacing.one + 2,
  },
});
