import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Routes } from '@/modules/configs/navigation/routes';

import { useTasksStore } from '../stores/tasks';
import { tasksListStyles as styles } from '../styles/Task.styles';
import { Task } from './Task';

export function TasksList() {
  const tasks = useTasksStore((state) => state.tasks);

  const ordered = [
    ...tasks.filter((task) => !task.completed),
    ...tasks.filter((task) => task.completed),
  ];

  return (
    <View style={styles.container}>
      <Button
        label="Nueva tarea"
        icon="plus"
        variant="secondary"
        fullWidth
        onPress={() => router.push(Routes.newTask)}
      />

      {tasks.length === 0 ? (
        <EmptyState
          icon="tasks"
          title="No tenés tareas"
          description="Creá una para organizar tus días."
        />
      ) : (
        <View style={styles.items}>
          {ordered.map((task) => (
            <Task
              key={task.id}
              task={task}
              onPress={() =>
                router.push({ pathname: Routes.taskDetail, params: { taskId: task.id } })
              }
            />
          ))}
        </View>
      )}
    </View>
  );
}
