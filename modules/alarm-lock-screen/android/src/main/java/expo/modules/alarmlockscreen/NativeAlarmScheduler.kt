package expo.modules.alarmlockscreen

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build

object NativeAlarmScheduler {
  const val ACTION_FIRE = "expo.modules.alarmlockscreen.FIRE"
  const val EXTRA_ALARM_ID = "alarmId"

  fun sync(context: Context, alarms: List<StoredAlarm>) {
    val previous = AlarmStore.load(context)
    previous.forEach { cancel(context, it.id) }
    AlarmStore.save(context, alarms)
    alarms.filter { it.enabled }.forEach { schedule(context, it) }
  }

  fun schedule(context: Context, alarm: StoredAlarm) {
    val manager = manager(context)
    val triggerAt = alarm.nextTriggerAt()
    val operation = fireIntent(context, alarm.id)
    val show = activityIntent(context, alarm.id)

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      manager.setAlarmClock(AlarmManager.AlarmClockInfo(triggerAt, show), operation)
      return
    }

    manager.setExact(AlarmManager.RTC_WAKEUP, triggerAt, operation)
  }

  fun rescheduleIfNeeded(context: Context, alarmId: String) {
    val alarm = AlarmStore.load(context).firstOrNull { it.id == alarmId } ?: return
    if (!alarm.enabled || alarm.days.isEmpty()) {
      cancel(context, alarmId)
      return
    }
    schedule(context, alarm)
  }

  fun cancel(context: Context, alarmId: String) {
    manager(context).cancel(fireIntent(context, alarmId))
  }

  fun fireIntent(context: Context, alarmId: String): PendingIntent {
    val intent = Intent(context, AlarmReceiver::class.java).apply {
      action = ACTION_FIRE
      putExtra(EXTRA_ALARM_ID, alarmId)
    }
    return PendingIntent.getBroadcast(
      context,
      alarmId.hashCode(),
      intent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
  }

  fun activityIntent(context: Context, alarmId: String): PendingIntent {
    val launch = context.packageManager.getLaunchIntentForPackage(context.packageName)
      ?: Intent().setClassName(context.packageName, "${context.packageName}.MainActivity")
    launch.addFlags(
      Intent.FLAG_ACTIVITY_NEW_TASK or
        Intent.FLAG_ACTIVITY_CLEAR_TOP or
        Intent.FLAG_ACTIVITY_SINGLE_TOP,
    )
    launch.putExtra(EXTRA_ALARM_ID, alarmId)
    launch.putExtra("oidalarma.ring", true)
    return PendingIntent.getActivity(
      context,
      alarmId.hashCode() + 17,
      launch,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )
  }

  private fun manager(context: Context) =
    context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
}
