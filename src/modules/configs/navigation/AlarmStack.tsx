import { Stack } from 'expo-router';

import { useStackScreenOptions } from './stackOptions';

export function AlarmStack() {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" />
      <Stack.Screen name="clock" options={{ headerShown: true, title: 'Reloj' }} />
    </Stack>
  );
}
