package expo.modules.alarmlockscreen

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.PowerManager

class AlarmReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val alarmId = intent.getStringExtra(NativeAlarmScheduler.EXTRA_ALARM_ID) ?: return
    if (AlarmStore.find(context, alarmId) == null) return

    // El snooze ya se consumio: si no se limpia, reprogramar lo repetiria.
    AlarmStore.clearSnooze(context, alarmId)
    AlarmStore.setPending(context, alarmId)
    NativeAlarmScheduler.rescheduleIfNeeded(context, alarmId)
    wakeScreen(context)
    AlarmRingService.start(context, alarmId)
  }

  private fun wakeScreen(context: Context) {
    val power = context.getSystemService(Context.POWER_SERVICE) as PowerManager
    @Suppress("DEPRECATION")
    val flags = PowerManager.FULL_WAKE_LOCK or
      PowerManager.ACQUIRE_CAUSES_WAKEUP or
      PowerManager.ON_AFTER_RELEASE
    power.newWakeLock(flags, "oidalarma:alarm").acquire(60_000)
  }
}
