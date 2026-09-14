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
    val json = JSONArray(raw)
    return buildList {
      for (index in 0 until json.length()) {
        add(StoredAlarm.fromJson(json.getJSONObject(index)))
      }
    }
  }

  fun setPending(context: Context, alarmId: String?) {
    prefs(context).edit().putString(KEY_PENDING, alarmId).apply()
  }

  fun consumePending(context: Context): String? {
    val id = prefs(context).getString(KEY_PENDING, null)
    if (id != null) {
      prefs(context).edit().remove(KEY_PENDING).apply()
    }
    return id
  }

  fun peekPending(context: Context): String? = prefs(context).getString(KEY_PENDING, null)

  private fun prefs(context: Context) = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
}
