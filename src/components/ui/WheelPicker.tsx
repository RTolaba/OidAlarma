import { useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './ThemedText';

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 3;

export type WheelPickerProps = {
  values: number[];
  value: number;
  onChange: (value: number) => void;
  label?: string;
  format?: (value: number) => string;
  accessibilityLabel: string;
};

/**
 * Selector vertical tipo rueda con snap por item.
 */
export function WheelPicker({
  values,
  value,
  onChange,
  label,
  format = (item) => String(item).padStart(2, '0'),
  accessibilityLabel,
}: WheelPickerProps) {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const selectedIndex = Math.max(0, values.indexOf(value));

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: selectedIndex * ITEM_HEIGHT, animated: false });
  }, [selectedIndex]);

  const handleSettle = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const next = values[Math.min(values.length - 1, Math.max(0, index))];
    if (next !== undefined && next !== value) onChange(next);
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
          decelerationRate="fast"
          contentContainerStyle={styles.content}
          onMomentumScrollEnd={handleSettle}
          onScrollEndDrag={handleSettle}>
          {values.map((item) => (
            <View key={item} style={styles.item}>
              <ThemedText
                type="subtitle"
                themeColor={item === value ? 'text' : 'textTertiary'}
                style={styles.itemText}>
                {format(item)}
              </ThemedText>
            </View>
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
    paddingVertical: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontVariant: ['tabular-nums'],
  },
});
