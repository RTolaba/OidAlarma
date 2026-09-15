import { nextOccurrence, type WeekDay } from '@/utils/time';

// 14 de septiembre de 2026 es un lunes.
const MONDAY_8AM = new Date('2026-09-14T08:00:00');

const at = (iso: string) => new Date(iso);

describe('nextOccurrence', () => {
  describe('alarmas sin repeticion', () => {
    it('usa hoy si la hora todavia no paso', () => {
      expect(nextOccurrence(9, 0, [], MONDAY_8AM)).toEqual(at('2026-09-14T09:00:00'));
    });

    it('salta a manana si la hora ya paso', () => {
      expect(nextOccurrence(7, 0, [], MONDAY_8AM)).toEqual(at('2026-09-15T07:00:00'));
    });

    it('salta a manana si la hora es exactamente ahora', () => {
      // Si no, una alarma sonando se reprogramaria para el mismo instante
      // y entraria en bucle.
      expect(nextOccurrence(8, 0, [], MONDAY_8AM)).toEqual(at('2026-09-15T08:00:00'));
    });
  });

  describe('alarmas que se repiten', () => {
    const WEEKDAYS: WeekDay[] = [1, 2, 3, 4, 5];

    it('usa hoy si es un dia activo y la hora no paso', () => {
      expect(nextOccurrence(9, 0, WEEKDAYS, MONDAY_8AM)).toEqual(at('2026-09-14T09:00:00'));
    });

    it('salta al proximo dia activo si la hora de hoy ya paso', () => {
      expect(nextOccurrence(7, 0, WEEKDAYS, MONDAY_8AM)).toEqual(at('2026-09-15T07:00:00'));
    });

    it('cruza el fin de semana hasta el lunes siguiente', () => {
      const friday = at('2026-09-18T20:00:00');

      expect(nextOccurrence(7, 0, WEEKDAYS, friday)).toEqual(at('2026-09-21T07:00:00'));
    });

    it('da la vuelta a la semana cuando solo hay un dia activo', () => {
      const monday: WeekDay[] = [1];

      expect(nextOccurrence(7, 0, monday, MONDAY_8AM)).toEqual(at('2026-09-21T07:00:00'));
    });

    it('usa 0 = domingo, igual que Kotlin con DAY_OF_WEEK - 1', () => {
      // Esta es la convencion compartida con StoredAlarm.nextTriggerAt.
      // Si alguien la cambia de un lado, este test lo delata.
      const sunday: WeekDay[] = [0];

      expect(nextOccurrence(7, 0, sunday, MONDAY_8AM)).toEqual(at('2026-09-20T07:00:00'));
    });
  });
});
