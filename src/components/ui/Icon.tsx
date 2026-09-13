import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { StyleProp, TextStyle } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type GlyphName = keyof typeof MaterialCommunityIcons.glyphMap;

/**
 * Mapa semantico -> glifo. Centralizarlo permite cambiar de set de iconos
 * sin tocar las pantallas.
 */
const GLYPHS = {
  alarm: 'alarm',
  alarmOff: 'alarm-off',
  alarmPlus: 'alarm-plus',
  appearance: 'theme-light-dark',
  brain: 'brain',
  calendar: 'calendar-blank-outline',
  check: 'check',
  checkAll: 'check-all',
  checkCircle: 'check-circle',
  chevronDown: 'chevron-down',
  chevronLeft: 'chevron-left',
  chevronRight: 'chevron-right',
  clock: 'clock-outline',
  close: 'close',
  delete: 'trash-can-outline',
  flag: 'flag-outline',
  flash: 'flash',
  hourglass: 'timer-sand',
  info: 'information-outline',
  lap: 'flag-checkered',
  moon: 'weather-night',
  music: 'music-note',
  minus: 'minus',
  pause: 'pause',
  play: 'play',
  plus: 'plus',
  pomodoro: 'timer-sand-complete',
  power: 'power-plug',
  reset: 'restart',
  sparkles: 'auto-fix',
  stop: 'stop',
  stopwatch: 'timer-outline',
  sun: 'white-balance-sunny',
  target: 'target',
  tasks: 'checkbox-marked-circle-outline',
  temperature: 'thermometer',
  timer: 'timer-sand',
  wifi: 'wifi',
  wifiOff: 'wifi-off',
} as const satisfies Record<string, GlyphName>;

export type IconName = keyof typeof GLYPHS;

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  themeColor?: ThemeColor;
  style?: StyleProp<TextStyle>;
};

export function Icon({ name, size = 20, color, themeColor = 'text', style }: IconProps) {
  const theme = useTheme();

  return (
    <MaterialCommunityIcons
      name={GLYPHS[name]}
      size={size}
      color={color ?? theme[themeColor]}
      style={style}
    />
  );
}
