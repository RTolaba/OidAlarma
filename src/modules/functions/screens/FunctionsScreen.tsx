import { useState } from 'react';
import { View } from 'react-native';

import { ScreenContainer } from '@/components/ui/ScreenContainer';

import { FloatingSwitchButton } from '../components/FloatingSwitchButton';
import { Stopwatch } from '../components/Stopwatch';
import { Timer } from '../components/Timer';
import { functionsStyles as styles } from '../styles/Functions.styles';

type Section = 'timer' | 'stopwatch';

export function FunctionsScreen() {
  const [expanded, setExpanded] = useState<Section | null>(null);

  const toggle = (section: Section) => setExpanded(expanded === section ? null : section);
  const showTimer = expanded === null || expanded === 'timer';
  const showStopwatch = expanded === null || expanded === 'stopwatch';

  return (
    <ScreenContainer>
      <View style={styles.panels}>
        {showTimer ? (
          <Timer
            expanded={expanded === 'timer'}
            onToggleExpanded={() => toggle('timer')}
            onExpand={() => setExpanded('timer')}
          />
        ) : null}

        {showStopwatch ? (
          <Stopwatch
            expanded={expanded === 'stopwatch'}
            onToggleExpanded={() => toggle('stopwatch')}
            onExpand={() => setExpanded('stopwatch')}
          />
        ) : null}
      </View>

      {expanded ? (
        <FloatingSwitchButton
          label={expanded === 'timer' ? 'Cronómetro' : 'Temporizador'}
          icon={expanded === 'timer' ? 'stopwatch' : 'hourglass'}
          onPress={() => setExpanded(expanded === 'timer' ? 'stopwatch' : 'timer')}
        />
      ) : null}
    </ScreenContainer>
  );
}
