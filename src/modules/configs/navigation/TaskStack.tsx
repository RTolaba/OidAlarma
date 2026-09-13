import { Stack } from 'expo-router';

import { useStackScreenOptions } from './stackOptions';

export function TaskStack() {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="tasks/index" />
      <Stack.Screen
        name="tasks/new"
        options={{ headerShown: true, title: 'Nueva tarea', presentation: 'modal' }}
      />
      <Stack.Screen name="tasks/[taskId]" options={{ headerShown: true, title: 'Tarea' }} />
    </Stack>
  );
}
