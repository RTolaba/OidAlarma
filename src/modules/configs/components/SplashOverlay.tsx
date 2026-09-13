import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const DURATION = 600;
const BACKGROUND = '#170D38';

const fadeOut = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  30: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: 1.15 }], easing: Easing.out(Easing.quad) },
});

/**
 * Mantiene el splash nativo en pantalla hasta que la app monta y despues lo
 * disuelve, para que no se vea el salto entre el splash y la primera screen.
 */
export function SplashOverlay() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(Platform.OS !== 'web');

  if (!isVisible) return null;

  const logo = <Image style={styles.logo} source={require('@/assets/images/splash-icon.png')} />;

  if (!isAnimating) {
    return (
      <View
        style={styles.overlay}
        onLayout={() => {
          SplashScreen.hideAsync().finally(() => setIsAnimating(true));
        }}>
        {logo}
      </View>
    );
  }

  return (
    <Animated.View
      style={styles.overlay}
      entering={fadeOut.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) scheduleOnRN(setIsVisible, false);
      })}>
      {logo}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  logo: {
    width: 200,
    height: 200,
  },
});
