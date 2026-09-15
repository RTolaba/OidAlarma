import type { IconName } from '@/components/ui/Icon';

/**
 * Alarmas que no dependen de la hora sino de un evento del dispositivo.
 */
export type TriggerKind = 'internet' | 'wifi' | 'power';

export type Trigger = {
  id: string;
  kind: TriggerKind;
  label: string;
  enabled: boolean;
  lastFiredAt: number | null;
  createdAt: number;
};

export type TriggerDraft = Pick<Trigger, 'kind' | 'label'>;

export const TRIGGER_META: Record<
  TriggerKind,
  { title: string; description: string; icon: IconName }
> = {
  internet: {
    title: 'Volvió internet',
    description: 'Avisa cuando se recupera la conexión, por wifi o por datos.',
    icon: 'wifi',
  },
  wifi: {
    title: 'Volvió el wifi',
    description: 'Avisa solo cuando el dispositivo se reconecta a una red wifi.',
    icon: 'wifi',
  },
  power: {
    title: 'Volvió la luz',
    description: 'Dejá el celular enchufado: avisa cuando vuelve a cargar.',
    icon: 'power',
  },
};
