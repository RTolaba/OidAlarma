import { StyleSheet } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';

export const newAlarmStyles = StyleSheet.create({
  smartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.two + 2,
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
  },
  smartTexts: {
    flex: 1,
    gap: Spacing.half,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    padding: Spacing.two + 2,
    borderRadius: Radius.medium,
  },
  disclaimerText: {
    flex: 1,
  },
});
