import { useEffect } from 'react';
import { View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ThemedText } from '@/components/ui/ThemedText';
import { Toggle } from '@/components/ui/Toggle';
import { useNow } from '@/hooks/use-now';
import { useMainStore } from '@/modules/configs/stores/main';
import { formatLongDate, splitTime } from '@/utils/time';

import { formatTemperature, useWeatherStore } from '../stores/weather';
import { clockStyles as styles } from '../styles/Clock.styles';

export type ClockProps = {
  onPress?: () => void;
  /** Oculta los switches cuando el reloj se usa como cabecera de otra screen. */
  showControls?: boolean;
};

/**
 * Card principal: hora grande a la izquierda, temperatura y ajustes a la derecha.
 */
export function Clock({ onPress, showControls = true }: ClockProps) {
  const now = useNow(1000);
  const timeFormat = useMainStore((state) => state.timeFormat);
  const temperatureUnit = useMainStore((state) => state.temperatureUnit);
  const toggleTimeFormat = useMainStore((state) => state.toggleTimeFormat);
  const toggleTemperatureUnit = useMainStore((state) => state.toggleTemperatureUnit);

  const celsius = useWeatherStore((state) => state.celsius);
  const city = useWeatherStore((state) => state.city);
  const fetchWeather = useWeatherStore((state) => state.fetchWeather);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const { hours, minutes, seconds, period } = splitTime(now, timeFormat);

  return (
    <Card onPress={onPress} accessibilityLabel="Abrir reloj" style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.timeRow}>
            <ThemedText style={styles.hours}>
              {hours}:{minutes}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.seconds}>
              {seconds}
            </ThemedText>
            {period ? (
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.period}>
                {period}
              </ThemedText>
            ) : null}
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {formatLongDate(now)}
          </ThemedText>
        </View>

        <View style={styles.right}>
          <View>
            <View style={styles.temperatureRow}>
              <Icon name="temperature" size={18} themeColor="textSecondary" />
              <ThemedText style={styles.temperature}>
                {formatTemperature(celsius, temperatureUnit)}
              </ThemedText>
            </View>
            {city ? (
              <ThemedText type="small" themeColor="textTertiary" style={styles.city}>
                {city}
              </ThemedText>
            ) : null}
          </View>

          {showControls ? (
            <View style={styles.switches}>
              <Toggle
                value={timeFormat === '12h'}
                onValueChange={toggleTimeFormat}
                offLabel="24h"
                onLabel="12h"
                accessibilityLabel="Cambiar formato de hora"
                compact
              />
              <Toggle
                value={temperatureUnit === 'fahrenheit'}
                onValueChange={toggleTemperatureUnit}
                offLabel="°C"
                onLabel="°F"
                accessibilityLabel="Cambiar unidad de temperatura"
                compact
              />
            </View>
          ) : null}
        </View>
      </View>
    </Card>
  );
}
