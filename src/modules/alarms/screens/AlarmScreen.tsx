import { router } from 'expo-router';

import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Routes } from '@/modules/configs/navigation/routes';

import { AlarmsList } from '../components/AlarmsList';
import { Clock } from '../components/Clock';

export function AlarmScreen() {
  return (
    <ScreenContainer scroll>
      <Clock onPress={() => router.push(Routes.clock)} />
      <SectionHeader title="Alarmas" description="Tocá el reloj para ver el detalle." />
      <AlarmsList />
    </ScreenContainer>
  );
}
