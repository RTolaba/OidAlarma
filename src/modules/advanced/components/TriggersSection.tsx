import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';

import { useTriggersStore } from '../stores/triggers';
import { advancedStyles as styles } from '../styles/Advanced.styles';
import { NewTriggerPopUp } from './forms/NewTriggerPopUp';
import { TriggerAlarm } from './TriggerAlarm';

export function TriggersSection() {
  const triggers = useTriggersStore((state) => state.triggers);
  const [isCreating, setIsCreating] = useState(false);

  const network = Network.useNetworkState();
  const batteryState = Battery.useBatteryState();

  const online = Boolean(network.isConnected);
  const onWifi = network.type === Network.NetworkStateType.WIFI;
  const charging =
    batteryState === Battery.BatteryState.CHARGING || batteryState === Battery.BatteryState.FULL;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Alarmas por evento"
        description="Se disparan cuando cambia el estado del dispositivo, no a una hora fija."
      />

      <View style={styles.statusRow}>
        <Chip
          label={online ? 'Con internet' : 'Sin internet'}
          icon={online ? 'wifi' : 'wifiOff'}
          tone={online ? 'success' : 'danger'}
          selected
        />
        <Chip label={onWifi ? 'Wifi' : 'Datos'} icon="wifi" tone="neutral" selected />
        <Chip
          label={charging ? 'Cargando' : 'Sin cargar'}
          icon="power"
          tone={charging ? 'success' : 'warning'}
          selected
        />
      </View>

      <Button
        label="Nueva alarma poco convencional"
        icon="sparkles"
        variant="secondary"
        fullWidth
        onPress={() => setIsCreating(true)}
      />

      {triggers.length === 0 ? (
        <EmptyState
          icon="flash"
          title="Todavía no configuraste ninguna"
          description="Por ejemplo: avisame cuando vuelva la luz o la conexión."
        />
      ) : (
        triggers.map((trigger) => <TriggerAlarm key={trigger.id} trigger={trigger} />)
      )}

      <NewTriggerPopUp visible={isCreating} onClose={() => setIsCreating(false)} />
    </View>
  );
}
