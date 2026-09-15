import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';
import { Spacing } from '@/constants/theme';

import { Task } from '../components/Task';
import { useTask, useTasksStore } from '../stores/tasks';

export function TaskDetailScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const task = useTask(taskId);
  const toggleGoal = useTasksStore((state) => state.toggleGoal);
  const removeTask = useTasksStore((state) => state.removeTask);

  if (!task) {
    return (
      <ScreenContainer edges={[]} withTabInset={false}>
        <EmptyState icon="tasks" title="La tarea ya no existe" />
      </ScreenContainer>
    );
  }

  const confirmRemove = () => {
    Alert.alert('Eliminar tarea', `¿Querés eliminar "${task.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          removeTask(task.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScreenContainer scroll edges={[]} withTabInset={false}>
      <Task task={task} fullDescription />

      {task.goals.length > 0 ? (
        <Card>
          <View style={styles.goals}>
            <ThemedText type="label" themeColor="textSecondary">
              Objetivos
            </ThemedText>
            {task.goals.map((goal) => (
              <Pressable
                key={goal.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: goal.done }}
                onPress={() => toggleGoal(task.id, goal.id)}
                style={styles.goalRow}>
                <Icon
                  name={goal.done ? 'checkCircle' : 'target'}
                  size={18}
                  themeColor={goal.done ? 'success' : 'textTertiary'}
                />
                <ThemedText
                  type="default"
                  style={[styles.goalText, goal.done && styles.goalDone]}
                  themeColor={goal.done ? 'textTertiary' : 'text'}>
                  {goal.text}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Card>
      ) : null}

      {task.description ? (
        <Card>
          <View style={styles.description}>
            <ThemedText type="label" themeColor="textSecondary">
              Descripción
            </ThemedText>
            <ThemedText type="default">{task.description}</ThemedText>
          </View>
        </Card>
      ) : null}

      <Button label="Eliminar tarea" icon="delete" variant="danger" onPress={confirmRemove} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  goals: {
    gap: Spacing.two,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  goalText: {
    flex: 1,
  },
  goalDone: {
    textDecorationLine: 'line-through',
  },
  description: {
    gap: Spacing.two,
  },
});
