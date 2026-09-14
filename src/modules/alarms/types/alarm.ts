import type { WeekDay } from '@/utils/time';

import type { RingtoneId } from '../utils/ringtones';

export type Alarm = {
  id: string;
  label: string;
  hour: number;
  minute: number;
  /** Dias en los que se repite. Vacio = suena una sola vez. */
  days: WeekDay[];
  enabled: boolean;
  /** Exige resolver ejercicios matematicos para apagarla. */
  smart: boolean;
  ringtone: RingtoneId;
  createdAt: number;
};

export type AlarmDraft = Omit<Alarm, 'id' | 'createdAt' | 'enabled'>;
