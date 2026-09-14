import { StyleSheet } from 'react-native';

import { Layout, Spacing } from '@/constants/theme';

export const clockStyles = StyleSheet.create({
  card: {
    minHeight: Layout.clockCardHeight,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.three,
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.one,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  hours: {
    fontSize: 64,
    lineHeight: 68,
    fontWeight: 200,
    fontVariant: ['tabular-nums'],
  },
  seconds: {
    fontSize: 24,
    lineHeight: 34,
    fontWeight: 300,
    fontVariant: ['tabular-nums'],
    marginLeft: Spacing.one,
  },
  period: {
    marginLeft: Spacing.one,
    marginBottom: Spacing.two,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  temperatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  temperature: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 600,
  },
  city: {
    textAlign: 'right',
  },
  switches: {
    alignItems: 'flex-end',
    gap: Spacing.two,
  },
});
