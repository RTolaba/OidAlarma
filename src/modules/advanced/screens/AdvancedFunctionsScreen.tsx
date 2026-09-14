import { View } from 'react-native';

import { Divider } from '@/components/ui/Divider';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';

import { PomodoroSection } from '../components/PomodoroSection';
import { TriggersSection } from '../components/TriggersSection';
import { advancedStyles as styles } from '../styles/Advanced.styles';

export function AdvancedFunctionsScreen() {
  return (
    <ScreenContainer scroll gap={24}>
      <View style={styles.intro}>
        <ThemedText type="title">Avanzado</ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Funciones que se salen del reloj clásico: avisos que dependen del estado del dispositivo
          y ciclos de trabajo enfocado.
        </ThemedText>
      </View>

      <Divider />

      <TriggersSection />

      <Divider />

      <PomodoroSection />
    </ScreenContainer>
  );
}
