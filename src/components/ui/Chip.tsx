import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Icon, type IconName } from './Icon';
import { ThemedText } from './ThemedText';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  tone?: 'neutral' | 'accent' | 'secondary' | 'success' | 'warning' | 'danger';
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, selected = false, onPress, icon, tone = 'accent', style }: ChipProps) {
  const theme = useTheme();

  const tones = {
    neutral: { background: theme.backgroundSelected, text: theme.text },
    accent: { background: theme.accentSoft, text: theme.accent },
    secondary: { background: theme.secondarySoft, text: theme.secondary },
    success: { background: theme.successSoft, text: theme.success },
    warning: { background: theme.warningSoft, text: theme.warning },
    danger: { background: theme.dangerSoft, text: theme.danger },
  }[tone];

  const background = selected ? tones.background : 'transparent';
  const color = selected ? tones.text : theme.textSecondary;

  const content = (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: background,
          borderColor: selected ? tones.text : theme.border,
        },
        style,
      ]}>
      {icon ? <Icon name={icon} size={14} color={color} /> : null}
      <ThemedText type="smallBold" style={{ color }}>
        {label}
      </ThemedText>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.two + 2,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.7,
  },
});
