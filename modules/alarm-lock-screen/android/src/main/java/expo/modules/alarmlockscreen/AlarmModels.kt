package expo.modules.alarmlockscreen

import org.json.JSONArray
import org.json.JSONObject
import java.util.Calendar

data class StoredAlarm(
  val id: String,
  val label: String,
  val hour: Int,
  val minute: Int,
  val days: List<Int>,
  val enabled: Boolean,
  val smart: Boolean,
  val ringtone: String,
  /** Epoch ms del aplazamiento vigente. 0 = sin snooze. Vive solo en nativo. */
  val snoozeUntil: Long = 0L,
) {
  val isOneShot: Boolean get() = days.isEmpty()

  fun hasActiveSnooze(fromMillis: Long = System.currentTimeMillis()) = snoozeUntil > fromMillis

  fun toJson(): JSONObject =
    JSONObject()
      .put("id", id)
      .put("label", label)
      .put("hour", hour)
      .put("minute", minute)
      .put("days", JSONArray(days))
      .put("enabled", enabled)
      .put("smart", smart)
      .put("ringtone", ringtone)
      .put("snoozeUntil", snoozeUntil)

  /** Forma que cruza el puente hacia JS. Los epoch van como Double. */
  fun toMap(): Map<String, Any?> =
    mapOf(
      "id" to id,
      "label" to label,
      "hour" to hour,
      "minute" to minute,
      "days" to days,
      "enabled" to enabled,
      "smart" to smart,
      "ringtone" to ringtone,
      "snoozeUntil" to snoozeUntil.toDouble(),
    )

  /**
   * Proximo disparo. Un snooze vigente gana sobre el horario configurado,
   * asi el aplazamiento sobrevive a un sync o a un reboot.
   */
  fun nextTriggerAt(fromMillis: Long = System.currentTimeMillis()): Long {
    if (hasActiveSnooze(fromMillis)) return snoozeUntil

    val candidate = Calendar.getInstance().apply {
      timeInMillis = fromMillis
      set(Calendar.HOUR_OF_DAY, hour)
      set(Calendar.MINUTE, minute)
      set(Calendar.SECOND, 0)
      set(Calendar.MILLISECOND, 0)
    }

    if (days.isEmpty()) {
      if (candidate.timeInMillis <= fromMillis) {
        candidate.add(Calendar.DAY_OF_YEAR, 1)
      }
      return candidate.timeInMillis
    }

    for (offset in 0..7) {
      val next = Calendar.getInstance().apply {
        timeInMillis = fromMillis
        add(Calendar.DAY_OF_YEAR, offset)
        set(Calendar.HOUR_OF_DAY, hour)
        set(Calendar.MINUTE, minute)
        set(Calendar.SECOND, 0)
        set(Calendar.MILLISECOND, 0)
      }
      val weekDay = next.get(Calendar.DAY_OF_WEEK) - 1
      if (next.timeInMillis > fromMillis && days.contains(weekDay)) {
        return next.timeInMillis
      }
    }

    return candidate.timeInMillis
  }

  companion object {
    fun fromJson(json: JSONObject): StoredAlarm {
      val daysJson = json.optJSONArray("days") ?: JSONArray()
      val days = buildList {
        for (index in 0 until daysJson.length()) {
          add(daysJson.getInt(index))
        }
      }
      return StoredAlarm(
        id = json.getString("id"),
        label = json.optString("label"),
        hour = json.getInt("hour"),
        minute = json.getInt("minute"),
        days = days,
        enabled = json.optBoolean("enabled", true),
        smart = json.optBoolean("smart", false),
        ringtone = json.optString("ringtone", "ring_rock").ifBlank { "ring_rock" },
        snoozeUntil = json.optLong("snoozeUntil", 0L),
      )
    }

    /** Lo que manda JS. Nunca trae snoozeUntil: ese dato es solo nativo. */
    fun fromMap(map: Map<String, Any?>): StoredAlarm {
      val rawDays = map["days"]
      val days = when (rawDays) {
        is List<*> -> rawDays.mapNotNull { (it as? Number)?.toInt() }
        else -> emptyList()
      }
      return StoredAlarm(
        id = map["id"] as String,
        label = map["label"] as? String ?: "",
        hour = (map["hour"] as Number).toInt(),
        minute = (map["minute"] as Number).toInt(),
        days = days,
        enabled = map["enabled"] as? Boolean ?: true,
        smart = map["smart"] as? Boolean ?: false,
        ringtone = map["ringtone"] as? String ?: "ring_rock",
      )
    }

    /**
     * Fusiona lo que llega de JS con lo que solo sabe nativo. JS manda en
     * horario/label/tono; nativo manda en el snooze vigente.
     */
    fun merge(
      incoming: List<StoredAlarm>,
      previous: List<StoredAlarm>,
      fromMillis: Long = System.currentTimeMillis(),
    ): List<StoredAlarm> {
      val bySavedId = previous.associateBy { it.id }
      return incoming.map { alarm ->
        val saved = bySavedId[alarm.id]?.snoozeUntil ?: 0L
        alarm.copy(snoozeUntil = if (saved > fromMillis) saved else 0L)
      }
    }
  }
}
