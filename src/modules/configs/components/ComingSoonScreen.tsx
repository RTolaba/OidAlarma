import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';

export function ComingSoonScreen({ title }: { title: string }) {
  return (
    <ScreenContainer>
      <ThemedText type="title">{title}</ThemedText>
      <ThemedText themeColor="textSecondary">Próximamente.</ThemedText>
    </ScreenContainer>
  );
}
