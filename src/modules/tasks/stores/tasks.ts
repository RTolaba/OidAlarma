import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistedStorage } from '@/modules/configs/stores/storage';
import { createId } from '@/utils/id';

import type { Task, TaskDraft } from '../types/task';

type TasksState = {
  tasks: Task[];
  addTask: (draft: TaskDraft) => string;
  updateTask: (id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  toggleCompleted: (id: string) => void;
  toggleGoal: (taskId: string, goalId: string) => void;
  removeTask: (id: string) => void;
};

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (draft) => {
        const id = createId('task');

        set((state) => ({
          tasks: [
            {
              ...draft,
              id,
              goals: draft.goals.map((text) => ({ id: createId('goal'), text, done: false })),
              completed: false,
              createdAt: Date.now(),
            },
            ...state.tasks,
          ],
        }));

        return id;
      },
      updateTask: (id, changes) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...changes } : task)),
        })),
      toggleCompleted: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          ),
        })),
      toggleGoal: (taskId, goalId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  goals: task.goals.map((goal) =>
                    goal.id === goalId ? { ...goal, done: !goal.done } : goal,
                  ),
                }
              : task,
          ),
        })),
      removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
    }),
    { name: 'oidalarma:tasks', storage: persistedStorage },
  ),
);

export const useTask = (id: string | undefined) =>
  useTasksStore((state) => state.tasks.find((task) => task.id === id));
