import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { TextField } from '@/components/ui/TextField';
import { ThemedText } from '@/components/ui/ThemedText';
import { Spacing } from '@/constants/theme';

export type GoalsFieldProps = {
  value: string[];
  onChange: (goals: string[]) => void;
};

export function GoalsField({ value, onChange }: GoalsFieldProps) {
  const update = (index: number, text: string) => {
    onChange(value.map((goal, position) => (position === index ? text : goal)));
  };

  const remove = (index: number) => {
    onChange(value.filter((_, position) => position !== index));
  };

  return (
    <View style={styles.container}>
      <ThemedText type="label" themeColor="textSecondary">
        Objetivos
      </ThemedText>

      {value.map((goal, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.field}>
            <TextField
              value={goal}
              onChangeText={(text) => update(index, text)}
              placeholder={`Objetivo ${index + 1}`}
            />
          </View>
          <IconButton
            name="close"
            size={16}
            accessibilityLabel={`Quitar objetivo ${index + 1}`}
            onPress={() => remove(index)}
          />
        </View>
      ))}

      <Button
        label="Agregar objetivo"
        icon="plus"
        variant="ghost"
        size="small"
        onPress={() => onChange([...value, ''])}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  field: {
    flex: 1,
  },
});
