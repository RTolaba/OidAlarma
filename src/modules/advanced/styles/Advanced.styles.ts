import { StyleSheet } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';

export const advancedStyles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  intro: {
    gap: Spacing.two,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  triggerTexts: {
    flex: 1,
    gap: Spacing.half,
  },
  triggerActions: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  kindOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.two + 2,
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
  },
  kindTexts: {
    flex: 1,
    gap: Spacing.half,
  },
  pomodoroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  pomodoroTexts: {
    flex: 1,
    gap: Spacing.half,
  },
});

export const pomodoroStyles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  display: {
    fontSize: 72,
    lineHeight: 78,
    fontWeight: 200,
    fontVariant: ['tabular-nums'],
  },
  rounds: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: Radius.pill,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  config: {
    gap: Spacing.three,
  },
  configRow: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one + 2,
  },
});
