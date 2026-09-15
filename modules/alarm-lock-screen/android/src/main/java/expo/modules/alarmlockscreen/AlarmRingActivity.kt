package expo.modules.alarmlockscreen

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.os.Build
import android.os.Bundle
import android.text.InputType
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView

/**
 * Unica UI de alarma sonando en Android. Se dibuja sobre el bloqueo y no
 * depende de que el proceso de React Native este vivo.
 *
 * Reglas: atras no apaga, un toque fuera de los botones tampoco, y si la
 * alarma es `smart` solo se apaga resolviendo las cuentas. Aplazar siempre
 * esta disponible para no dejar a nadie encerrado.
 */
class AlarmRingActivity : Activity() {
  private companion object {
    const val BACKGROUND = "#170D38"
    const val ACCENT = "#D5AD74"
    const val PRIMARY = "#4B3391"
  }

  private var alarmId: String? = null
  private var handled = false

  private var problems: List<AlarmMath.Problem> = emptyList()
  private var solved = 0

  override fun onCreate(savedInstanceState: Bundle?) {
    showOverLock()
    super.onCreate(savedInstanceState)
    setFinishOnTouchOutside(false)
    present(intent)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    showOverLock()
    present(intent)
  }

  /** Atras no puede ser un atajo para apagar la alarma. */
  @Deprecated("Deprecated in Java")
  override fun onBackPressed() = Unit

  private fun present(intent: Intent) {
    handled = false
    solved = 0
    alarmId = intent.getStringExtra(NativeAlarmScheduler.EXTRA_ALARM_ID)

    val alarm = alarmId?.let { AlarmStore.find(this, it) }
    if (alarm != null) AlarmSound.start(this, alarm.ringtone)

    problems = if (alarm?.smart == true) AlarmMath.createProblems() else emptyList()
    setContentView(if (alarm?.smart == true) buildSmartLayout(alarm) else buildSimpleLayout(alarm))
  }

  private fun showOverLock() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      setShowWhenLocked(true)
      setTurnScreenOn(true)
    }
    @Suppress("DEPRECATION")
    window.addFlags(
      WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON,
    )
  }

  private fun buildSimpleLayout(alarm: StoredAlarm?): View {
    val root = rootColumn()
    root.addView(timeLabel(alarm))
    root.addView(titleLabel(alarm))
    root.addView(primaryButton("Apagar alarma") { dismissAlarm() }, buttonParams())
    root.addView(snoozeButton(), buttonParams())
    return root
  }

  private fun buildSmartLayout(alarm: StoredAlarm?): View {
    val root = rootColumn()

    val progress = TextView(this).apply {
      setTextColor(Color.parseColor(ACCENT))
      setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
      gravity = Gravity.CENTER
    }
    val statement = TextView(this).apply {
      setTextColor(Color.WHITE)
      setTextSize(TypedValue.COMPLEX_UNIT_SP, 34f)
      typeface = Typeface.DEFAULT_BOLD
      gravity = Gravity.CENTER
      setPadding(0, dp(8), 0, dp(16))
    }
    val input = EditText(this).apply {
      inputType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_SIGNED
      hint = "Resultado"
      gravity = Gravity.CENTER
      setTextColor(Color.WHITE)
      setHintTextColor(Color.parseColor("#8F86B5"))
      setTextSize(TypedValue.COMPLEX_UNIT_SP, 22f)
    }
    val error = TextView(this).apply {
      text = "No es correcto, probá de nuevo."
      setTextColor(Color.parseColor("#E5484D"))
      setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
      gravity = Gravity.CENTER
      visibility = View.INVISIBLE
    }

    fun renderProblem() {
      progress.text = "Ejercicio ${solved + 1} de ${problems.size}"
      statement.text = problems[solved].statement
      input.setText("")
    }

    val check = primaryButton("Comprobar") {
      if (!AlarmMath.isCorrect(problems[solved], input.text.toString())) {
        error.visibility = View.VISIBLE
        input.setText("")
        return@primaryButton
      }

      error.visibility = View.INVISIBLE
      solved += 1
      if (solved >= problems.size) dismissAlarm() else renderProblem()
    }

    renderProblem()

    root.addView(timeLabel(alarm))
    root.addView(titleLabel(alarm))
    root.addView(progress)
    root.addView(statement)
    root.addView(input, buttonParams())
    root.addView(error, buttonParams())
    root.addView(check, buttonParams())
    root.addView(snoozeButton(), buttonParams())
    return root
  }

  private fun rootColumn() = LinearLayout(this).apply {
    orientation = LinearLayout.VERTICAL
    gravity = Gravity.CENTER
    setBackgroundColor(Color.parseColor(BACKGROUND))
    setPadding(dp(24), dp(24), dp(24), dp(24))
  }

  private fun timeLabel(alarm: StoredAlarm?) = TextView(this).apply {
    text = if (alarm == null) "--:--" else "%02d:%02d".format(alarm.hour, alarm.minute)
    setTextColor(Color.WHITE)
    setTextSize(TypedValue.COMPLEX_UNIT_SP, 56f)
    typeface = Typeface.DEFAULT_BOLD
    gravity = Gravity.CENTER
  }

  private fun titleLabel(alarm: StoredAlarm?) = TextView(this).apply {
    text = alarm?.label?.ifBlank { "Alarma" } ?: "Alarma"
    setTextColor(Color.parseColor(ACCENT))
    setTextSize(TypedValue.COMPLEX_UNIT_SP, 22f)
    gravity = Gravity.CENTER
    setPadding(0, dp(8), 0, dp(24))
  }

  private fun primaryButton(label: String, onClick: () -> Unit) = Button(this).apply {
    text = label
    setBackgroundColor(Color.parseColor(PRIMARY))
    setTextColor(Color.WHITE)
    setOnClickListener { onClick() }
  }

  private fun snoozeButton() = Button(this).apply {
    text = "Aplazar ${NativeAlarmScheduler.SNOOZE_MINUTES} min"
    setBackgroundColor(Color.parseColor(ACCENT))
    setTextColor(Color.parseColor(BACKGROUND))
    setOnClickListener { snoozeAlarm() }
  }

  private fun buttonParams() = LinearLayout.LayoutParams(
    LinearLayout.LayoutParams.MATCH_PARENT,
    LinearLayout.LayoutParams.WRAP_CONTENT,
  ).apply { topMargin = dp(12) }

  private fun dismissAlarm() = finishWith("dismiss") { id ->
    NativeAlarmScheduler.disableOneShot(this, id)
  }

  private fun snoozeAlarm() = finishWith("snooze") { id ->
    NativeAlarmScheduler.snooze(this, id)
  }

  private fun finishWith(action: String, apply: (String) -> Unit) {
    if (handled) return
    handled = true

    val id = alarmId
    AlarmPresenter.dismiss(this)
    AlarmStore.setPending(this, null)
    if (id != null) apply(id)
    AlarmLockScreenModule.emitHandled(id, action)

    finishAndRemoveTask()
  }

  private fun dp(value: Int): Int =
    TypedValue.applyDimension(
      TypedValue.COMPLEX_UNIT_DIP,
      value.toFloat(),
      resources.displayMetrics,
    ).toInt()
}
