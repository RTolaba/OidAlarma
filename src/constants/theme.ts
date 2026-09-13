/**
 * Design tokens compartidos por toda la app.
 * Los colores estan definidos para light y dark mode.
 */

import '@/global.css';

import { Platform } from 'react-native';

/**
 * La marca sale del logo: morado profundo como color primario y dorado como
 * secundario (bordes, detalles, estados seleccionados).
 */
export const Brand = {
  purple: '#170D38',
  purpleLight: '#2C1E4D',
  gold: '#D5AD74',
} as const;

export const Colors = {
  light: {
    text: '#170D38',
    textSecondary: '#5A4E7C',
    textTertiary: '#8A80A8',
    background: '#F7F4EE',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#EDE7F9',
    border: '#E3DCF1',
    accent: '#4B3391',
    accentSoft: '#EDE7FB',
    accentText: '#FFFFFF',
    secondary: '#9A6E24',
    secondarySoft: '#FAF0DC',
    danger: '#C4302F',
    dangerSoft: '#FBE7E6',
    success: '#1F7A52',
    successSoft: '#E2F3EA',
    warning: '#9A6E24',
    warningSoft: '#FAF0DC',
    overlay: 'rgba(23, 13, 56, 0.4)',
  },
  dark: {
    text: '#F4EFE6',
    textSecondary: '#B7A9D6',
    textTertiary: '#8477A8',
    background: '#120A2E',
    backgroundElement: '#1D1140',
    backgroundSelected: '#2C1E4D',
    border: '#33215A',
    accent: '#7C5AD6',
    accentSoft: '#251650',
    accentText: '#FFFFFF',
    secondary: '#D5AD74',
    secondarySoft: '#2E2242',
    danger: '#FF7B7F',
    dangerSoft: '#3B1730',
    success: '#5BD69B',
    successSoft: '#132E33',
    warning: '#F0B95C',
    warningSoft: '#31254A',
    overlay: 'rgba(9, 5, 22, 0.7)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type Theme = (typeof Colors)['light'];

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 8,
  medium: 14,
  large: 22,
  pill: 999,
} as const;

export const Layout = {
  /** Margen horizontal de todos los containers de screen. */
  screenPadding: 5,
  /** Alto de la card principal del reloj. */
  clockCardHeight: 180,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
