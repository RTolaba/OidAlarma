import { View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { TextField } from '@/components/ui/TextField';
import { ThemedText } from '@/components/ui/ThemedText';
import { WeekDaysPicker } from '@/components/ui/WeekDaysPicker';
import { useTheme } from '@/hooks/use-theme';
import type { WeekDay } from '@/utils/time';

import { newAlarmStyles as styles } from '../../styles/NewAlarm.styles';
import type { RingtoneId } from '../../utils/ringtones';
import { RingtonePicker } from './RingtonePicker';
import { TimeWheel } from './TimeWheel';

export type AlarmFormValue = {
  hour: number;
  minute: number;
  days: WeekDay[];
  label: string;
  smart: boolean;
  ringtone: RingtoneId;
};

export type AlarmFormProps = {
  value: AlarmFormValue;
  onChange: (value: AlarmFormValue) => void;
};

export function AlarmForm({ value, onChange }: AlarmFormProps) {
  const theme = useTheme();

  return (
    <>
      <TimeWheel
        hour={value.hour}
        minute={value.minute}
        onChange={(hour, minute) => onChange({ ...value, hour, minute })}
      />

      <WeekDaysPicker value={value.days} onChange={(days) => onChange({ ...value, days })} />

      <TextField
        label="Título"
        placeholder="Despertarse, tomar agua..."
        value={value.label}
        onChangeText={(label) => onChange({ ...value, label })}
        maxLength={40}
      />

      <RingtonePicker
        value={value.ringtone}
        onChange={(ringtone) => onChange({ ...value, ringtone })}
      />

      <View style={[styles.smartRow, { borderColor: value.smart ? theme.secondary : theme.border }]}>
        <IconButton
          name="brain"
          variant="solid"
          active={value.smart}
          accessibilityLabel="Activar alarma inteligente"
          onPress={() => onChange({ ...value, smart: !value.smart })}
        />
        <View style={styles.smartTexts}>
          <ThemedText type="smallBold">Alarma inteligente</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Resolvé ejercicios para apagarla y despertarte de verdad.
          </ThemedText>
        </View>
      </View>

      {value.smart ? (
        <View style={[styles.disclaimer, { backgroundColor: theme.accentSoft }]}>
          <Icon name="info" size={16} color={theme.accent} />
          <ThemedText type="small" style={[styles.disclaimerText, { color: theme.accent }]}>
            Con la alarma inteligente activada vas a tener que resolver ejercicios matemáticos
            sencillos para poder apagarla. Hasta que no los resuelvas, sigue sonando.
          </ThemedText>
        </View>
      ) : null}
    </>
  );
}
