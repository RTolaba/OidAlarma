package expo.modules.alarmlockscreen

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build

object NativeAlarmScheduler {
  const val ACTION_FIRE = "expo.modules.alarmlockscreen.FIRE"
  const val ACTION_RING = "expo.modules.alarmlockscreen.RING"
  const val EXTRA_ALARM_ID = "alarmId"
  const val EXTRA_FIRE_TOKEN = "fireToken"

  /** Unica fuente del aplazamiento, tanto en la activity como desde JS. */
  const val SNOOZE_MINUTES = 10

  fun sync(context: Context, alarms: List<StoredAlarm>) {
    val previous = AlarmStore.load(context)
    previous.forEach { cancel(context, it.id) }

    val merged = StoredAlarm.merge(alarms, previous)
    AlarmStore.save(context, merged)
    merged.filter { it.enabled }.forEach { schedule(context, it) }
  }

  fun schedule(context: Context, alarm: StoredAlarm) {
    val manager = manager(context)
    val triggerAt = alarm.nextTriggerAt()
    val operation = fireIntent(context, alarm.id)

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      val show = activityIntent(context, alarm.id)
      manager.setAlarmClock(AlarmManager.AlarmClockInfo(triggerAt, show), operation)
      return
    }

    manager.setExact(AlarmManager.RTC_WAKEUP, triggerAt, operation)
  }

  fun rescheduleIfNeeded(context: Context, alarmId: String) {
    val alarm = AlarmStore.find(context, alarmId) ?: return
    if (!alarm.enabled || alarm.isOneShot) {
      cancel(context, alarmId)
      return
    }
    schedule(context, alarm)
  }

  /**
   * Guarda el aplazamiento en el store y reprograma. Al persistirlo, un
   * `sync` posterior lo respeta en vez de pisarlo con el horario original.
   */
  fun snooze(context: Context, alarmId: String, minutes: Int = SNOOZE_MINUTES) {
    val triggerAt = System.currentTimeMillis() + minutes.coerceAtLeast(1) * 60_000L
    val alarm = AlarmStore.update(context, alarmId) {
      it.copy(enabled = true, snoozeUntil = triggerAt)
    } ?: return
    schedule(context, alarm)
  }

  /** Apagar una alarma sin repeticion la deja apagada de verdad. */
  fun disableOneShot(context: Context, alarmId: String) {
    val alarm = AlarmStore.update(context, alarmId) { current ->
      if (current.isOneShot) current.copy(enabled = false, snoozeUntil = 0L)
      else current.copy(snoozeUntil = 0L)
    } ?: return

    if (alarm.enabled) schedule(context, alarm) else cancel(context, alarmId)
  }

  fun cancel(context: Context, alarmId: String) {
    manager(context).cancel(fireIntent(context, alarmId))
  }

  fun fireIntent(context: Context, alarmId: String): PendingIntent {
    val intent = Intent(context, AlarmReceiver::class.java).apply {
      action = ACTION_FIRE
      putExtra(EXTRA_ALARM_ID, alarmId)
      data = Uri.parse("oidalarma://fire/$alarmId")
    }
    return PendingIntent.getBroadcast(
      context,
      requestCode(alarmId),
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
  }

  fun activityIntent(
    context: Context,
    alarmId: String,
    fireToken: Long = System.currentTimeMillis(),
  ): PendingIntent {
    return PendingIntent.getActivity(
      context,
      (fireToken and 0x7fffffff).toInt(),
      ringIntent(context, alarmId, fireToken),
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
  }

  fun ringIntent(
    context: Context,
    alarmId: String,
    fireToken: Long = System.currentTimeMillis(),
  ): Intent {
    return Intent(context, AlarmRingActivity::class.java).apply {
      action = ACTION_RING
      addFlags(
        Intent.FLAG_ACTIVITY_NEW_TASK or
          Intent.FLAG_ACTIVITY_CLEAR_TOP or
          Intent.FLAG_ACTIVITY_SINGLE_TOP,
      )
      putExtra(EXTRA_ALARM_ID, alarmId)
      putExtra(EXTRA_FIRE_TOKEN, fireToken)
      data = Uri.parse("oidalarma://ring/$alarmId/$fireToken")
    }
  }

  private fun requestCode(alarmId: String) = alarmId.hashCode()

  private fun manager(context: Context) =
    context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
}
