import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useResolvedColorScheme, useTheme } from '@/hooks/use-theme';

export function AppProviders({ children }: { children: ReactNode }) {
  const scheme = useResolvedColorScheme();
  const theme = useTheme();
  const navigationTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider
          value={{
            ...navigationTheme,
            colors: {
              ...navigationTheme.colors,
              primary: theme.secondary,
              background: theme.background,
              card: theme.background,
              text: theme.text,
              border: theme.border,
              notification: theme.secondary,
            },
          }}>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          {children}
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
