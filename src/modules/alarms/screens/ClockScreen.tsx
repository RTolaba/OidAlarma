import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Divider } from '@/components/ui/Divider';
import { Icon } from '@/components/ui/Icon';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';
import { Toggle } from '@/components/ui/Toggle';
import { Spacing } from '@/constants/theme';
import { useNow } from '@/hooks/use-now';
import { NIGHT_END_HOUR, NIGHT_START_HOUR } from '@/hooks/use-theme';
import { useMainStore } from '@/modules/configs/stores/main';
import { formatLongDate, splitTime } from '@/utils/time';

import { formatTemperature, useWeatherStore } from '../stores/weather';

export function ClockScreen() {
  const now = useNow(1000);
  const timeFormat = useMainStore((state) => state.timeFormat);
  const temperatureUnit = useMainStore((state) => state.temperatureUnit);
  const showSeconds = useMainStore((state) => state.showSeconds);
  const toggleTimeFormat = useMainStore((state) => state.toggleTimeFormat);
  const toggleTemperatureUnit = useMainStore((state) => state.toggleTemperatureUnit);
  const setShowSeconds = useMainStore((state) => state.setShowSeconds);
  const appearance = useMainStore((state) => state.appearance);
  const setAppearance = useMainStore((state) => state.setAppearance);

  const celsius = useWeatherStore((state) => state.celsius);
  const city = useWeatherStore((state) => state.city);
  const status = useWeatherStore((state) => state.status);
  const fetchWeather = useWeatherStore((state) => state.fetchWeather);

  useEffect(() => {
    fetchWeather(true);
  }, [fetchWeather]);

  const { hours, minutes, seconds, period } = splitTime(now, timeFormat);

  return (
    <ScreenContainer scroll edges={[]}>
      <View style={styles.hero}>
        <ThemedText type="display" style={styles.time}>
          {hours}:{minutes}
          {showSeconds ? `:${seconds}` : ''}
        </ThemedText>
        {period ? (
          <ThemedText type="section" themeColor="textSecondary">
            {period}
          </ThemedText>
        ) : null}
        <ThemedText type="default" themeColor="textSecondary">
          {formatLongDate(now)}
        </ThemedText>
      </View>

      <Card>
        <View style={styles.weatherRow}>
          <Icon name="temperature" size={22} themeColor="textSecondary" />
          <View style={styles.weatherTexts}>
            <ThemedText type="section">{formatTemperature(celsius, temperatureUnit)}</ThemedText>
            <ThemedText type="small" themeColor="textTertiary">
              {status === 'error'
                ? 'No se pudo obtener el clima'
                : (city ?? 'Ubicación aproximada por IP')}
            </ThemedText>
          </View>
        </View>
      </Card>

      <Card>
        <View style={styles.settings}>
          <View style={styles.settingRow}>
            <ThemedText type="default">Formato de hora</ThemedText>
            <Toggle
              value={timeFormat === '12h'}
              onValueChange={toggleTimeFormat}
              offLabel="24h"
              onLabel="12h"
              accessibilityLabel="Cambiar formato de hora"
            />
          </View>
          <Divider />
          <View style={styles.settingRow}>
            <ThemedText type="default">Unidad de temperatura</ThemedText>
            <Toggle
              value={temperatureUnit === 'fahrenheit'}
              onValueChange={toggleTemperatureUnit}
              offLabel="°C"
              onLabel="°F"
              accessibilityLabel="Cambiar unidad de temperatura"
            />
          </View>
          <Divider />
          <View style={styles.settingRow}>
            <ThemedText type="default">Mostrar segundos</ThemedText>
            <Toggle
              value={showSeconds}
              onValueChange={setShowSeconds}
              accessibilityLabel="Mostrar segundos"
            />
          </View>
          <Divider />
          <View style={styles.appearance}>
            <ThemedText type="default">Apariencia</ThemedText>
            <ThemedText type="small" themeColor="textTertiary">
              Auto usa oscuro de {NIGHT_START_HOUR}:00 a {NIGHT_END_HOUR}:00 según la hora del
              celular.
            </ThemedText>
            <View style={styles.appearanceRow}>
              {(
                [
                  { id: 'auto', label: 'Auto', icon: 'appearance' },
                  { id: 'light', label: 'Claro', icon: 'sun' },
                  { id: 'dark', label: 'Oscuro', icon: 'moon' },
                ] as const
              ).map((option) => (
                <Chip
                  key={option.id}
                  label={option.label}
                  icon={option.icon}
                  tone="secondary"
                  selected={appearance === option.id}
                  onPress={() => setAppearance(option.id)}
                />
              ))}
            </View>
          </View>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.five,
  },
  time: {
    fontVariant: ['tabular-nums'],
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  weatherTexts: {
    gap: Spacing.half,
  },
  settings: {
    gap: Spacing.three,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  appearance: {
    gap: Spacing.two,
  },
  appearanceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one + 2,
  },
});
