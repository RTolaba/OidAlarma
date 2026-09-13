/** 0 = domingo ... 6 = sabado, igual que `Date.getDay()`. */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type TimeFormat = '24h' | '12h';

export const WEEK_DAYS: { value: WeekDay; short: string; label: string }[] = [
  { value: 1, short: 'Lu', label: 'Lunes' },
  { value: 2, short: 'Ma', label: 'Martes' },
  { value: 3, short: 'Mi', label: 'Miércoles' },
  { value: 4, short: 'Ju', label: 'Jueves' },
  { value: 5, short: 'Vi', label: 'Viernes' },
  { value: 6, short: 'Sa', label: 'Sábado' },
  { value: 0, short: 'Do', label: 'Domingo' },
];

export const WEEKDAYS: WeekDay[] = [1, 2, 3, 4, 5];
export const WEEKEND: WeekDay[] = [0, 6];

export const pad = (value: number) => String(value).padStart(2, '0');

export function to12Hour(hour: number) {
  return {
    hour: hour % 12 === 0 ? 12 : hour % 12,
    period: hour < 12 ? 'AM' : 'PM',
  };
}

export function to24Hour(hour12: number, period: 'AM' | 'PM') {
  if (period === 'AM') return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

/** Divide la hora en partes para poder maquetarlas con distintos tamanos. */
export function splitTime(date: Date, format: TimeFormat) {
  const rawHour = date.getHours();
  const { hour, period } = to12Hour(rawHour);

  return {
    hours: pad(format === '24h' ? rawHour : hour),
    minutes: pad(date.getMinutes()),
    seconds: pad(date.getSeconds()),
    period: format === '24h' ? undefined : period,
  };
}

export function formatHourMinute(hour: number, minute: number, format: TimeFormat) {
  if (format === '24h') return `${pad(hour)}:${pad(minute)}`;
  const { hour: hour12, period } = to12Hour(hour);
  return `${pad(hour12)}:${pad(minute)} ${period}`;
}

export function formatLongDate(date: Date) {
  const formatted = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatShortDate(date: Date) {
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

const sameDays = (days: WeekDay[], other: WeekDay[]) =>
  days.length === other.length && other.every((day) => days.includes(day));

export function describeDays(days: WeekDay[], onceLabel = 'Una vez') {
  if (days.length === 0) return onceLabel;
  if (days.length === 7) return 'Todos los días';
  if (sameDays(days, WEEKDAYS)) return 'Lun a Vie';
  if (sameDays(days, WEEKEND)) return 'Fin de semana';

  return WEEK_DAYS.filter((day) => days.includes(day.value))
    .map((day) => day.short)
    .join(' · ');
}

/** Proxima vez que se dispara una hora dada, a partir de `from`. */
export function nextOccurrence(
  hour: number,
  minute: number,
  days: WeekDay[],
  from = new Date(),
): Date {
  const candidate = new Date(from);
  candidate.setHours(hour, minute, 0, 0);

  if (days.length === 0) {
    if (candidate <= from) candidate.setDate(candidate.getDate() + 1);
    return candidate;
  }

  for (let offset = 0; offset < 8; offset += 1) {
    const next = new Date(from);
    next.setDate(next.getDate() + offset);
    next.setHours(hour, minute, 0, 0);
    if (next > from && days.includes(next.getDay() as WeekDay)) return next;
  }

  return candidate;
}

export function formatCountdown(target: Date, from = new Date()) {
  const totalMinutes = Math.max(0, Math.round((target.getTime() - from.getTime()) / 60_000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `en ${days} d ${hours} h`;
  if (hours > 0) return `en ${hours} h ${minutes} min`;
  if (minutes > 0) return `en ${minutes} min`;
  return 'en menos de 1 min';
}

/** Convierte milisegundos en `HH:MM:SS` o `MM:SS`. */
export function formatDuration(ms: number, withHours = false) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (withHours || hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}

/** Milisegundos en `MM:SS.cc`, para el cronometro. */
export function formatStopwatch(ms: number) {
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${formatDuration(ms)}.${pad(centiseconds)}`;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Timestamp correspondiente a dentro de `days` dias. */
export function daysFromNow(days: number) {
  return Date.now() + days * DAY_MS;
}

/** Fecha corta correspondiente a dentro de `days` dias. */
export function formatDateInDays(days: number) {
  return formatShortDate(new Date(daysFromNow(days)));
}

/** Duracion en minutos como texto corto (`1 h 30 min`). */
export function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}
