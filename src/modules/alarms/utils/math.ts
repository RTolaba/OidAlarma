export type MathProblem = {
  statement: string;
  answer: number;
};

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Ejercicio simple pensado para despertar, no para complicar. */
export function createMathProblem(): MathProblem {
  const operation = randomInt(0, 2);

  if (operation === 0) {
    const a = randomInt(11, 49);
    const b = randomInt(11, 49);
    return { statement: `${a} + ${b}`, answer: a + b };
  }

  if (operation === 1) {
    const a = randomInt(20, 80);
    const b = randomInt(5, 19);
    return { statement: `${a} - ${b}`, answer: a - b };
  }

  const a = randomInt(3, 9);
  const b = randomInt(3, 12);
  return { statement: `${a} × ${b}`, answer: a * b };
}

export function createMathProblems(count: number) {
  return Array.from({ length: count }, createMathProblem);
}
