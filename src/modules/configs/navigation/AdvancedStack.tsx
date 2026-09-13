import { Stack } from 'expo-router';

import { useStackScreenOptions } from './stackOptions';

export function AdvancedStack() {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="advanced/index" />
      <Stack.Screen name="advanced/pomodoro" options={{ headerShown: true, title: 'Pomodoro' }} />
    </Stack>
  );
}
