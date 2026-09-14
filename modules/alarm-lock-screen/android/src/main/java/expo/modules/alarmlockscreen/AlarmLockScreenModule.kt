package expo.modules.alarmlockscreen

import android.app.KeyguardManager
import android.app.NotificationManager
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.view.WindowManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.lang.ref.WeakReference

class AlarmLockScreenModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AlarmLockScreen")

    Events("onAlarm")

    OnCreate {
      instance = WeakReference(this@AlarmLockScreenModule)
    }

    OnDestroy {
      if (instance?.get() === this@AlarmLockScreenModule) {
        instance = null
      }
    }

    OnActivityEntersForeground {
      val pending = appContext.reactContext?.let { AlarmStore.peekPending(it) }
      if (pending != null) {
        sendEvent("onAlarm", mapOf("alarmId" to pending))
      }
    }

    AsyncFunction("syncAlarms") { alarms: List<Map<String, Any?>> ->
      val context = context()
      AlarmPresenter.ensureChannel(context)
      NativeAlarmScheduler.sync(context, alarms.map(StoredAlarm::fromMap))
    }

    AsyncFunction("dismiss") {
      val context = context()
      AlarmStore.setPending(context, null)
      AlarmPresenter.dismiss(context)
    }

    Function("consumePendingAlarmId") {
      appContext.reactContext?.let { AlarmStore.consumePending(it) }
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

    Function("activateLockScreen") {
      appContext.currentActivity?.runOnUiThread {
        val activity = appContext.currentActivity ?: return@runOnUiThread
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
          activity.setShowWhenLocked(true)
          activity.setTurnScreenOn(true)
        } else {
          @Suppress("DEPRECATION")
          activity.window.addFlags(
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
              WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
              WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
          )
        }
        activity.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          val keyguard = activity.getSystemService(KeyguardManager::class.java)
          keyguard?.requestDismissKeyguard(activity, null)
        }
      }
      null
    }

    Function("deactivateLockScreen") {
      appContext.currentActivity?.runOnUiThread {
        appContext.currentActivity?.window?.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
      }
      null
    }
  }

  private fun context() = requireNotNull(appContext.reactContext)

  private fun canUseFullScreen(): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) return true
    val manager = context().getSystemService(NotificationManager::class.java)
    return manager.canUseFullScreenIntent()
  }

  companion object {
    private var instance: WeakReference<AlarmLockScreenModule>? = null

    fun emitAlarm(alarmId: String) {
      instance?.get()?.sendEvent("onAlarm", mapOf("alarmId" to alarmId))
    }
  }
}
