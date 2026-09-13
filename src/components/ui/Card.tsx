import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  bordered?: boolean;
  accessibilityLabel?: string;
};

export function Card({
  children,
  onPress,
  onLongPress,
  style,
  padded = true,
  bordered = true,
  accessibilityLabel,
}: CardProps) {
  const theme = useTheme();

  const baseStyle: StyleProp<ViewStyle> = [
    styles.card,
    padded && styles.padded,
    {
      backgroundColor: theme.backgroundElement,
      borderColor: bordered ? theme.border : 'transparent',
    },
    style,
  ];

  if (!onPress && !onLongPress) {
    return <View style={baseStyle}>{children}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [baseStyle, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.large,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  padded: {
    padding: Spacing.three,
  },
  pressed: {
    opacity: 0.85,
  },
});
