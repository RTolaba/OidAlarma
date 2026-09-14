package expo.modules.alarmlockscreen

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

object AlarmPresenter {
  const val CHANNEL_ID = "oidalarma-lock-alarm"
  const val NOTIFICATION_ID = 71001
  private val PATTERN = longArrayOf(0, 600, 400, 600, 400, 800)

  fun ensureChannel(context: Context) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val manager = context.getSystemService(NotificationManager::class.java)
    val channel = NotificationChannel(
      CHANNEL_ID,
      "Alarmas a pantalla completa",
      NotificationManager.IMPORTANCE_HIGH,
    ).apply {
      description = "Despierta el celular y muestra la alarma aunque esté bloqueado."
      enableVibration(true)
      vibrationPattern = PATTERN
      setBypassDnd(true)
      lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
    }
    manager.createNotificationChannel(channel)
  }

  fun show(context: Context, alarm: StoredAlarm) {
    ensureChannel(context)
    val fullScreen = NativeAlarmScheduler.activityIntent(context, alarm.id)
    val notification = NotificationCompat.Builder(context, CHANNEL_ID)
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
      .setFullScreenIntent(fullScreen, true)
      .setContentIntent(fullScreen)
      .setVibrate(PATTERN)
      .build()

    NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, notification)
    vibrate(context)
  }

  fun dismiss(context: Context) {
    NotificationManagerCompat.from(context).cancel(NOTIFICATION_ID)
    vibrator(context)?.cancel()
  }

  fun vibrate(context: Context) {
    val vibrator = vibrator(context) ?: return
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      vibrator.vibrate(VibrationEffect.createWaveform(PATTERN, 0))
    } else {
      @Suppress("DEPRECATION")
      vibrator.vibrate(PATTERN, 0)
    }
  }

  private fun vibrator(context: Context): Vibrator? {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      context.getSystemService(VibratorManager::class.java)?.defaultVibrator
    } else {
      @Suppress("DEPRECATION")
      context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    }
  }
}
