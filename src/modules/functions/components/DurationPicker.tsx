import { View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText';
import { WheelPicker } from '@/components/ui/WheelPicker';

import { functionsStyles as styles } from '../styles/Functions.styles';

const range = (length: number) => Array.from({ length }, (_, index) => index);

const HOURS = range(24);
const MINUTES_SECONDS = range(60);

export type DurationPickerProps = {
  valueMs: number;
  onChange: (ms: number) => void;
};

export function DurationPicker({ valueMs, onChange }: DurationPickerProps) {
  const totalSeconds = Math.floor(valueMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const emit = (nextHours: number, nextMinutes: number, nextSeconds: number) => {
    onChange((nextHours * 3600 + nextMinutes * 60 + nextSeconds) * 1000);
  };

  return (
    <View style={styles.wheels}>
      <WheelPicker
        values={HOURS}
        value={hours}
        onChange={(value) => emit(value, minutes, seconds)}
        label="Horas"
        accessibilityLabel="Seleccionar horas"
      />
      <ThemedText type="subtitle" themeColor="textTertiary">
        :
      </ThemedText>
      <WheelPicker
        values={MINUTES_SECONDS}
        value={minutes}
        onChange={(value) => emit(hours, value, seconds)}
        label="Minutos"
        accessibilityLabel="Seleccionar minutos"
      />
      <ThemedText type="subtitle" themeColor="textTertiary">
        :
      </ThemedText>
      <WheelPicker
        values={MINUTES_SECONDS}
        value={seconds}
        onChange={(value) => emit(hours, minutes, value)}
        label="Segundos"
        accessibilityLabel="Seleccionar segundos"
      />
    </View>
  );
}
