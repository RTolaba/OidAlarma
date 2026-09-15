package expo.modules.alarmlockscreen

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat

data class PostedAlarmNotification(
  val id: Int,
  val notification: Notification,
)

object AlarmPresenter {
  private const val CHANNEL_PREFIX = "oidalarma-lock-alarm"

  fun channelId(ringtone: String?) = "$CHANNEL_PREFIX-quiet-${AlarmSound.rawName(ringtone)}"

  fun ensureChannel(context: Context, ringtone: String? = null) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val manager = context.getSystemService(NotificationManager::class.java)
    val id = channelId(ringtone)
    val channel = NotificationChannel(
      id,
      "Alarmas a pantalla completa",
      NotificationManager.IMPORTANCE_HIGH,
    ).apply {
      description = "Despierta el celular y muestra la alarma aunque esté bloqueado."
      enableVibration(false)
      setBypassDnd(true)
      lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
      // Sonido y vibración los maneja el servicio, no el canal.
      setSound(null, null)
    }
    manager.createNotificationChannel(channel)
  }

  fun buildNotification(context: Context, alarm: StoredAlarm): PostedAlarmNotification {
    ensureChannel(context, alarm.ringtone)

    val fireToken = System.currentTimeMillis()
    val notificationId = ((fireToken and 0x7fffffff).toInt()).let { if (it == 0) 1 else it }
    val fullScreen = NativeAlarmScheduler.activityIntent(context, alarm.id, fireToken)
    val notification = NotificationCompat.Builder(context, channelId(alarm.ringtone))
      .setSmallIcon(context.applicationInfo.icon)
      .setContentTitle(alarm.label.ifBlank { "Alarma" })
      .setContentText(
        if (alarm.smart) "Resolvé los ejercicios para apagarla." else "Tocá para apagar la alarma.",
      )
      .setCategory(NotificationCompat.CATEGORY_ALARM)
      .setPriority(NotificationCompat.PRIORITY_MAX)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .setOngoing(true)
      .setAutoCancel(false)
      .setOnlyAlertOnce(false)
      .setFullScreenIntent(fullScreen, true)
      .setContentIntent(fullScreen)
      .build()

    return PostedAlarmNotification(notificationId, notification)
  }

  fun dismiss(context: Context) {
    AlarmVibrator.stop()
    AlarmSound.stop()
    AlarmRingService.stop(context)
    cancelNotifications(context)
  }

  fun cancelNotifications(context: Context, keepId: Int? = null) {
    val manager = context.getSystemService(NotificationManager::class.java)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      manager.activeNotifications
        .filter { it.notification.channelId?.startsWith(CHANNEL_PREFIX) == true }
        .filter { keepId == null || it.id != keepId }
        .forEach { manager.cancel(it.id) }
    } else if (keepId == null) {
      manager.cancelAll()
    }
  }
}
