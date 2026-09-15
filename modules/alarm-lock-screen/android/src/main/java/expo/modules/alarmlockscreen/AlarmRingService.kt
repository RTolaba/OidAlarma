package expo.modules.alarmlockscreen

import android.app.ActivityOptions
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.util.Log

/**
 * Servicio en primer plano: puede mostrar la FSI y reproducir el tono
 * aunque el proceso esté en segundo plano o el celular bloqueado.
 */
class AlarmRingService : Service() {
  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    val alarmId = intent?.getStringExtra(NativeAlarmScheduler.EXTRA_ALARM_ID)
    val alarm = alarmId?.let { id -> AlarmStore.load(this).firstOrNull { it.id == id } }
    if (alarmId == null || alarm == null) {
      stopSelf()
      return START_NOT_STICKY
    }

    val posted = AlarmPresenter.buildNotification(this, alarm)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      startForeground(
        posted.id,
        posted.notification,
        ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK,
      )
    } else {
      startForeground(posted.id, posted.notification)
    }

    AlarmPresenter.cancelNotifications(this, posted.id)
    AlarmSound.start(this, alarm.ringtone)
    AlarmVibrator.start(this)
    openRingScreen(alarmId)

    return START_NOT_STICKY
  }

  override fun onDestroy() {
    AlarmVibrator.stop()
    AlarmSound.stop()
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      stopForeground(STOP_FOREGROUND_REMOVE)
    }
    super.onDestroy()
  }

  private fun openRingScreen(alarmId: String) {
    val launch = NativeAlarmScheduler.ringIntent(this, alarmId)
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
        @Suppress("DEPRECATION")
        val options = ActivityOptions.makeBasic().apply {
          pendingIntentBackgroundActivityStartMode =
            ActivityOptions.MODE_BACKGROUND_ACTIVITY_START_ALLOWED
        }
        startActivity(launch, options.toBundle())
      } else {
        startActivity(launch)
      }
    } catch (error: Exception) {
      // Sin la activity queda la notificacion a pantalla completa, pero hay
      // que poder verlo en logcat en vez de fallar en silencio.
      Log.w("AlarmRingService", "No se pudo abrir la pantalla de alarma", error)
    }
  }

  companion object {
    fun start(context: Context, alarmId: String) {
      val intent = Intent(context, AlarmRingService::class.java).apply {
        putExtra(NativeAlarmScheduler.EXTRA_ALARM_ID, alarmId)
      }
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        context.startForegroundService(intent)
      } else {
        context.startService(intent)
      }
    }

    fun stop(context: Context) {
      context.stopService(Intent(context, AlarmRingService::class.java))
    }
  }
}
