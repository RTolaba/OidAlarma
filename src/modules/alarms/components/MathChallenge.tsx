import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { ThemedText } from '@/components/ui/ThemedText';
import { Spacing } from '@/constants/theme';

import { createMathProblems } from '../utils/math';

const TOTAL_PROBLEMS = 3;

export type MathChallengeProps = {
  onSolved: () => void;
};

/**
 * Bloquea el apagado de la alarma hasta resolver varios ejercicios seguidos.
 */
export function MathChallenge({ onSolved }: MathChallengeProps) {
  const [problems, setProblems] = useState(() => createMathProblems(TOTAL_PROBLEMS));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [failed, setFailed] = useState(false);

  const problem = problems[index];

  const check = () => {
    if (Number(input) !== problem.answer) {
      setFailed(true);
      setInput('');
      return;
    }

    setFailed(false);
    setInput('');

    if (index + 1 >= problems.length) {
      onSolved();
      return;
    }

    setIndex(index + 1);
  };

  const restart = () => {
    setProblems(createMathProblems(TOTAL_PROBLEMS));
    setIndex(0);
    setInput('');
    setFailed(false);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="label" themeColor="textSecondary" style={styles.centered}>
        Ejercicio {index + 1} de {problems.length}
      </ThemedText>
      <ThemedText type="title" style={styles.centered}>
        {problem.statement}
      </ThemedText>

      <TextField
        value={input}
        onChangeText={setInput}
        keyboardType="number-pad"
        placeholder="Resultado"
        autoFocus
        onSubmitEditing={check}
        returnKeyType="done"
      />

      {failed ? (
        <ThemedText type="small" themeColor="danger" style={styles.centered}>
          No es correcto, probá de nuevo.
        </ThemedText>
      ) : null}

      <View style={styles.actions}>
        <Button label="Comprobar" icon="check" fullWidth onPress={check} disabled={input === ''} />
        <Button label="Otros ejercicios" variant="ghost" size="small" onPress={restart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  centered: {
    textAlign: 'center',
  },
  actions: {
    gap: Spacing.two,
    alignItems: 'center',
  },
});
