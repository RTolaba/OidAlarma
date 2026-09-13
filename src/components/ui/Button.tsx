import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Icon, type IconName } from './Icon';
import { ThemedText } from './ThemedText';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const theme = useTheme();

  const palette = {
    primary: { background: theme.accent, text: theme.accentText, border: theme.secondary },
    secondary: { background: theme.backgroundElement, text: theme.text, border: theme.secondary },
    ghost: { background: 'transparent', text: theme.secondary, border: 'transparent' },
    danger: { background: theme.dangerSoft, text: theme.danger, border: theme.danger },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[size],
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
        },
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      {icon ? <Icon name={icon} size={size === 'small' ? 16 : 20} color={palette.text} /> : null}
      <ThemedText type={size === 'small' ? 'smallBold' : 'default'} style={{ color: palette.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  small: {
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
  },
  medium: {
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.four,
  },
  large: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
});
