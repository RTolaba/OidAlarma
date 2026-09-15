import { Alert, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { Toggle } from '@/components/ui/Toggle';
import { useMainStore } from '@/modules/configs/stores/main';
import { describeDays, formatCountdown, nextOccurrence, pad, to12Hour } from '@/utils/time';

import { useAlarmsStore } from '../stores/alarms';
import { alarmStyles as styles } from '../styles/Alarm.styles';
import type { Alarm as AlarmModel } from '../types/alarm';

export type AlarmProps = {
  alarm: AlarmModel;
  onPress?: () => void;
};

export function Alarm({ alarm, onPress }: AlarmProps) {
  const timeFormat = useMainStore((state) => state.timeFormat);
  const toggleAlarm = useAlarmsStore((state) => state.toggleAlarm);
  const removeAlarm = useAlarmsStore((state) => state.removeAlarm);

  const { hour: hour12, period } = to12Hour(alarm.hour);
  const time =
    timeFormat === '24h'
      ? `${pad(alarm.hour)}:${pad(alarm.minute)}`
      : `${pad(hour12)}:${pad(alarm.minute)}`;

  const confirmRemove = () => {
    Alert.alert('Eliminar alarma', `¿Querés eliminar "${alarm.label || time}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => removeAlarm(alarm.id) },
    ]);
  };

  return (
    <Card
      onPress={onPress}
      onLongPress={confirmRemove}
      accessibilityLabel={`Alarma ${time}`}>
      <View style={[styles.row, !alarm.enabled && styles.disabled]}>
        <View style={styles.info}>
          <View style={styles.timeRow}>
            <ThemedText style={styles.time}>{time}</ThemedText>
            {timeFormat === '12h' ? (
              <ThemedText type="smallBold" themeColor="textSecondary">
                {period}
              </ThemedText>
            ) : null}
            {alarm.label ? (
              <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                {alarm.label}
              </ThemedText>
            ) : null}
          </View>

          <View style={styles.metaRow}>
            <ThemedText type="small" themeColor="textSecondary">
              {describeDays(alarm.days)}
            </ThemedText>
            {alarm.enabled ? (
              <ThemedText type="small" themeColor="textTertiary">
                {formatCountdown(nextOccurrence(alarm.hour, alarm.minute, alarm.days))}
              </ThemedText>
            ) : null}
            {alarm.smart ? <Chip label="Inteligente" icon="brain" selected /> : null}
          </View>
        </View>

        <View style={styles.actions}>
          <Toggle
            value={alarm.enabled}
            onValueChange={() => toggleAlarm(alarm.id)}
            accessibilityLabel={`Activar alarma ${time}`}
            compact
          />
          <IconButton
            name="delete"
            size={16}
            accessibilityLabel={`Eliminar alarma ${time}`}
            onPress={confirmRemove}
          />
        </View>
      </View>
    </Card>
  );
}
