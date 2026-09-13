import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type DividerProps = {
  vertical?: boolean;
};

export function Divider({ vertical = false }: DividerProps) {
  const theme = useTheme();

  return (
    <View
      style={[vertical ? styles.vertical : styles.horizontal, { backgroundColor: theme.border }]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
});
