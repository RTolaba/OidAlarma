/**
 * Rutas de la app. Cada tab es un grupo de expo-router con su propio stack,
 * por eso el tab de alarmas vive en la raiz (`/`).
 */
export const Routes = {
  alarms: '/',
  clock: '/clock',
  tasks: '/tasks',
  newTask: '/tasks/new',
  taskDetail: '/tasks/[taskId]',
  functions: '/functions',
  advanced: '/advanced',
  pomodoro: '/advanced/pomodoro',
} as const;

export const TabRoutes = {
  alarms: '(alarms)',
  tasks: '(tasks)',
  functions: '(functions)',
  advanced: '(advanced)',
} as const;
