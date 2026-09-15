import { useAlarmsStore } from '@/modules/alarms/stores/alarms';

import { buildAlarm } from './helpers/alarm';

const NOW = new Date('2026-09-14T08:00:00').getTime();

/** Deja el store en un estado conocido antes de cada test. */
const seed = (alarms = [buildAlarm({ id: 'a' })]) =>
  useAlarmsStore.setState({ alarms, ringingId: null });

const read = () => useAlarmsStore.getState();
const alarm = (id: string) => read().alarms.find((item) => item.id === id);

describe('useAlarmsStore', () => {
  beforeEach(() => seed());

  describe('dismiss', () => {
    it('apaga la alarma sin repeticion que estaba sonando', () => {
      seed([buildAlarm({ id: 'a', days: [] })]);
      read().ring('a');

      read().dismiss();

      expect(alarm('a')?.enabled).toBe(false);
      expect(read().ringingId).toBeNull();
    });

    it('deja encendida una alarma que se repite', () => {
      seed([buildAlarm({ id: 'a', days: [1, 3, 5] })]);
      read().ring('a');

      read().dismiss();

      expect(alarm('a')?.enabled).toBe(true);
    });
  });

  describe('snooze', () => {
    it('cierra el ring sin tocar la alarma', () => {
      seed([buildAlarm({ id: 'a', days: [] })]);
      read().ring('a');

      read().snooze();

      expect(read().ringingId).toBeNull();
      expect(alarm('a')?.enabled).toBe(true);
    });
  });

  describe('dismissById', () => {
    it('apaga la alarma indicada aunque no sea la que suena', () => {
      seed([buildAlarm({ id: 'a', days: [] }), buildAlarm({ id: 'b', days: [] })]);
      read().ring('b');

      read().dismissById('a');

      expect(alarm('a')?.enabled).toBe(false);
      expect(read().ringingId).toBe('b');
    });
  });

  describe('reconcileWithNative', () => {
    it('adopta el apagado que hizo la activity nativa', () => {
      seed([buildAlarm({ id: 'a', days: [], enabled: true })]);

      read().reconcileWithNative(
        { alarms: [{ id: 'a', enabled: false, snoozeUntil: 0 }], pendingAlarmId: null },
        NOW,
      );

      expect(alarm('a')?.enabled).toBe(false);
    });

    it('no reemplaza el array cuando no hay nada que cambiar', () => {
      seed([buildAlarm({ id: 'a', days: [], enabled: true })]);
      const before = read().alarms;

      read().reconcileWithNative(
        { alarms: [{ id: 'a', enabled: true, snoozeUntil: 0 }], pendingAlarmId: null },
        NOW,
      );

      expect(read().alarms).toBe(before);
    });
  });
});
