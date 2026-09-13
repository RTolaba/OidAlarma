import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { IconButton } from './IconButton';
import { ThemedText } from './ThemedText';

export type PopUpProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Contenido fijo al pie del modal (acciones, disclaimers). */
  footer?: ReactNode;
};

/**
 * Modal base anclado al fondo de la pantalla, con header y footer opcionales.
 * Respeta la barra de navegación y sube con el teclado.
 */
export function PopUp({ visible, onClose, title, subtitle, children, footer }: PopUpProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: theme.overlay }]}>
        <Pressable style={styles.backdropTouchable} onPress={onClose} accessibilityLabel="Cerrar" />
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}>
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.background,
                paddingBottom: Math.max(insets.bottom, Spacing.three) + Spacing.two,
              },
            ]}>
            <View style={styles.header}>
              <View style={styles.headerTexts}>
                <ThemedText type="section">{title}</ThemedText>
                {subtitle ? (
                  <ThemedText type="small" themeColor="textSecondary">
                    {subtitle}
                  </ThemedText>
                ) : null}
              </View>
              <IconButton name="close" accessibilityLabel="Cerrar" onPress={onClose} />
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              automaticallyAdjustKeyboardInsets
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.body}>
              {children}
            </ScrollView>

            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    maxHeight: '92%',
    borderTopLeftRadius: Radius.large,
    borderTopRightRadius: Radius.large,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  headerTexts: {
    flex: 1,
    gap: Spacing.half,
  },
  body: {
    gap: Spacing.three,
    paddingBottom: Spacing.one,
  },
  footer: {
    gap: Spacing.two,
  },
});
