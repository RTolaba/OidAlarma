package expo.modules.alarmlockscreen

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.PowerManager

class AlarmReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val alarmId = intent.getStringExtra(NativeAlarmScheduler.EXTRA_ALARM_ID) ?: return
    val alarm = AlarmStore.load(context).firstOrNull { it.id == alarmId } ?: return

    AlarmStore.setPending(context, alarmId)
    NativeAlarmScheduler.rescheduleIfNeeded(context, alarmId)
    wakeScreen(context)
    AlarmPresenter.show(context, alarm)

    try {
      val launch = context.packageManager.getLaunchIntentForPackage(context.packageName)
      if (launch != null) {
        launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        launch.putExtra(NativeAlarmScheduler.EXTRA_ALARM_ID, alarmId)
        launch.putExtra("oidalarma.ring", true)
        context.startActivity(launch)
      }
    } catch (_: Exception) {
      // El full-screen intent de la notificación es el camino oficial.
    }

    AlarmLockScreenModule.emitAlarm(alarmId)
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
