import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { ThemedText } from '@/components/ui/ThemedText';

import { functionsStyles as styles } from '../styles/Functions.styles';

export type FunctionPanelProps = {
  title: string;
  icon: IconName;
  subtitle?: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  children: ReactNode;
};

/**
 * Seccion grande de la screen de funciones. Se puede expandir a pantalla completa.
 */
export function FunctionPanel({
  title,
  icon,
  subtitle,
  expanded,
  onToggleExpanded,
  children,
}: FunctionPanelProps) {
  return (
    <Card style={styles.panel}>
      <View style={styles.panelHeader}>
        <Icon name={icon} size={18} themeColor="textSecondary" />
        <ThemedText type="section" style={styles.panelTitle}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textTertiary">
            {subtitle}
          </ThemedText>
        ) : null}
        <IconButton
          name={expanded ? 'chevronDown' : 'chevronRight'}
          accessibilityLabel={expanded ? `Contraer ${title}` : `Expandir ${title}`}
          onPress={onToggleExpanded}
        />
      </View>

      <View style={styles.panelBody}>{children}</View>
    </Card>
  );
}
