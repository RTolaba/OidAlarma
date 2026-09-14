import { StyleSheet } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';

/** Lado del triangulo que simula la esquina doblada. */
export const FOLD_SIZE = 30;

export const taskStyles = StyleSheet.create({
  card: {
    borderRadius: Radius.large,
    borderTopRightRadius: 0,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  /** Recorta la esquina pintandola con el color de fondo de la pantalla. */
  foldCut: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderTopWidth: FOLD_SIZE,
    borderLeftWidth: FOLD_SIZE,
    borderLeftColor: 'transparent',
  },
  /** Solapa doblada, apenas mas oscura que la card. */
  foldFlap: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderBottomWidth: FOLD_SIZE,
    borderRightWidth: FOLD_SIZE,
    borderRightColor: 'transparent',
  },
  pressed: {
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    paddingRight: FOLD_SIZE,
  },
  title: {
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
});

export const tasksListStyles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  items: {
    gap: Spacing.three,
  },
});
