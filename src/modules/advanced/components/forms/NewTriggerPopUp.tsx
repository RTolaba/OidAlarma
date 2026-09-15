import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PopUp } from '@/components/ui/PopUp';
import { TextField } from '@/components/ui/TextField';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/hooks/use-theme';

import { useTriggersStore } from '../../stores/triggers';
import { advancedStyles as styles } from '../../styles/Advanced.styles';
import { TRIGGER_META, type TriggerKind } from '../../types/trigger';

const KINDS = Object.keys(TRIGGER_META) as TriggerKind[];

export type NewTriggerPopUpProps = {
  visible: boolean;
  onClose: () => void;
};

export function NewTriggerPopUp({ visible, onClose }: NewTriggerPopUpProps) {
  const theme = useTheme();
  const addTrigger = useTriggersStore((state) => state.addTrigger);

  const [kind, setKind] = useState<TriggerKind>('internet');
  const [label, setLabel] = useState('');

  const handleClose = () => {
    setKind('internet');
    setLabel('');
    onClose();
  };

  const handleSave = () => {
    addTrigger({ kind, label: label.trim() });
    handleClose();
  };

  return (
    <PopUp
      visible={visible}
      onClose={handleClose}
      title="Alarma poco convencional"
      subtitle="No depende de la hora sino de lo que pasa en el dispositivo."
      footer={<Button label="Crear alarma" icon="check" fullWidth onPress={handleSave} />}>
      {KINDS.map((item) => {
        const meta = TRIGGER_META[item];
        const selected = kind === item;

        return (
          <Pressable
            key={item}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => setKind(item)}
            style={[
              styles.kindOption,
              {
                borderColor: selected ? theme.accent : theme.border,
                backgroundColor: selected ? theme.accentSoft : 'transparent',
              },
            ]}>
            <Icon name={meta.icon} size={22} themeColor={selected ? 'accent' : 'textTertiary'} />
            <View style={styles.kindTexts}>
              <ThemedText type="smallBold">{meta.title}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {meta.description}
              </ThemedText>
            </View>
          </Pressable>
        );
      })}

      <TextField
        label="Nombre"
        placeholder="Avisame cuando vuelva"
        value={label}
        onChangeText={setLabel}
        maxLength={40}
      />
    </PopUp>
  );
}
