import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistedStorage } from '@/modules/configs/stores/storage';

const CACHE_MS = 15 * 60 * 1000;

type WeatherState = {
  celsius: number | null;
  city: string | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  updatedAt: number | null;
  fetchWeather: (force?: boolean) => Promise<void>;
};

/**
 * Temperatura actual aproximada. Se resuelve la ubicacion por IP para no pedir
 * permisos de geolocalizacion; ambos servicios son publicos y sin API key.
 */
export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      celsius: null,
      city: null,
      status: 'idle',
      updatedAt: null,
      fetchWeather: async (force = false) => {
        const { status, updatedAt } = get();
        if (status === 'loading') return;
        if (!force && updatedAt && Date.now() - updatedAt < CACHE_MS) return;

        set({ status: 'loading' });

        try {
          const locationResponse = await fetch('https://ipapi.co/json/');
          if (!locationResponse.ok) throw new Error('No se pudo resolver la ubicación');
          const location = (await locationResponse.json()) as {
            latitude: number;
            longitude: number;
            city?: string;
          };

          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m`,
          );
          if (!weatherResponse.ok) throw new Error('No se pudo leer el clima');
          const weather = (await weatherResponse.json()) as {
            current?: { temperature_2m?: number };
          };

          const celsius = weather.current?.temperature_2m;
          if (celsius === undefined) throw new Error('Respuesta sin temperatura');

          set({
            celsius,
            city: location.city ?? null,
            status: 'ready',
            updatedAt: Date.now(),
          });
        } catch {
          set({ status: 'error' });
        }
      },
    }),
    {
      name: 'oidalarma:weather',
      storage: persistedStorage,
      partialize: (state) => ({
        celsius: state.celsius,
        city: state.city,
        updatedAt: state.updatedAt,
      }),
    },
  ),
);

export const toFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32;

export function formatTemperature(celsius: number | null, unit: 'celsius' | 'fahrenheit') {
  if (celsius === null) return '--°';
  const value = unit === 'celsius' ? celsius : toFahrenheit(celsius);
  return `${Math.round(value)}°${unit === 'celsius' ? 'C' : 'F'}`;
}
