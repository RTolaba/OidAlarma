package expo.modules.alarmlockscreen

import kotlin.random.Random

/**
 * Misma regla que `src/modules/alarms/utils/math.ts`: tres cuentas de
 * suma, resta o producto. Si cambian los rangos allá, cambian acá.
 */
object AlarmMath {
  const val TOTAL_PROBLEMS = 3

  data class Problem(val statement: String, val answer: Int)

  fun createProblem(random: Random = Random.Default): Problem =
    when (random.nextInt(0, 3)) {
      0 -> {
        val a = random.nextInt(11, 50)
        val b = random.nextInt(11, 50)
        Problem("$a + $b", a + b)
      }
      1 -> {
        val a = random.nextInt(20, 81)
        val b = random.nextInt(5, 20)
        Problem("$a - $b", a - b)
      }
      else -> {
        val a = random.nextInt(3, 10)
        val b = random.nextInt(3, 13)
        Problem("$a × $b", a * b)
      }
    }

  fun createProblems(count: Int = TOTAL_PROBLEMS, random: Random = Random.Default): List<Problem> =
    List(count.coerceAtLeast(1)) { createProblem(random) }

  fun isCorrect(problem: Problem, input: String): Boolean =
    input.trim().toIntOrNull() == problem.answer
}
