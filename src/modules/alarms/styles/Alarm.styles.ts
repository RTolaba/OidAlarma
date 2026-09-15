import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const alarmStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  info: {
    flex: 1,
    gap: Spacing.one,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.two,
  },
  time: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: 600,
    fontVariant: ['tabular-nums'],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  actions: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  disabled: {
    opacity: 0.5,
  },
});

export const alarmsListStyles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  items: {
    gap: Spacing.two,
  },
});
