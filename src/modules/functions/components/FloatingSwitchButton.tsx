import { Pressable } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/hooks/use-theme';

import { functionsStyles as styles } from '../styles/Functions.styles';

export type FloatingSwitchButtonProps = {
  label: string;
  icon: IconName;
  onPress: () => void;
};

/** Boton flotante para saltar a la otra funcion mientras una esta expandida. */
export function FloatingSwitchButton({ label, icon, onPress }: FloatingSwitchButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.floating,
        { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
      ]}>
      <Icon name={icon} size={18} color={theme.accentText} />
      <ThemedText type="smallBold" style={{ color: theme.accentText }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}
