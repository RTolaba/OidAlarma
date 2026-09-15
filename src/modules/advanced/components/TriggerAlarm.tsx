import { View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { Toggle } from '@/components/ui/Toggle';
import { formatShortDate } from '@/utils/time';

import { useTriggersStore } from '../stores/triggers';
import { advancedStyles as styles } from '../styles/Advanced.styles';
import { TRIGGER_META, type Trigger } from '../types/trigger';

export type TriggerAlarmProps = {
  trigger: Trigger;
};

export function TriggerAlarm({ trigger }: TriggerAlarmProps) {
  const toggleTrigger = useTriggersStore((state) => state.toggleTrigger);
  const removeTrigger = useTriggersStore((state) => state.removeTrigger);

  const meta = TRIGGER_META[trigger.kind];

  return (
    <Card>
      <View style={styles.triggerRow}>
        <Icon name={meta.icon} size={22} themeColor={trigger.enabled ? 'accent' : 'textTertiary'} />

        <View style={styles.triggerTexts}>
          <ThemedText type="smallBold">{trigger.label || meta.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {meta.description}
          </ThemedText>
          {trigger.lastFiredAt ? (
            <ThemedText type="small" themeColor="textTertiary">
              Último aviso: {formatShortDate(new Date(trigger.lastFiredAt))}
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.triggerActions}>
          <Toggle
            value={trigger.enabled}
            onValueChange={() => toggleTrigger(trigger.id)}
            accessibilityLabel={`Activar ${meta.title}`}
            compact
          />
          <IconButton
            name="delete"
            size={16}
            accessibilityLabel={`Eliminar ${meta.title}`}
            onPress={() => removeTrigger(trigger.id)}
          />
        </View>
      </View>
    </Card>
  );
}
