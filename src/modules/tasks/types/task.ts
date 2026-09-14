import type { WeekDay } from '@/utils/time';

export type TaskGoal = {
  id: string;
  text: string;
  done: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  /** Dias en los que se repite. Vacio = tarea suelta. */
  days: WeekDay[];
  goals: TaskGoal[];
  /** Duracion estimada en minutos. `null` = sin estimacion. */
  durationMinutes: number | null;
  /** Timestamp hasta el que aplica la tarea. `null` = sin fecha limite. */
  dueDate: number | null;
  completed: boolean;
  createdAt: number;
};

export type TaskDraft = Omit<Task, 'id' | 'createdAt' | 'completed' | 'goals'> & {
  goals: string[];
};
