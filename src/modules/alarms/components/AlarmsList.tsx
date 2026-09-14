import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

import { useAlarmsStore } from '../stores/alarms';
import { alarmsListStyles as styles } from '../styles/Alarm.styles';
import type { Alarm as AlarmModel } from '../types/alarm';
import { Alarm } from './Alarm';
import { AlarmFormPopUp } from './forms/AlarmFormPopUp';

type DraftTarget = AlarmModel | 'new';

export function AlarmsList() {
  const alarms = useAlarmsStore((state) => state.alarms);
  const [draftTarget, setDraftTarget] = useState<DraftTarget | null>(null);

  return (
    <View style={styles.container}>
      <Button
        label="Nueva alarma"
        icon="alarmPlus"
        variant="secondary"
        fullWidth
        onPress={() => setDraftTarget('new')}
      />

      {alarms.length === 0 ? (
        <EmptyState
          icon="alarmOff"
          title="No tenés alarmas"
          description="Creá una para que te despierte a la hora que quieras."
        />
      ) : (
        <View style={styles.items}>
          {alarms.map((alarm) => (
            <Alarm key={alarm.id} alarm={alarm} onPress={() => setDraftTarget(alarm)} />
          ))}
        </View>
      )}

      <AlarmFormPopUp
        visible={draftTarget !== null}
        alarm={draftTarget === 'new' || draftTarget === null ? null : draftTarget}
        onClose={() => setDraftTarget(null)}
      />
    </View>
  );
}
