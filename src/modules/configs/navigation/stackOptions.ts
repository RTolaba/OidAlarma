import { Stack } from 'expo-router';
import type { ComponentProps } from 'react';

import { useTheme } from '@/hooks/use-theme';

type StackScreenOptions = ComponentProps<typeof Stack>['screenOptions'];

/**
 * Opciones comunes de los stacks de cada tab.
 */
export function useStackScreenOptions(): StackScreenOptions {
  const theme = useTheme();

  return {
    headerShown: false,
    headerTintColor: theme.text,
    headerStyle: { backgroundColor: theme.background },
    headerTitleStyle: { color: theme.text },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: theme.background },
  };
}
