import { router } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';

import { NewTaskForm } from '../components/forms/NewTaskForm';
import { useTasksStore } from '../stores/tasks';

export function NewTaskScreen() {
  const addTask = useTasksStore((state) => state.addTask);

  return (
    <ScreenContainer scroll edges={[]} withTabInset={false}>
      <NewTaskForm
        onSubmit={(draft) => {
          addTask(draft);
          router.back();
        }}
      />
    </ScreenContainer>
  );
}
