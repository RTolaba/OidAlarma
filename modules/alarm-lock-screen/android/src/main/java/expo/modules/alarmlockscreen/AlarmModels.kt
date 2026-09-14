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
) {
  fun toJson(): JSONObject =
    JSONObject()
      .put("id", id)
      .put("label", label)
      .put("hour", hour)
      .put("minute", minute)
      .put("days", JSONArray(days))
      .put("enabled", enabled)
      .put("smart", smart)

  fun nextTriggerAt(fromMillis: Long = System.currentTimeMillis()): Long {
    val from = Calendar.getInstance().apply { timeInMillis = fromMillis }
    val candidate = Calendar.getInstance().apply {
      timeInMillis = fromMillis
      set(Calendar.HOUR_OF_DAY, hour)
      set(Calendar.MINUTE, minute)
      set(Calendar.SECOND, 0)
      set(Calendar.MILLISECOND, 0)
    }

    if (days.isEmpty()) {
      if (candidate.timeInMillis <= from.timeInMillis) {
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
      if (next.timeInMillis > from.timeInMillis && days.contains(weekDay)) {
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
      )
    }

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
      )
    }
  }
}
