import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useTheme } from '@/hooks/use-theme';

import { TabRoutes } from './routes';

/**
 * Navegacion maestra: 4 tabs, cada uno con su propio stack.
 */
export function TabBar() {
  const theme = useTheme();

  return (
    <NativeTabs
      backgroundColor={theme.background}
      indicatorColor={theme.backgroundElement}
      tintColor={theme.secondary}
      labelStyle={{ color: theme.textSecondary, selected: { color: theme.text } }}>
      <NativeTabs.Trigger name={TabRoutes.alarms}>
        <NativeTabs.Trigger.Label>Alarmas</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="alarm.fill" md="alarm" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name={TabRoutes.tasks}>
        <NativeTabs.Trigger.Label>Tareas</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="checklist" md="checklist" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name={TabRoutes.functions}>
        <NativeTabs.Trigger.Label>Funciones</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="timer" md="timer" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name={TabRoutes.advanced}>
        <NativeTabs.Trigger.Label>Avanzado</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="wand.and.stars" md="auto_awesome" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
