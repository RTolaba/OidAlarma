import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { PopUp } from '@/components/ui/PopUp';

import { useAlarmsStore } from '../../stores/alarms';
import type { Alarm } from '../../types/alarm';
import { DEFAULT_RINGTONE } from '../../utils/ringtones';
import { AlarmForm, type AlarmFormValue } from './AlarmForm';

const EMPTY_FORM: AlarmFormValue = {
  hour: 7,
  minute: 0,
  days: [],
  label: '',
  smart: false,
  ringtone: DEFAULT_RINGTONE,
};

const toFormValue = (alarm: Alarm): AlarmFormValue => ({
  hour: alarm.hour,
  minute: alarm.minute,
  days: alarm.days,
  label: alarm.label,
  smart: alarm.smart,
  ringtone: alarm.ringtone,
});

const formSession = (visible: boolean, alarm?: Alarm | null) =>
  visible ? (alarm?.id ?? 'new') : null;

export type AlarmFormPopUpProps = {
  visible: boolean;
  alarm?: Alarm | null;
  onClose: () => void;
};

export function AlarmFormPopUp({ visible, alarm, onClose }: AlarmFormPopUpProps) {
  const addAlarm = useAlarmsStore((state) => state.addAlarm);
  const updateAlarm = useAlarmsStore((state) => state.updateAlarm);
  const [value, setValue] = useState<AlarmFormValue>(() =>
    alarm ? toFormValue(alarm) : EMPTY_FORM,
  );
  const [session, setSession] = useState(() => formSession(visible, alarm));
  const editing = alarm != null;

  // Reinicia el formulario cuando cambia lo que se esta editando, sin
  // esperar a un efecto: React descarta este render y vuelve a empezar.
  const currentSession = formSession(visible, alarm);
  if (currentSession !== session) {
    setSession(currentSession);
    if (currentSession) setValue(alarm ? toFormValue(alarm) : EMPTY_FORM);
  }

  const handleSave = () => {
    const draft = { ...value, label: value.label.trim() };
    if (alarm) {
      updateAlarm(alarm.id, draft);
    } else {
      addAlarm(draft);
    }
    onClose();
  };

  return (
    <PopUp
      visible={visible}
      onClose={onClose}
      title={editing ? 'Editar alarma' : 'Nueva alarma'}
      subtitle={
        editing
          ? 'Cambiá la hora, los días o el nombre.'
          : 'Elegí la hora, los días y ponele un nombre.'
      }
      footer={
        <Button
          label={editing ? 'Guardar cambios' : 'Guardar alarma'}
          icon="check"
          fullWidth
          onPress={handleSave}
        />
      }>
      {visible ? <AlarmForm value={value} onChange={setValue} /> : null}
    </PopUp>
  );
}
