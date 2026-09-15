package expo.modules.alarmlockscreen

import android.content.Context
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.net.Uri
import android.util.Log

object AlarmSound {
  private const val TAG = "AlarmSound"

  private var player: MediaPlayer? = null

  fun rawName(ringtone: String?): String =
    when (ringtone) {
      "hip_hop_news", "hip-hop-news" -> "hip_hop_news"
      else -> "ring_rock"
    }

  /**
   * Los mp3 los copia el config plugin a `res/raw` de la app, asi que se
   * resuelven por nombre y no por la clase R de este modulo.
   */
  fun uri(context: Context, ringtone: String?): Uri {
    val resId = context.resources.getIdentifier(rawName(ringtone), "raw", context.packageName)
    if (resId != 0) {
      return Uri.parse("android.resource://${context.packageName}/$resId")
    }

    Log.w(TAG, "No se encontro el tono ${rawName(ringtone)}; se usa el del sistema")
    return RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
      ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
  }

  fun start(context: Context, ringtone: String?) {
    if (player?.isPlaying == true) return
    stop()
    try {
      val attributes = AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_ALARM)
        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
        .build()
      player = MediaPlayer().apply {
        setAudioAttributes(attributes)
        setDataSource(context.applicationContext, uri(context, ringtone))
        isLooping = true
        prepare()
        start()
      }
    } catch (error: Exception) {
      Log.e(TAG, "No se pudo reproducir la alarma", error)
      player = null
    }
  }

  fun stop() {
    try {
      player?.stop()
    } catch (_: Exception) {
    }
    player?.release()
    player = null
  }
}
