import type { Alarm } from '@/modules/alarms/types/alarm';
import type { WeekDay } from '@/utils/time';

/**
 * Fabrica de alarmas para los tests. Cada test solo declara lo que le
 * importa (`buildAlarm({ days: [] })`) y el resto queda en valores sanos,
 * asi un campo nuevo en `Alarm` no rompe veinte tests.
 */
export function buildAlarm(overrides: Partial<Alarm> = {}): Alarm {
  return {
    id: 'alarm_1',
    label: 'Despertar',
    hour: 7,
    minute: 30,
    days: [] as WeekDay[],
    enabled: true,
    smart: false,
    ringtone: 'ring_rock',
    createdAt: 0,
    ...overrides,
  };
}
