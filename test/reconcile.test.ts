import { reconcileAlarms, type NativeAlarmState } from '@/modules/alarms/utils/reconcile';

import { buildAlarm } from './helpers/alarm';

const NOW = new Date('2026-09-14T08:00:00').getTime();
const MINUTE = 60_000;

const nativeState = (
  alarms: Array<{ id: string; enabled: boolean; snoozeUntil?: number }>,
): NativeAlarmState => ({
  alarms: alarms.map((alarm) => ({ snoozeUntil: 0, ...alarm })),
  pendingAlarmId: null,
});

describe('reconcileAlarms', () => {
  it('deja apagada la alarma sin repeticion que se apago desde el ring nativo', () => {
    const alarms = [buildAlarm({ id: 'a', days: [], enabled: true })];

    const result = reconcileAlarms(alarms, nativeState([{ id: 'a', enabled: false }]), NOW);

    expect(result[0].enabled).toBe(false);
  });

  it('no apaga una alarma que se repite aunque nativo la reporte apagada', () => {
    // Las alarmas con dias no se auto-apagan al sonar: si nativo dice que
    // esta apagada es info vieja, y el usuario manda desde la app.
    const alarms = [buildAlarm({ id: 'a', days: [1, 2, 3], enabled: true })];

    const result = reconcileAlarms(alarms, nativeState([{ id: 'a', enabled: false }]), NOW);

    expect(result[0].enabled).toBe(true);
  });

  it('mantiene encendida una alarma con snooze vigente', () => {
    const alarms = [buildAlarm({ id: 'a', days: [], enabled: false })];
    const native = nativeState([
      { id: 'a', enabled: false, snoozeUntil: NOW + 10 * MINUTE },
    ]);

    const result = reconcileAlarms(alarms, native, NOW);

    expect(result[0].enabled).toBe(true);
  });

  it('ignora un snooze que ya vencio', () => {
    const alarms = [buildAlarm({ id: 'a', days: [], enabled: true })];
    const native = nativeState([
      { id: 'a', enabled: false, snoozeUntil: NOW - MINUTE },
    ]);

    const result = reconcileAlarms(alarms, native, NOW);

    expect(result[0].enabled).toBe(false);
  });

  it('no toca las alarmas que nativo todavia no conoce', () => {
    const alarms = [buildAlarm({ id: 'nueva', days: [], enabled: true })];

    const result = reconcileAlarms(alarms, nativeState([{ id: 'otra', enabled: false }]), NOW);

    expect(result[0].enabled).toBe(true);
  });

  it('devuelve el mismo array si no hubo cambios', () => {
    // Importa la identidad, no solo el contenido: si devolviera un array
    // nuevo, Zustand cambiaria de estado y dispararia un sync en loop.
    const alarms = [buildAlarm({ id: 'a', days: [], enabled: true })];

    const result = reconcileAlarms(alarms, nativeState([{ id: 'a', enabled: true }]), NOW);

    expect(result).toBe(alarms);
  });

  it('devuelve el mismo array si nativo no tiene nada guardado', () => {
    const alarms = [buildAlarm({ id: 'a' })];

    expect(reconcileAlarms(alarms, nativeState([]), NOW)).toBe(alarms);
  });
});
