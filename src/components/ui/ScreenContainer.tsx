import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { BottomTabInset, Layout, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ScreenContainerProps = {
  children: ReactNode;
  /** Envuelve el contenido en un ScrollView vertical. */
  scroll?: boolean;
  /** Reserva espacio inferior para la tab bar nativa. */
  withTabInset?: boolean;
  edges?: readonly Edge[];
  gap?: number;
  contentStyle?: ViewStyle;
};

/**
 * Container base de todas las screens: safe area + margen horizontal comun.
 */
export function ScreenContainer({
  children,
  scroll = false,
  withTabInset = true,
  edges = ['top'],
  gap = Spacing.three,
  contentStyle,
}: ScreenContainerProps) {
  const theme = useTheme();
  const paddingBottom = withTabInset ? BottomTabInset + Spacing.three : Spacing.three;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={edges}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, { gap, paddingBottom }, contentStyle]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.content, { gap, paddingBottom }, contentStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
});
