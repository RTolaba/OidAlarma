import { StyleSheet, Switch, View, type StyleProp, type ViewStyle } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './ThemedText';

export type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** Texto mostrado cuando `value` es false. */
  offLabel?: string;
  /** Texto mostrado cuando `value` es true. */
  onLabel?: string;
  accessibilityLabel: string;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Switch con la etiqueta del estado activo al lado (ej. 24h / 12h, °C / °F).
 */
export function Toggle({
  value,
  onValueChange,
  offLabel,
  onLabel,
  accessibilityLabel,
  compact = false,
  style,
}: ToggleProps) {
  const theme = useTheme();
  const label = value ? onLabel : offLabel;

  return (
    <View style={[styles.row, style]}>
      {label ? (
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.label}>
          {label}
        </ThemedText>
      ) : null}
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={accessibilityLabel}
        trackColor={{ false: theme.backgroundSelected, true: theme.accent }}
        thumbColor={theme.backgroundElement}
        ios_backgroundColor={theme.backgroundSelected}
        style={compact ? styles.compact : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  label: {
    minWidth: 32,
    textAlign: 'right',
  },
  compact: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});
