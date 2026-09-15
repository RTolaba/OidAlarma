import type { AudioSource } from 'expo-audio';

export const DEFAULT_RINGTONE = 'ring_rock';

export const RINGTONES = {
  ring_rock: {
    id: 'ring_rock',
    label: 'Ring rock',
    fileName: 'ring_rock.mp3',
    source: require('@/assets/ringtones/ring_rock.mp3') as AudioSource,
  },
  hip_hop_news: {
    id: 'hip_hop_news',
    label: 'Hip hop news',
    fileName: 'hip_hop_news.mp3',
    source: require('@/assets/ringtones/hip_hop_news.mp3') as AudioSource,
  },
} as const;

export type RingtoneId = keyof typeof RINGTONES;

export const RINGTONE_IDS = Object.keys(RINGTONES) as RingtoneId[];

const LEGACY_IDS: Record<string, RingtoneId> = {
  'ring-rock': 'ring_rock',
  'hip-hop-news': 'hip_hop_news',
};

export function isRingtoneId(value: string | undefined): value is RingtoneId {
  return value !== undefined && value in RINGTONES;
}

export function resolveRingtone(id: string | undefined) {
  const mapped = id ? (LEGACY_IDS[id] ?? id) : DEFAULT_RINGTONE;
  return RINGTONES[isRingtoneId(mapped) ? mapped : DEFAULT_RINGTONE];
}
