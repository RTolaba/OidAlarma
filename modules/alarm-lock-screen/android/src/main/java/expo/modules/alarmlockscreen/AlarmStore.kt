package expo.modules.alarmlockscreen

import android.content.Context
import org.json.JSONArray

object AlarmStore {
  private const val PREFS = "oidalarma.alarm.lock"
  private const val KEY_ALARMS = "alarms"
  private const val KEY_PENDING = "pendingAlarmId"

  fun save(context: Context, alarms: List<StoredAlarm>) {
    val json = JSONArray()
    alarms.forEach { json.put(it.toJson()) }
    prefs(context).edit().putString(KEY_ALARMS, json.toString()).apply()
  }

  fun load(context: Context): List<StoredAlarm> {
    val raw = prefs(context).getString(KEY_ALARMS, null) ?: return emptyList()
    return try {
      val json = JSONArray(raw)
      buildList {
        for (index in 0 until json.length()) {
          add(StoredAlarm.fromJson(json.getJSONObject(index)))
        }
      }
    } catch (_: Exception) {
      emptyList()
    }
  }

  fun find(context: Context, alarmId: String): StoredAlarm? =
    load(context).firstOrNull { it.id == alarmId }

  /** Reescribe una alarma puntual sin tocar las demas. */
  fun update(context: Context, alarmId: String, transform: (StoredAlarm) -> StoredAlarm): StoredAlarm? {
    var updated: StoredAlarm? = null
    val alarms = load(context).map { alarm ->
      if (alarm.id != alarmId) alarm else transform(alarm).also { updated = it }
    }
    if (updated != null) save(context, alarms)
    return updated
  }

  fun setSnooze(context: Context, alarmId: String, until: Long) =
    update(context, alarmId) { it.copy(snoozeUntil = until) }

  fun clearSnooze(context: Context, alarmId: String) =
    update(context, alarmId) { it.copy(snoozeUntil = 0L) }

  fun setPending(context: Context, alarmId: String?) {
    prefs(context).edit().putString(KEY_PENDING, alarmId).apply()
  }

  fun peekPending(context: Context): String? = prefs(context).getString(KEY_PENDING, null)

  private fun prefs(context: Context) = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
}
