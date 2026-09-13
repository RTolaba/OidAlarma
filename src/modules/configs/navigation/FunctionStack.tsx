import { Stack } from 'expo-router';

import { useStackScreenOptions } from './stackOptions';

export function FunctionStack() {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="functions" />
    </Stack>
  );
}
