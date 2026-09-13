import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/**
 * Storage compartido por todos los stores persistidos.
 */
export const persistedStorage = createJSONStorage(() => AsyncStorage);
