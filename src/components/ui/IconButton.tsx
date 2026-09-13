import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Icon, type IconName } from './Icon';

export type IconButtonProps = {
  name: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  size?: number;
  variant?: 'plain' | 'soft' | 'solid';
  active?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  name,
  onPress,
  accessibilityLabel,
  size = 20,
  variant = 'plain',
  active = false,
  disabled = false,
  style,
}: IconButtonProps) {
  const theme = useTheme();

  const background = {
    plain: 'transparent',
    soft: active ? theme.accentSoft : theme.backgroundSelected,
    solid: active ? theme.accent : theme.backgroundElement,
  }[variant];

  const tint =
    variant === 'solid' && active ? theme.accentText : active ? theme.accent : theme.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: background, width: size * 2, height: size * 2 },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <Icon name={name} size={size} color={tint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
