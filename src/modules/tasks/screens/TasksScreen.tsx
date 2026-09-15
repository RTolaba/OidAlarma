import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';

import { TasksList } from '../components/TasksList';
import { useTasksStore } from '../stores/tasks';

export function TasksScreen() {
  const tasks = useTasksStore((state) => state.tasks);
  const pending = tasks.filter((task) => !task.completed).length;

  return (
    <ScreenContainer scroll>
      <SectionHeader
        title="Tareas"
        description={
          tasks.length === 0
            ? 'Todo lo que quieras repetir o recordar.'
            : `${pending} pendiente${pending === 1 ? '' : 's'} de ${tasks.length}`
        }
      />
      <TasksList />
    </ScreenContainer>
  );
}
