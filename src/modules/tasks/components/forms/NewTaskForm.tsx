import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { WeekDaysPicker } from '@/components/ui/WeekDaysPicker';
import { Spacing } from '@/constants/theme';
import { daysFromNow, type WeekDay } from '@/utils/time';

import type { TaskDraft } from '../../types/task';
import { DueDateField } from './DueDateField';
import { DurationField } from './DurationField';
import { GoalsField } from './GoalsField';

export type NewTaskFormProps = {
  onSubmit: (draft: TaskDraft) => void;
  submitLabel?: string;
};

export function NewTaskForm({ onSubmit, submitLabel = 'Crear tarea' }: NewTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState<WeekDay[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [dueInDays, setDueInDays] = useState<number | null>(null);

  const canSubmit = title.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      days,
      goals: goals.map((goal) => goal.trim()).filter(Boolean),
      durationMinutes,
      dueDate: dueInDays === null ? null : daysFromNow(dueInDays),
    });
  };

  return (
    <View style={styles.container}>
      <TextField
        label="Título"
        placeholder="Estudiar inglés"
        value={title}
        onChangeText={setTitle}
        maxLength={60}
      />

      <WeekDaysPicker value={days} onChange={setDays} onceLabel="Sin repetición" />

      <DurationField value={durationMinutes} onChange={setDurationMinutes} />

      <DueDateField value={dueInDays} onChange={setDueInDays} />

      <GoalsField value={goals} onChange={setGoals} />

      <TextField
        label="Descripción"
        placeholder="Detalles, notas, links..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button
        label={submitLabel}
        icon="check"
        fullWidth
        disabled={!canSubmit}
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
});
