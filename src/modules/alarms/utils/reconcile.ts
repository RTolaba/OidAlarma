import type { Alarm } from '../types/alarm';

/** Foto de una alarma tal como la guarda el modulo nativo. */
export type NativeAlarmSnapshot = {
  id: string;
  enabled: boolean;
  /** Epoch ms del aplazamiento vigente. 0 = sin snooze. */
  snoozeUntil: number;
};

export type NativeAlarmState = {
  alarms: NativeAlarmSnapshot[];
  pendingAlarmId: string | null;
};

export function hasActiveSnooze(snapshot: NativeAlarmSnapshot, now = Date.now()) {
  return snapshot.snoozeUntil > now;
}

/**
 * Nativo es la fuente de verdad de lo que pasó mientras JS estaba muerto:
 * una alarma sin repeticion apagada desde el ring sigue apagada, y una
 * aplazada sigue activa. Para todo lo demas (hora, dias, tono) manda JS.
 *
 * Devuelve el mismo array si no hubo cambios, asi no se dispara un sync
 * ni un re-render al pedo.
 */
export function reconcileAlarms(
  alarms: Alarm[],
  native: NativeAlarmState,
  now = Date.now(),
): Alarm[] {
  if (native.alarms.length === 0) return alarms;

  const byId = new Map(native.alarms.map((snapshot) => [snapshot.id, snapshot]));
  let changed = false;

  const next = alarms.map((alarm) => {
    const snapshot = byId.get(alarm.id);
    if (!snapshot) return alarm;

    const enabled = resolveEnabled(alarm, snapshot, now);
    if (enabled === alarm.enabled) return alarm;

    changed = true;
    return { ...alarm, enabled };
  });

  return changed ? next : alarms;
}

function resolveEnabled(alarm: Alarm, snapshot: NativeAlarmSnapshot, now: number) {
  // Un snooze vigente implica que la alarma sigue viva, aunque sea one-shot.
  if (hasActiveSnooze(snapshot, now)) return true;

  // Solo las alarmas sin repeticion se auto-apagan al sonar.
  if (alarm.days.length === 0) return snapshot.enabled;

  return alarm.enabled;
}
