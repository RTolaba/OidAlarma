import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Icon, type IconName } from './Icon';
import { ThemedText } from './ThemedText';

export type EmptyStateProps = {
  icon?: IconName;
  title: string;
  description?: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { borderColor: theme.border }]}>
      {icon ? <Icon name={icon} size={28} themeColor="textTertiary" /> : null}
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.text}>
        {title}
      </ThemedText>
      {description ? (
        <ThemedText type="small" themeColor="textTertiary" style={styles.text}>
          {description}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.large,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
  },
  text: {
    textAlign: 'center',
  },
});
