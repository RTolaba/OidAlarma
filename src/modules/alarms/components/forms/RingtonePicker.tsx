import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { ThemedText } from '@/components/ui/ThemedText';
import { Spacing } from '@/constants/theme';

import { RINGTONE_IDS, RINGTONES, type RingtoneId } from '../../utils/ringtones';

export type RingtonePickerProps = {
  value: RingtoneId;
  onChange: (id: RingtoneId) => void;
};

export function RingtonePicker({ value, onChange }: RingtonePickerProps) {
  const playerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    return () => {
      playerRef.current?.release();
      playerRef.current = null;
    };
  }, []);

  const select = (id: RingtoneId) => {
    onChange(id);
    const source = RINGTONES[id].source;
    if (!playerRef.current) {
      playerRef.current = createAudioPlayer(source);
    } else {
      playerRef.current.replace(source);
    }
    playerRef.current.play();
  };

  return (
    <View style={styles.container}>
      <ThemedText type="label" themeColor="textSecondary">
        Tono
      </ThemedText>
      <View style={styles.row}>
        {RINGTONE_IDS.map((id) => (
          <Chip
            key={id}
            label={RINGTONES[id].label}
            icon="music"
            tone="secondary"
            selected={value === id}
            onPress={() => select(id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one + 2,
  },
});
