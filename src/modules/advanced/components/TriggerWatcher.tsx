import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import { useEffect, useRef } from 'react';
import { Platform, Vibration } from 'react-native';

import { Button } from '@/components/ui/Button';
import { PopUp } from '@/components/ui/PopUp';
import { ThemedText } from '@/components/ui/ThemedText';

import { useTriggersStore } from '../stores/triggers';
import { TRIGGER_META } from '../types/trigger';

const ALERT_PATTERN = [0, 400, 200, 400];

const isCharging = (state: Battery.BatteryState) =>
  state === Battery.BatteryState.CHARGING || state === Battery.BatteryState.FULL;

/**
 * Vigila red y carga para disparar las alarmas por evento. Solo funciona con la
 * app abierta; el seguimiento en segundo plano queda pendiente.
 */
export function TriggerWatcher() {
  const triggers = useTriggersStore((state) => state.triggers);
  const firedId = useTriggersStore((state) => state.firedId);
  const fireByKind = useTriggersStore((state) => state.fireByKind);
  const acknowledge = useTriggersStore((state) => state.acknowledge);

  const wasOnline = useRef<boolean | null>(null);
  const wasWifi = useRef<boolean | null>(null);
  const wasCharging = useRef<boolean | null>(null);

  useEffect(() => {
    let active = true;

    Network.getNetworkStateAsync()
      .then((state) => {
        if (!active) return;
        wasOnline.current = Boolean(state.isConnected);
        wasWifi.current = state.type === Network.NetworkStateType.WIFI;
      })
      .catch(() => {});

    const subscription = Network.addNetworkStateListener((state) => {
      const online = Boolean(state.isConnected);
      const wifi = state.type === Network.NetworkStateType.WIFI;

      if (wasOnline.current === false && online) fireByKind('internet');
      if (wasWifi.current === false && wifi) fireByKind('wifi');

      wasOnline.current = online;
      wasWifi.current = wifi;
    });

    return () => {
      active = false;
      subscription.remove();
    };
  }, [fireByKind]);

  useEffect(() => {
    let active = true;

    Battery.getBatteryStateAsync()
      .then((state) => {
        if (active) wasCharging.current = isCharging(state);
      })
      .catch(() => {});

    const subscription = Battery.addBatteryStateListener(({ batteryState }) => {
      const charging = isCharging(batteryState);
      if (wasCharging.current === false && charging) fireByKind('power');
      wasCharging.current = charging;
    });

    return () => {
      active = false;
      subscription.remove();
    };
  }, [fireByKind]);

  const fired = triggers.find((trigger) => trigger.id === firedId) ?? null;

  useEffect(() => {
    if (fired && Platform.OS !== 'web') Vibration.vibrate(ALERT_PATTERN);
  }, [fired]);

  if (!fired) return null;

  const meta = TRIGGER_META[fired.kind];

  return (
    <PopUp
      visible
      onClose={acknowledge}
      title={meta.title}
      subtitle={fired.label || meta.description}
      footer={<Button label="Entendido" icon="check" fullWidth onPress={acknowledge} />}>
      <ThemedText type="default" themeColor="textSecondary">
        {meta.description}
      </ThemedText>
    </PopUp>
  );
}
