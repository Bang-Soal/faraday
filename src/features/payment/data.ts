import {SubscriptionType} from '../../types/api';

export type SubscriptionPlan = {
  type: SubscriptionType;
  title: string;
  durationMonths: number;
  price: number;
  totalPrice: number;
  originalTotalPrice?: number;
  discountLabel?: string;
  accent: string;
  features: string[];
};

// Pricing mirrors dijkstra (live web) — see dijkstra/src/app/langganan/data/price.ts
// and PriceTabs.tsx for the discount framing (original = own monthly rate x months).
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    type: 'pemula',
    title: 'Pelajar Pemula',
    durationMonths: 1,
    price: 24000,
    totalPrice: 24000,
    accent: '#F9FAFB',
    features: [
      'Akses pembahasan latihan soal',
      'Upgrade akun selama 30 hari',
      'Cocok untuk mulai belajar rutin',
    ],
  },
  {
    type: 'setia',
    title: 'Pelajar Setia',
    durationMonths: 3,
    price: 22000,
    totalPrice: 58000,
    originalTotalPrice: 66000,
    discountLabel: '-10%',
    accent: '#34D399',
    features: [
      'Akses pembahasan latihan soal',
      'Upgrade akun selama 90 hari',
      'Pilihan hemat untuk belajar konsisten',
    ],
  },
  {
    type: 'ambis',
    title: 'Pelajar Ambis',
    durationMonths: 6,
    price: 20000,
    totalPrice: 100000,
    originalTotalPrice: 120000,
    discountLabel: '-20%',
    accent: '#A5B4FC',
    features: [
      'Akses pembahasan latihan soal',
      'Upgrade akun selama 180 hari',
      'Paket terbaik untuk persiapan panjang',
    ],
  },
];

export function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString('id-ID')}`;
}

export function capitalizePlan(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
