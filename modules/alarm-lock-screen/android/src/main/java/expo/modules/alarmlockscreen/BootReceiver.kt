package expo.modules.alarmlockscreen

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action != Intent.ACTION_BOOT_COMPLETED) return
    // nextTriggerAt ya prioriza un snooze vigente, asi que se reprograma solo.
    AlarmStore.load(context)
      .filter { it.enabled }
      .forEach { NativeAlarmScheduler.schedule(context, it) }
  }
}
