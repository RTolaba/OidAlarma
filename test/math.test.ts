import { createMathProblem, createMathProblems } from '@/modules/alarms/utils/math';

/** Evalua el enunciado para comprobar que `answer` no miente. */
function solve(statement: string) {
  const [left, operator, right] = statement.split(' ');
  const a = Number(left);
  const b = Number(right);

  if (operator === '+') return a + b;
  if (operator === '-') return a - b;
  if (operator === '×') return a * b;
  throw new Error(`Operador desconocido: ${operator}`);
}

describe('createMathProblem', () => {
  // El ejercicio es aleatorio, asi que en vez de fijar un resultado se
  // comprueban las propiedades que siempre tienen que valer. Se repite
  // muchas veces para cubrir las tres ramas del random.
  const problems = Array.from({ length: 300 }, () => createMathProblem());

  it('siempre declara la respuesta correcta', () => {
    problems.forEach((problem) => {
      expect(problem.answer).toBe(solve(problem.statement));
    });
  });

  it('nunca da un resultado negativo', () => {
    // Medio dormido, restar en negativo es innecesariamente cruel.
    problems.forEach((problem) => {
      expect(problem.answer).toBeGreaterThanOrEqual(0);
    });
  });

  it('usa solo suma, resta y producto', () => {
    const operators = new Set(problems.map((problem) => problem.statement.split(' ')[1]));

    expect([...operators].sort()).toEqual(['+', '-', '×']);
  });
});

describe('createMathProblems', () => {
  it('devuelve la cantidad pedida', () => {
    expect(createMathProblems(3)).toHaveLength(3);
  });
});
