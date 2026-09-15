import { StyleSheet } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';

export const functionsStyles = StyleSheet.create({
  panels: {
    flex: 1,
    gap: Spacing.three,
  },
  panel: {
    flex: 1,
    justifyContent: 'center',
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  panelTitle: {
    flex: 1,
  },
  panelBody: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  display: {
    fontSize: 56,
    lineHeight: 62,
    fontWeight: 200,
    fontVariant: ['tabular-nums'],
  },
  displayLarge: {
    fontSize: 72,
    lineHeight: 78,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  wheels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  laps: {
    alignSelf: 'stretch',
    gap: Spacing.one,
    maxHeight: 220,
  },
  lapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.small,
  },
  floating: {
    position: 'absolute',
    right: Spacing.three,
    bottom: Spacing.six,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
});
