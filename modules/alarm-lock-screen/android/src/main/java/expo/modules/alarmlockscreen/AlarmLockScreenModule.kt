package expo.modules.alarmlockscreen

import android.app.NotificationManager
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.lang.ref.WeakReference

class AlarmLockScreenModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AlarmLockScreen")

    Events("onAlarm", "onAlarmHandled")

    OnCreate {
      instance = WeakReference(this@AlarmLockScreenModule)
    }

    OnDestroy {
      if (instance?.get() === this@AlarmLockScreenModule) {
        instance = null
      }
    }

    OnActivityEntersForeground {
      val context = appContext.reactContext ?: return@OnActivityEntersForeground
      val pending = AlarmStore.peekPending(context) ?: return@OnActivityEntersForeground
      context.startActivity(NativeAlarmScheduler.ringIntent(context, pending))
    }

    AsyncFunction("syncAlarms") { alarms: List<Map<String, Any?>> ->
      val context = context()
      AlarmPresenter.ensureChannel(context)
      NativeAlarmScheduler.sync(context, alarms.map(StoredAlarm::fromMap))
    }

    /**
     * Verdad del lado nativo. JS la usa para reconciliar antes del primer
     * sync, para no revivir un one-shot apagado ni pisar un snooze.
     */
    AsyncFunction("pullNativeState") {
      val context = context()
      mapOf(
        "alarms" to AlarmStore.load(context).map { it.toMap() },
        "pendingAlarmId" to AlarmStore.peekPending(context),
      )
    }

    Function("presentPendingAlarm") {
      val context = context()
      val pending = AlarmStore.peekPending(context) ?: return@Function null
      context.startActivity(NativeAlarmScheduler.ringIntent(context, pending))
      null
    }

    Function("canUseFullScreenIntent") {
      canUseFullScreen()
    }

    AsyncFunction("requestFullScreenIntentSettings") {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE && !canUseFullScreen()) {
        val context = context()
        val intent = Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT).apply {
          data = Uri.parse("package:${context.packageName}")
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
      }
      null
    }
  }

  private fun context() = requireNotNull(appContext.reactContext)

  private fun canUseFullScreen(): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) return true
    return context().getSystemService(NotificationManager::class.java).canUseFullScreenIntent()
  }

  companion object {
    private var instance: WeakReference<AlarmLockScreenModule>? = null

    /**
     * Si JS esta vivo, Zustand se entera al instante. Si no, el proximo
     * `pullNativeState` cubre el hueco.
     */
    fun emitHandled(alarmId: String?, action: String) {
      instance?.get()?.sendEvent(
        "onAlarmHandled",
        mapOf(
          "alarmId" to (alarmId ?: ""),
          "action" to action,
        ),
      )
    }
  }
}
