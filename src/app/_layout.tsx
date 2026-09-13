import * as SplashScreen from 'expo-splash-screen';

import { SplashOverlay } from '@/modules/configs/components/SplashOverlay';
import { TabBar } from '@/modules/configs/navigation/TabBar';
import { AppProviders } from '@/modules/configs/providers/AppProviders';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppProviders>
      <SplashOverlay />
      <TabBar />
    </AppProviders>
  );
}
