import { memo, useEffect, useMemo, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './ThemedText';

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 3;
const LOOP_COPIES = 3;
const PAD = (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2;

export type WheelPickerProps = {
  values: number[];
  value: number;
  onChange: (value: number) => void;
  label?: string;
  format?: (value: number) => string;
  accessibilityLabel: string;
  /** Repite la lista y salta al bloque del medio para dar la ilusión de rueda infinita. */
  loop?: boolean;
};

const defaultFormat = (item: number) => String(item).padStart(2, '0');

const WheelItem = memo(function WheelItem({
  label,
  selected,
  selectedColor,
  mutedColor,
}: {
  label: string;
  selected: boolean;
  selectedColor: string;
  mutedColor: string;
}) {
  return (
    <View style={styles.item}>
      <Text style={[styles.itemText, { color: selected ? selectedColor : mutedColor }]}>{label}</Text>
    </View>
  );
});

/**
 * Selector vertical tipo rueda con snap por item.
 * Usa ScrollView (no FlatList) para poder vivir dentro de otro scroll, como el PopUp.
 */
export function WheelPicker({
  values,
  value,
  onChange,
  label,
  format = defaultFormat,
  accessibilityLabel,
  loop = false,
}: WheelPickerProps) {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const skipNextValueScroll = useRef(false);
  const laidOut = useRef(false);
  const count = values.length;

  const displayValues = useMemo(() => {
    if (!loop || count === 0) return values;
    return Array.from({ length: LOOP_COPIES }, () => values).flat();
  }, [loop, values, count]);

  const offsetForValue = (val: number) => {
    const idx = Math.max(0, values.indexOf(val));
    return (loop ? count + idx : idx) * ITEM_HEIGHT;
  };

  const scrollToValue = (val: number) => {
    scrollRef.current?.scrollTo({ y: offsetForValue(val), animated: false });
  };

  useEffect(() => {
    if (!laidOut.current) return;
    if (skipNextValueScroll.current) {
      skipNextValueScroll.current = false;
      return;
    }
    scrollToValue(value);
  }, [value]);

  const emitIfChanged = (next: number) => {
    if (next === value) return;
    skipNextValueScroll.current = true;
    onChange(next);
  };

  const recenter = (y: number) => {
    if (!loop || count === 0) return y;
    const period = count * ITEM_HEIGHT;
    if (y < period) {
      const next = y + period;
      scrollRef.current?.scrollTo({ y: next, animated: false });
      return next;
    }
    if (y >= period * 2) {
      const next = y - period;
      scrollRef.current?.scrollTo({ y: next, animated: false });
      return next;
    }
    return y;
  };

  const handleSettle = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = recenter(event.nativeEvent.contentOffset.y);
    const rawIndex = Math.round(y / ITEM_HEIGHT);
    const logicalIndex = loop
      ? ((rawIndex % count) + count) % count
      : Math.min(count - 1, Math.max(0, rawIndex));
    const next = values[logicalIndex];
    if (next !== undefined) emitIfChanged(next);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!loop || count === 0) return;
    const y = event.nativeEvent.contentOffset.y;
    const period = count * ITEM_HEIGHT;
    if (y < period * 0.5 || y >= period * 2.5) {
      recenter(y);
    }
  };

  return (
    <View style={styles.container}>
      {label ? (
        <ThemedText type="label" themeColor="textTertiary">
          {label}
        </ThemedText>
      ) : null}
      <View style={styles.wheel}>
        <View
          pointerEvents="none"
          style={[styles.highlight, { backgroundColor: theme.backgroundSelected }]}
        />
        <ScrollView
          ref={scrollRef}
          nestedScrollEnabled
          accessibilityLabel={accessibilityLabel}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate={loop ? 'normal' : 'fast'}
          contentContainerStyle={styles.content}
          contentOffset={{ x: 0, y: offsetForValue(value) }}
          scrollEventThrottle={16}
          onLayout={() => {
            if (laidOut.current) return;
            laidOut.current = true;
            scrollToValue(value);
          }}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleSettle}
          onScrollEndDrag={handleSettle}>
          {displayValues.map((item, index) => (
            <WheelItem
              key={`${index}-${item}`}
              label={format(item)}
              selected={item === value}
              selectedColor={theme.text}
              mutedColor={theme.textTertiary}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  wheel: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: 78,
    justifyContent: 'center',
  },
  highlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderRadius: Spacing.three,
  },
  content: {
    paddingVertical: PAD,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 600,
    fontVariant: ['tabular-nums'],
  },
});
