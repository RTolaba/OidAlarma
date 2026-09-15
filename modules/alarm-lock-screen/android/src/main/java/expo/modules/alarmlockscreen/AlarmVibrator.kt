package expo.modules.alarmlockscreen

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager

/**
 * Un solo vibrador en loop. Se guarda la misma instancia para poder
 * cancelarlo de verdad al apagar; en varios OEM `cancel()` suelto no corta.
 */
object AlarmVibrator {
  private val PATTERN = longArrayOf(0, 600, 400, 600, 400, 800)
  private var vibrator: Vibrator? = null
  private var manager: VibratorManager? = null

  fun start(context: Context) {
    val app = context.applicationContext
    val current = obtain(app)
    vibrator = current
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      current.vibrate(VibrationEffect.createWaveform(PATTERN, 0))
    } else {
      @Suppress("DEPRECATION")
      current.vibrate(PATTERN, 0)
    }
  }

  fun stop() {
    val current = vibrator
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        manager?.cancel()
      }
      current?.cancel()
      // En Samsung/Xiaomi el waveform en loop a veces sigue hasta reemplazarlo.
      if (current != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        current.vibrate(VibrationEffect.createOneShot(1, VibrationEffect.DEFAULT_AMPLITUDE))
        current.cancel()
      }
    } catch (_: Exception) {
    } finally {
      vibrator = null
    }
  }

  private fun obtain(context: Context): Vibrator {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      val mgr = context.getSystemService(VibratorManager::class.java)
      manager = mgr
      mgr.defaultVibrator
    } else {
      @Suppress("DEPRECATION")
      context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
    }
  }
}
