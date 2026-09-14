import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/hooks/use-theme';
import { describeDays, formatMinutes, formatShortDate } from '@/utils/time';

import { useTasksStore } from '../stores/tasks';
import { taskStyles as styles } from '../styles/Task.styles';
import type { Task as TaskModel } from '../types/task';

export type TaskProps = {
  task: TaskModel;
  onPress?: () => void;
  /** En el detalle se muestra la descripcion completa. */
  fullDescription?: boolean;
};

/**
 * Card de tarea con la esquina superior derecha doblada.
 */
export function Task({ task, onPress, fullDescription = false }: TaskProps) {
  const theme = useTheme();
  const toggleCompleted = useTasksStore((state) => state.toggleCompleted);

  const doneGoals = task.goals.filter((goal) => goal.done).length;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={task.title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.foldFlap, { borderBottomColor: theme.backgroundSelected }]} />
      <View style={[styles.foldCut, { borderTopColor: theme.background }]} />

      <View style={styles.header}>
        <IconButton
          name={task.completed ? 'checkCircle' : 'check'}
          variant="soft"
          size={16}
          active={task.completed}
          accessibilityLabel={task.completed ? 'Marcar como pendiente' : 'Marcar como realizada'}
          onPress={() => toggleCompleted(task.id)}
        />
        <ThemedText
          type="section"
          numberOfLines={fullDescription ? undefined : 2}
          style={[styles.title, task.completed && styles.completedTitle]}>
          {task.title}
        </ThemedText>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Icon name="calendar" size={14} themeColor="textTertiary" />
          <ThemedText type="small" themeColor="textSecondary">
            {describeDays(task.days, 'Sin repetición')}
          </ThemedText>
        </View>

        {task.durationMinutes ? (
          <View style={styles.metaItem}>
            <Icon name="hourglass" size={14} themeColor="textTertiary" />
            <ThemedText type="small" themeColor="textSecondary">
              {formatMinutes(task.durationMinutes)}
            </ThemedText>
          </View>
        ) : null}

        <View style={styles.metaItem}>
          <Icon name="flag" size={14} themeColor="textTertiary" />
          <ThemedText type="small" themeColor="textSecondary">
            {task.dueDate ? `Hasta ${formatShortDate(new Date(task.dueDate))}` : 'Sin fecha límite'}
          </ThemedText>
        </View>

        {task.goals.length > 0 ? (
          <View style={styles.metaItem}>
            <Icon name="target" size={14} themeColor="textTertiary" />
            <ThemedText type="small" themeColor="textSecondary">
              {doneGoals}/{task.goals.length} objetivos
            </ThemedText>
          </View>
        ) : null}
      </View>

      {task.description ? (
        <ThemedText
          type="small"
          themeColor="textSecondary"
          numberOfLines={fullDescription ? undefined : 2}>
          {task.description}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}
